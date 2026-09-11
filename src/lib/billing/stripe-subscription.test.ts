import type Stripe from 'stripe'
import {
  findUserIdByEmail,
  isClaimableBy,
  linkSubscriptionToUser,
  subscriptionRow,
  toDbStatus,
} from './stripe-subscription'
import { createFakeSupabase } from '@/test/fake-supabase'

function stripeSub(overrides: Partial<Record<string, unknown>> = {}): Stripe.Subscription {
  return {
    id: 'sub_123',
    customer: 'cus_123',
    status: 'active',
    trial_end: null,
    cancel_at_period_end: false,
    metadata: {},
    items: { data: [{ current_period_end: 1_800_000_000 }] },
    ...overrides,
  } as unknown as Stripe.Subscription
}

describe('toDbStatus', () => {
  test('conserve les 5 statuts acceptés par la table', () => {
    for (const s of ['trialing', 'active', 'canceled', 'past_due', 'incomplete'] as const) {
      expect(toDbStatus(s)).toBe(s)
    }
  })

  test('ramène les autres statuts Stripe vers un statut autorisé', () => {
    expect(toDbStatus('unpaid')).toBe('past_due')
    expect(toDbStatus('incomplete_expired')).toBe('canceled')
    expect(toDbStatus('paused')).toBe('canceled')
  })
})

describe('subscriptionRow', () => {
  test('construit la ligne à partir de l’abonnement Stripe', () => {
    expect(subscriptionRow(stripeSub({ status: 'unpaid', customer: { id: 'cus_obj' } }), 'user-1')).toEqual({
      user_id: 'user-1',
      stripe_customer_id: 'cus_obj',
      stripe_subscription_id: 'sub_123',
      plan: 'pro',
      status: 'past_due',
      trial_end: null,
      current_period_end: new Date(1_800_000_000 * 1000).toISOString(),
      cancel_at_period_end: false,
    })
  })
})

describe('isClaimableBy', () => {
  test('accepte un abonnement sans propriétaire ou créé pour ce compte', () => {
    expect(isClaimableBy(stripeSub(), 'user-1')).toBe(true)
    expect(isClaimableBy(stripeSub({ metadata: { user_id: 'user-1' } }), 'user-1')).toBe(true)
  })

  test('refuse un abonnement créé pour un autre compte', () => {
    expect(isClaimableBy(stripeSub({ metadata: { user_id: 'user-2' } }), 'user-1')).toBe(false)
  })
})

describe('findUserIdByEmail', () => {
  const page = (count: number, offset = 0) =>
    Array.from({ length: count }, (_, i) => ({ id: `u${offset + i}`, email: `membre${offset + i}@exemple.fr` }))

  test('parcourt les pages au-delà de la première', async () => {
    const listUsers = jest.fn()
      .mockResolvedValueOnce({ data: { users: page(1000) }, error: null })
      .mockResolvedValueOnce({ data: { users: [...page(10, 1000), { id: 'cible', email: 'Cible@Exemple.fr' }] }, error: null })
    const { client } = createFakeSupabase({}, { auth: { admin: { listUsers } } })

    await expect(findUserIdByEmail(client, ' cible@exemple.FR ')).resolves.toBe('cible')
    expect(listUsers).toHaveBeenNthCalledWith(2, { page: 2, perPage: 1000 })
  })

  test('renvoie null quand la dernière page ne contient pas l’e-mail', async () => {
    const listUsers = jest.fn().mockResolvedValue({ data: { users: page(3) }, error: null })
    const { client } = createFakeSupabase({}, { auth: { admin: { listUsers } } })
    await expect(findUserIdByEmail(client, 'absent@exemple.fr')).resolves.toBeNull()
  })

  test('propage une erreur de l’API admin', async () => {
    const listUsers = jest.fn().mockResolvedValue({ data: null, error: new Error('panne') })
    const { client } = createFakeSupabase({}, { auth: { admin: { listUsers } } })
    await expect(findUserIdByEmail(client, 'x@exemple.fr')).rejects.toThrow('panne')
  })
})

describe('linkSubscriptionToUser', () => {
  test('rattache quand rien n’existe', async () => {
    const { client, calls } = createFakeSupabase({ subscriptions: { select: { data: [] } } })
    await expect(linkSubscriptionToUser(client, 'user-1', stripeSub())).resolves.toBe('linked')
    const upsert = calls.find(c => c.op === 'upsert')
    expect(upsert?.payload).toMatchObject({ user_id: 'user-1', stripe_subscription_id: 'sub_123' })
  })

  test('refuse un abonnement ou un client déjà rattaché à un autre compte', async () => {
    const { client, calls } = createFakeSupabase({
      subscriptions: { select: { data: [{ user_id: 'user-2', stripe_subscription_id: 'sub_123', status: 'active' }] } },
    })
    await expect(linkSubscriptionToUser(client, 'user-1', stripeSub())).resolves.toBe('already_linked')
    expect(calls.some(c => c.op === 'upsert')).toBe(false)
  })

  test('n’écrase pas un autre abonnement encore actif du compte', async () => {
    const { client, calls } = createFakeSupabase({
      subscriptions: { select: { data: [{ user_id: 'user-1', stripe_subscription_id: 'sub_autre', status: 'trialing' }] } },
    })
    await expect(linkSubscriptionToUser(client, 'user-1', stripeSub())).resolves.toBe('user_has_other_subscription')
    expect(calls.some(c => c.op === 'upsert')).toBe(false)
  })

  test('un abonnement Stripe terminé ne retire pas un accès actif sans Stripe (RevenueCat)', async () => {
    const { client, calls } = createFakeSupabase({
      subscriptions: { select: { data: [{ user_id: 'user-1', stripe_subscription_id: null, status: 'active' }] } },
    })
    await expect(linkSubscriptionToUser(client, 'user-1', stripeSub({ status: 'canceled' }))).resolves.toBe('user_has_other_subscription')
    expect(calls.some(c => c.op === 'upsert')).toBe(false)
  })

  test('un abonnement Stripe actif remplace un accès sans Stripe (Stripe fait autorité sur le web)', async () => {
    const { client, calls } = createFakeSupabase({
      subscriptions: { select: { data: [{ user_id: 'user-1', stripe_subscription_id: null, status: 'active' }] } },
    })
    await expect(linkSubscriptionToUser(client, 'user-1', stripeSub({ status: 'trialing' }))).resolves.toBe('linked')
    expect(calls.find(c => c.op === 'upsert')?.payload).toMatchObject({ stripe_subscription_id: 'sub_123', status: 'trialing' })
  })

  test('remplace un ancien abonnement résilié du même compte', async () => {
    const { client } = createFakeSupabase({
      subscriptions: { select: { data: [{ user_id: 'user-1', stripe_subscription_id: 'sub_ancien', status: 'canceled' }] } },
    })
    await expect(linkSubscriptionToUser(client, 'user-1', stripeSub())).resolves.toBe('linked')
  })

  test('lève une erreur si l’écriture échoue', async () => {
    const { client } = createFakeSupabase({
      subscriptions: { select: { data: [] }, upsert: { error: { message: 'violation' } } },
    })
    await expect(linkSubscriptionToUser(client, 'user-1', stripeSub())).rejects.toMatchObject({ message: 'violation' })
  })

  test('refuse des identifiants Stripe qui sortiraient du filtre', async () => {
    const { client } = createFakeSupabase({ subscriptions: { select: { data: [] } } })
    await expect(linkSubscriptionToUser(client, 'user-1', stripeSub({ id: 'sub_1,user_id.neq.x' }))).rejects.toThrow('Identifiants Stripe inattendus')
  })
})
