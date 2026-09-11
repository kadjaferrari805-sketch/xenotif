/**
 * @jest-environment node
 */
// Environnement Node : les Route Handlers importent `next/server`, qui requiert
// les globals Fetch API natifs à Node (cf. src/app/api/streak/route.test.ts).
import { createFakeSupabase } from '../../../test/fake-supabase'

const mockUpdateSubscription = jest.fn()
let mockUser: { id: string } | null = null
let mockService = createFakeSupabase()

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    subscriptions: { update: (...args: unknown[]) => mockUpdateSubscription(...args) },
  })),
}))
jest.mock('../../../lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: mockUser } }) } }),
  createServiceClient: async () => mockService.client,
}))

import { POST } from './route'

beforeEach(() => {
  jest.clearAllMocks()
  process.env.STRIPE_SECRET_KEY = 'sk_test'
})

describe('POST /api/cancel-subscription', () => {
  test('non authentifié → 401, ni base ni Stripe', async () => {
    mockUser = null
    mockService = createFakeSupabase()
    const res = await POST()
    expect(res.status).toBe(401)
    expect(mockService.calls).toHaveLength(0)
    expect(mockUpdateSubscription).not.toHaveBeenCalled()
  })

  test('le compte connecté ne résilie que son propre abonnement', async () => {
    mockUser = { id: 'user-A' }
    mockService = createFakeSupabase({ subscriptions: { select: { data: { stripe_subscription_id: 'sub_A' } } } })

    const res = await POST()
    expect(res.status).toBe(200)
    const read = mockService.calls.find(c => c.op === 'select')
    expect(read?.filters).toEqual([['eq', 'user_id', 'user-A']])
    expect(mockUpdateSubscription).toHaveBeenCalledWith('sub_A', { cancel_at_period_end: true })
    const write = mockService.calls.find(c => c.op === 'update')
    expect(write?.filters).toEqual([['eq', 'user_id', 'user-A']])
  })
})
