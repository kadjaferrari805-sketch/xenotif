/**
 * @jest-environment node
 */
// Garde d'environnement du webhook : en preview, seuls les événements Stripe de
// TEST sont acceptés, et une clé LIVE est refusée avant tout appel Stripe.
import { createFakeSupabase } from '../../../../test/fake-supabase'

const mockConstructEvent = jest.fn()
let mockService = createFakeSupabase()

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    webhooks: { constructEvent: (...args: unknown[]) => mockConstructEvent(...args) },
    subscriptions: { retrieve: jest.fn() },
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

const ORIGINAL = { ...process.env }

const request = () =>
  new Request('http://localhost/api/webhook/stripe', {
    method: 'POST',
    body: '{}',
    headers: { 'stripe-signature': 't=1,v1=signature' },
  })

async function postWith(env: Record<string, string | undefined>) {
  jest.resetModules()
  process.env = { ...ORIGINAL, ...env }
  const { POST } = await import('./route')
  const { NextRequest } = await import('next/server')
  return POST(new NextRequest(request()))
}

beforeEach(() => {
  jest.clearAllMocks()
  mockService = createFakeSupabase({ stripe_events: {} })
})

afterAll(() => {
  process.env = ORIGINAL
})

describe('webhook Stripe : garde d’environnement', () => {
  test('preview + clé LIVE → 500 sans aucun appel Stripe', async () => {
    const res = await postWith({
      VERCEL_ENV: 'preview',
      STRIPE_SECRET_KEY: 'sk_live_x',
      STRIPE_WEBHOOK_SECRET: 'whsec_test',
    })
    expect(res.status).toBe(500)
    expect(mockConstructEvent).not.toHaveBeenCalled()
  })

  test('preview + événement LIVE → 400, rien n’est traité', async () => {
    mockConstructEvent.mockReturnValue({
      id: 'evt_live',
      type: 'customer.subscription.updated',
      livemode: true,
      data: { object: {} },
    })
    const res = await postWith({
      VERCEL_ENV: 'preview',
      STRIPE_SECRET_KEY: 'sk_test_x',
      STRIPE_WEBHOOK_SECRET: 'whsec_test',
    })
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'Environment mismatch' })
  })

  test('preview + événement de TEST → accepté', async () => {
    mockConstructEvent.mockReturnValue({
      id: 'evt_test',
      type: 'customer.subscription.updated',
      livemode: false,
      data: { object: { id: 'sub_1', metadata: {} } },
    })
    const res = await postWith({
      VERCEL_ENV: 'preview',
      STRIPE_SECRET_KEY: 'sk_test_x',
      STRIPE_WEBHOOK_SECRET: 'whsec_test',
    })
    expect(res.status).toBe(200)
  })

  test('production + événement LIVE → accepté', async () => {
    mockConstructEvent.mockReturnValue({
      id: 'evt_prod',
      type: 'customer.subscription.updated',
      livemode: true,
      data: { object: { id: 'sub_1', metadata: {} } },
    })
    const res = await postWith({
      VERCEL_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_live_x',
      STRIPE_WEBHOOK_SECRET: 'whsec_test',
    })
    expect(res.status).toBe(200)
  })
})
