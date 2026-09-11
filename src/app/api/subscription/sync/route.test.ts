/**
 * @jest-environment node
 */
// Environnement Node : les Route Handlers importent `next/server`, qui requiert
// les globals Fetch API natifs à Node (cf. src/app/api/streak/route.test.ts).
import { createFakeSupabase } from '../../../../test/fake-supabase'

const mockListCustomers = jest.fn()
const mockListSubscriptions = jest.fn()
let mockUser: { id: string; email?: string } | null = null
let mockService = createFakeSupabase()

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    customers: { list: (...args: unknown[]) => mockListCustomers(...args) },
    subscriptions: { list: (...args: unknown[]) => mockListSubscriptions(...args) },
  })),
}))
jest.mock('../../../../lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: mockUser } }) } }),
  createServiceClient: async () => mockService.client,
}))

import { POST } from './route'

const sub = (metadata: Record<string, string> = {}) => ({
  id: 'sub_123',
  customer: 'cus_123',
  status: 'active',
  trial_end: null,
  cancel_at_period_end: false,
  metadata,
  items: { data: [{ current_period_end: 1_800_000_000 }] },
})

beforeEach(() => {
  jest.clearAllMocks()
  process.env.STRIPE_SECRET_KEY = 'sk_test'
  mockUser = { id: 'user-1', email: 'moi@exemple.fr' }
  mockService = createFakeSupabase({ subscriptions: { select: { data: [] } } })
  mockListCustomers.mockResolvedValue({ data: [{ id: 'cus_123' }] })
})

describe('POST /api/subscription/sync', () => {
  test('non authentifié → 401', async () => {
    mockUser = null
    const res = await POST()
    expect(res.status).toBe(401)
  })

  test('cherche uniquement par l’e-mail du compte', async () => {
    mockListSubscriptions.mockResolvedValue({ data: [] })
    await POST()
    expect(mockListCustomers).toHaveBeenCalledWith({ email: 'moi@exemple.fr', limit: 10 })
  })

  test('ignore un abonnement créé pour un autre compte', async () => {
    mockListSubscriptions.mockResolvedValue({ data: [sub({ user_id: 'user-2' })] })
    const res = await POST()
    await expect(res.json()).resolves.toEqual({ synced: false, reason: 'no_subscription' })
    expect(mockService.calls.some(c => c.op === 'upsert')).toBe(false)
  })

  test('rattache l’abonnement du compte', async () => {
    mockListSubscriptions.mockResolvedValue({ data: [sub()] })
    const res = await POST()
    await expect(res.json()).resolves.toEqual({ synced: true, plan: 'pro', status: 'active' })
    expect(mockService.calls.find(c => c.op === 'upsert')?.payload).toMatchObject({ user_id: 'user-1' })
  })

  test('refuse un abonnement déjà rattaché à un autre compte', async () => {
    mockService = createFakeSupabase({
      subscriptions: { select: { data: [{ user_id: 'user-2', stripe_subscription_id: 'sub_123', status: 'active' }] } },
    })
    mockListSubscriptions.mockResolvedValue({ data: [sub()] })
    const res = await POST()
    await expect(res.json()).resolves.toEqual({ synced: false, reason: 'already_linked' })
  })
})
