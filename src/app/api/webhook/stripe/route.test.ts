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
  // Clé factice de TEST : la garde d'environnement du webhook exige désormais
  // une clé Stripe autorisée avant tout appel (cf. environment.test.ts).
  process.env.STRIPE_SECRET_KEY = 'sk_test_factice'
  delete process.env.VERCEL_ENV
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

// ─── K8.4 : marquage du panier récupéré ────────────────────────────
//
// Avant, `recovered` était posé par `.eq('email', …)` : un achat marquait TOUS
// les paniers partageant l'adresse. Depuis le jeton, la ligne payée est
// désignée précisément. Le repli sur l'adresse reste indispensable tant que des
// sessions Stripe créées avant ce déploiement peuvent encore aboutir.
describe('POST /api/webhook/stripe — panier récupéré (K8.4)', () => {
  /** Événement d'achat boutique, avec ou sans jeton dans les métadonnées. */
  const achatBoutique = (metadata: Record<string, string>) => ({
    id: 'evt_cart',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_boutique',
        mode: 'payment',
        customer_details: { email: 'Client@Exemple.FR', name: 'Client' },
        amount_total: 0,
        metadata,
      },
    },
  })

  /** Opérations subies par abandoned_carts, avec leurs filtres. */
  const majPanier = (service: ReturnType<typeof useService>) =>
    service.calls.filter(c => c.table === 'abandoned_carts' && c.op === 'update')

  test('A. jeton présent : la recherche se fait PAR JETON, jamais par adresse', async () => {
    const service = useService({ abandoned_carts: { update: {} } })
    mockConstructEvent.mockReturnValue(achatBoutique({ cart_token: 'tok-paye', locale: 'fr' }))

    const res = await POST(request())

    expect(res.status).toBe(200)
    const maj = majPanier(service)
    expect(maj).toHaveLength(1)
    expect(maj[0].payload).toEqual({ recovered: true })
    expect(maj[0].filters).toEqual([['eq', 'cart_token', 'tok-paye']])
    // L'adresse ne doit apparaître dans AUCUN filtre : c'est tout l'objet du
    // correctif — un achat ne marque plus les paniers homonymes.
    expect(JSON.stringify(maj[0].filters)).not.toContain('email')
  })

  test('B. jeton absent : le panier le plus récent est DÉSIGNÉ, puis marqué par id', async () => {
    const service = useService({
      abandoned_carts: { select: { data: { id: 'panier-recent' } }, update: {} },
    })
    mockConstructEvent.mockReturnValue(achatBoutique({ locale: 'fr' }))

    const res = await POST(request())

    expect(res.status).toBe(200)
    // La désignation porte l'adresse normalisée ET un ordre total borné à 1.
    const lecture = service.calls.find(c => c.table === 'abandoned_carts' && c.op === 'select')
    expect(lecture?.filters).toEqual([
      ['eq', 'email', 'client@exemple.fr'],
      ['order', 'updated_at', { ascending: false }],
      ['order', 'id', { ascending: false }],
      ['limit', 1],
    ])
    // Le marquage, lui, ne connaît plus que l'identifiant de ligne.
    const maj = majPanier(service)
    expect(maj).toHaveLength(1)
    expect(maj[0].payload).toEqual({ recovered: true })
    expect(maj[0].filters).toEqual([['eq', 'id', 'panier-recent']])
    expect(JSON.stringify(maj[0].filters)).not.toContain('email')
  })

  test('B-bis. jeton absent et AUCUN panier pour l’adresse : rien n’est écrit', async () => {
    const service = useService({ abandoned_carts: { select: { data: null }, update: {} } })
    mockConstructEvent.mockReturnValue(achatBoutique({ locale: 'fr' }))

    const res = await POST(request())

    expect(res.status).toBe(200)
    expect(majPanier(service)).toHaveLength(0)
  })

  test('B-ter. plusieurs paniers à horodatage ÉGAL : le départage est délégué à un ordre total', async () => {
    const service = useService({
      abandoned_carts: { select: { data: { id: 'panier-zzz' } }, update: {} },
    })
    mockConstructEvent.mockReturnValue(achatBoutique({ locale: 'fr' }))

    await POST(request())

    // À `updated_at` égal, seul le second critère tranche. Sans lui, la ligne
    // marquée dépendrait de l'ordre rendu par Postgres.
    const lecture = service.calls.find(c => c.table === 'abandoned_carts' && c.op === 'select')
    expect(lecture?.filters).toContainEqual(['order', 'id', { ascending: false }])
    expect(lecture?.filters).toContainEqual(['limit', 1])
    expect(majPanier(service)).toHaveLength(1)
  })

  test('D. jeton valide dont le panier porte une AUTRE adresse : le jeton prime, l’adresse n’est jamais filtrée', async () => {
    const service = useService({ abandoned_carts: { update: {} } })
    // L'acheteur Stripe est `Client@Exemple.FR` ; le panier désigné par le jeton
    // peut appartenir à une autre adresse. Le webhook marque LA LIGNE PAYÉE.
    mockConstructEvent.mockReturnValue(achatBoutique({ cart_token: 'tok-autre-adresse', locale: 'fr' }))

    const res = await POST(request())

    expect(res.status).toBe(200)
    const maj = majPanier(service)
    expect(maj).toHaveLength(1)
    expect(maj[0].filters).toEqual([['eq', 'cart_token', 'tok-autre-adresse']])
    // Aucune lecture de repli ne doit avoir eu lieu.
    expect(service.calls.some(c => c.table === 'abandoned_carts' && c.op === 'select')).toBe(false)
    expect(JSON.stringify(maj[0].filters)).not.toContain('email')
  })

  // RÈGLE GÉNÉRALE — un événement Stripe ne marque JAMAIS plus d'un panier.
  // Les trois voies sont vérifiées séparément plutôt que dans une boucle :
  // `useService` porte le préfixe `use`, et la règle ESLint react-hooks refuse
  // un appel en boucle. Trois cas explicites se lisent mieux, et la règle reste
  // active — on ne désactive pas un garde-fou pour faire passer un test.
  const AU_PLUS_UN = (service: ReturnType<typeof useService>) => {
    expect(majPanier(service).length).toBeLessThanOrEqual(1)
    expect(JSON.stringify(majPanier(service).map(m => m.filters))).not.toContain('"email"')
  }

  test('RÈGLE GÉNÉRALE — voie jeton connu : au plus un panier marqué', async () => {
    const service = useService({ abandoned_carts: { update: {} } })
    mockConstructEvent.mockReturnValue(achatBoutique({ cart_token: 'tok-connu', locale: 'fr' }))

    await POST(request())
    AU_PLUS_UN(service)
  })

  test('RÈGLE GÉNÉRALE — voie jeton inconnu : au plus un panier marqué', async () => {
    const service = useService({ abandoned_carts: { update: {} } })
    mockConstructEvent.mockReturnValue(achatBoutique({ cart_token: 'tok-inconnu', locale: 'fr' }))

    await POST(request())
    AU_PLUS_UN(service)
  })

  test('RÈGLE GÉNÉRALE — voie repli adresse : au plus un panier marqué', async () => {
    const service = useService({
      abandoned_carts: { select: { data: { id: 'panier-recent' } }, update: {} },
    })
    mockConstructEvent.mockReturnValue(achatBoutique({ locale: 'fr' }))

    await POST(request())
    AU_PLUS_UN(service)
  })

  test('C. jeton présent mais inconnu : AUCUN repli, la mise à jour ne touche rien', async () => {
    const service = useService({ abandoned_carts: { update: {} } })
    mockConstructEvent.mockReturnValue(achatBoutique({ cart_token: 'tok-inexistant', locale: 'fr' }))

    const res = await POST(request())

    expect(res.status).toBe(200)
    const maj = majPanier(service)
    // Une seule opération, par jeton : le repli adresse n'est PAS déclenché.
    expect(maj).toHaveLength(1)
    expect(maj[0].filters).toEqual([['eq', 'cart_token', 'tok-inexistant']])
    expect(JSON.stringify(maj[0].filters)).not.toContain('email')
    // Conséquence assumée : aucune ligne n'est marquée. Replier sur l'adresse
    // réintroduirait le marquage croisé que K8-03 corrige.
  })

  test('une erreur de mise à jour n’interrompt pas le traitement de l’achat', async () => {
    useService({ abandoned_carts: { update: { error: { message: 'échec', code: 'XX000' } } } })
    mockConstructEvent.mockReturnValue(achatBoutique({ cart_token: 'tok-paye', locale: 'fr' }))

    const res = await POST(request())
    expect(res.status).toBe(200)
  })
})
