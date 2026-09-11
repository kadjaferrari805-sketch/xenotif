/**
 * @jest-environment node
 */
// Environnement Node : les Route Handlers importent `next/server`, qui requiert
// les globals Fetch API natifs à Node (cf. src/app/api/streak/route.test.ts).
import { NextRequest } from 'next/server'
import { createFakeSupabase, type FakeTables } from '../../../../test/fake-supabase'

const mockConstructEvent = jest.fn()
const mockRetrieveSubscription = jest.fn()
let mockService = createFakeSupabase()

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    webhooks: { constructEvent: (...args: unknown[]) => mockConstructEvent(...args) },
    subscriptions: { retrieve: (...args: unknown[]) => mockRetrieveSubscription(...args) },
  })),
}))
jest.mock('../../../../lib/supabase/server', () => ({
  createServiceClient: async () => mockService.client,
}))
jest.mock('../../../../lib/emails', () => ({
  sendWelcomeEmail: jest.fn(),
  sendTrialReminderEmail: jest.fn(),
  sendCancellationEmail: jest.fn(),
  sendDigitalDeliveryEmail: jest.fn(),
}))
jest.mock('../../../../lib/meta-capi', () => ({ sendMetaConversion: jest.fn() }))
jest.mock('../../../../lib/ga-measurement', () => ({ sendGa4Purchase: jest.fn() }))
jest.mock('../../../../lib/boutique/products', () => ({ getProductById: jest.fn() }))

import { POST } from './route'
import { sendWelcomeEmail } from '../../../../lib/emails'

const request = () =>
  new NextRequest('http://localhost/api/webhook/stripe', {
    method: 'POST',
    body: '{}',
    headers: { 'stripe-signature': 't=1,v1=signature' },
  })

const subscription = {
  id: 'sub_123',
  customer: 'cus_123',
  status: 'unpaid',
  trial_end: null,
  cancel_at_period_end: false,
  metadata: {},
  items: { data: [{ current_period_end: 1_800_000_000 }] },
}

function useService(tables: FakeTables, admin: Record<string, unknown> = {}) {
  mockService = createFakeSupabase(tables, { auth: { admin } })
  return mockService
}

beforeEach(() => {
  jest.clearAllMocks()
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
})

describe('POST /api/webhook/stripe', () => {
  test('signature invalide → 400', async () => {
    useService({})
    mockConstructEvent.mockImplementation(() => { throw new Error('bad signature') })
    const res = await POST(request())
    expect(res.status).toBe(400)
  })

  test('événement déjà traité → 200 sans retraitement', async () => {
    const service = useService({ stripe_events: { select: { data: { id: 'evt_1' } } } })
    mockConstructEvent.mockReturnValue({ id: 'evt_1', type: 'customer.subscription.updated', data: { object: subscription } })

    const res = await POST(request())
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ received: true, duplicate: true })
    expect(service.calls.some(c => c.table === 'subscriptions')).toBe(false)
  })

  test('échec d’écriture en base → 500 (Stripe relancera) et événement non journalisé', async () => {
    const service = useService({
      subscriptions: { select: { data: { user_id: 'user-1' } }, update: { error: { message: 'panne base' } } },
    })
    mockConstructEvent.mockReturnValue({ id: 'evt_2', type: 'customer.subscription.updated', data: { object: subscription } })

    const res = await POST(request())
    expect(res.status).toBe(500)
    expect(service.calls.some(c => c.table === 'stripe_events' && c.op === 'insert')).toBe(false)
  })

  test('mise à jour réussie → statut Stripe converti et événement journalisé', async () => {
    const service = useService({ subscriptions: { select: { data: { user_id: 'user-1' } } } })
    mockConstructEvent.mockReturnValue({ id: 'evt_3', type: 'customer.subscription.updated', data: { object: subscription } })

    const res = await POST(request())
    expect(res.status).toBe(200)
    const update = service.calls.find(c => c.table === 'subscriptions' && c.op === 'update')
    expect(update?.payload).toMatchObject({ status: 'past_due', plan: 'pro' })
    expect(service.calls.find(c => c.table === 'stripe_events' && c.op === 'insert')?.payload).toEqual({
      id: 'evt_3',
      type: 'customer.subscription.updated',
    })
  })

  test('événement reçu après suppression du compte → 200, rien n’est recréé ni envoyé', async () => {
    const service = useService({ subscriptions: { select: { data: null } } })
    mockConstructEvent.mockReturnValue({
      id: 'evt_apres_suppression',
      type: 'customer.subscription.deleted',
      data: { object: { ...subscription, status: 'canceled' } },
    })

    const res = await POST(request())
    expect(res.status).toBe(200)
    expect(service.calls.some(c => c.table === 'subscriptions' && (c.op === 'insert' || c.op === 'upsert'))).toBe(false)
    expect(service.calls.find(c => c.table === 'stripe_events' && c.op === 'insert')?.payload).toEqual({
      id: 'evt_apres_suppression',
      type: 'customer.subscription.deleted',
    })
  })

  test('checkout sans ID de compte → retrouve le compte au-delà de 200 utilisateurs', async () => {
    const firstPage = Array.from({ length: 1000 }, (_, i) => ({ id: `u${i}`, email: `membre${i}@exemple.fr` }))
    const listUsers = jest.fn()
      .mockResolvedValueOnce({ data: { users: firstPage }, error: null })
      .mockResolvedValueOnce({ data: { users: [{ id: 'user-cible', email: 'client@exemple.fr' }] }, error: null })
    const createUser = jest.fn()
    const service = useService({ subscriptions: { select: { data: [] } } }, { listUsers, createUser })
    mockRetrieveSubscription.mockResolvedValue({ ...subscription, status: 'trialing' })
    mockConstructEvent.mockReturnValue({
      id: 'evt_4',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_1',
          mode: 'subscription',
          subscription: 'sub_123',
          customer_details: { email: 'client@exemple.fr', name: 'Client' },
          client_reference_id: null,
          metadata: { locale: 'de' },
        },
      },
    })

    const res = await POST(request())
    expect(res.status).toBe(200)
    expect(createUser).not.toHaveBeenCalled()
    expect(service.calls.find(c => c.op === 'upsert')?.payload).toMatchObject({ user_id: 'user-cible', status: 'trialing' })
    expect(sendWelcomeEmail).toHaveBeenCalledWith(expect.objectContaining({ email: 'client@exemple.fr', locale: 'de' }))
  })

  test('checkout qui écraserait l’abonnement actif d’un autre compte → rien n’est écrit', async () => {
    const getUserById = jest.fn().mockResolvedValue({ data: { user: { id: 'user-1', email: 'moi@exemple.fr' } } })
    const service = useService({
      subscriptions: { select: { data: [{ user_id: 'user-1', stripe_subscription_id: 'sub_legitime', status: 'active' }] } },
    }, { getUserById })
    mockRetrieveSubscription.mockResolvedValue({ ...subscription, status: 'trialing' })
    mockConstructEvent.mockReturnValue({
      id: 'evt_5',
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_2', mode: 'subscription', subscription: 'sub_123', client_reference_id: 'user-1', metadata: {} } },
    })

    const res = await POST(request())
    expect(res.status).toBe(200)
    expect(service.calls.some(c => c.op === 'upsert')).toBe(false)
    expect(sendWelcomeEmail).not.toHaveBeenCalled()
  })
})
