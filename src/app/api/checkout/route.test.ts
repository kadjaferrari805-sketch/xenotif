/**
 * @jest-environment node
 */
// Environnement Node : les Route Handlers importent `next/server`, qui requiert
// les globals Fetch API natifs à Node (cf. src/app/api/streak/route.test.ts).
import { NextRequest } from 'next/server'

const mockCreateSession = jest.fn()
let mockUser: { id: string; email: string } | null = null

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    checkout: { sessions: { create: (...args: unknown[]) => mockCreateSession(...args) } },
  })),
}))
jest.mock('../../../lib/supabase/session', () => ({ getCurrentUser: async () => mockUser }))
jest.mock('../../../lib/ga-measurement', () => ({ parseGaClientId: () => '' }))

import { POST } from './route'

const request = (body: Record<string, unknown>) =>
  new NextRequest('http://localhost/api/checkout', { method: 'POST', body: JSON.stringify(body) })

beforeEach(() => {
  jest.clearAllMocks()
  process.env.STRIPE_SECRET_KEY = 'sk_test'
  mockCreateSession.mockResolvedValue({ url: 'https://checkout.stripe.com/c/pay/cs_test' })
})

describe('POST /api/checkout', () => {
  test('connecté : le compte vient de la session, jamais du corps de la requête', async () => {
    mockUser = { id: 'user-session', email: 'moi@exemple.fr' }
    const res = await POST(request({ plan: 'pro', userId: 'user-victime', email: 'victime@exemple.fr' }))

    expect(res.status).toBe(200)
    const params = mockCreateSession.mock.calls[0][0]
    expect(params.client_reference_id).toBe('user-session')
    expect(params.customer_email).toBe('moi@exemple.fr')
    expect(params.subscription_data.metadata.user_id).toBe('user-session')
    expect(params.metadata.user_id).toBe('user-session')
  })

  test('sans session : aucun rattachement par ID, e-mail seulement pré-rempli', async () => {
    mockUser = null
    await POST(request({ plan: 'pro', userId: 'user-victime', email: 'nouveau@exemple.fr' }))

    const params = mockCreateSession.mock.calls[0][0]
    expect(params.client_reference_id).toBeUndefined()
    expect(params.customer_email).toBe('nouveau@exemple.fr')
    expect(params.subscription_data.metadata.user_id).toBe('')
  })

  test('plan inconnu → 400', async () => {
    mockUser = null
    const res = await POST(request({ plan: 'elite' }))
    expect(res.status).toBe(400)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })
})
