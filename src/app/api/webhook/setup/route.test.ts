/**
 * @jest-environment node
 */
// Environnement Node : les Route Handlers importent `next/server`, qui requiert
// les globals Fetch API natifs à Node (cf. src/app/api/streak/route.test.ts).

const mockListEndpoints = jest.fn()
const mockDeleteEndpoint = jest.fn()
const mockCreateEndpoint = jest.fn()

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    webhookEndpoints: {
      list: (...args: unknown[]) => mockListEndpoints(...args),
      del: (...args: unknown[]) => mockDeleteEndpoint(...args),
      create: (...args: unknown[]) => mockCreateEndpoint(...args),
    },
  })),
}))

import { POST } from './route'

const request = (body?: string) =>
  new Request('http://localhost/api/webhook/setup', { method: 'POST', ...(body === undefined ? {} : { body }) })

const stripeTouched = () =>
  mockListEndpoints.mock.calls.length + mockDeleteEndpoint.mock.calls.length + mockCreateEndpoint.mock.calls.length > 0

beforeEach(() => {
  jest.clearAllMocks()
  delete process.env.SETUP_SECRET
  delete process.env.VERCEL_TOKEN
  process.env.STRIPE_SECRET_KEY = 'sk_test'
  mockListEndpoints.mockResolvedValue({ data: [] })
  mockCreateEndpoint.mockResolvedValue({ id: 'we_test', secret: 'whsec_test' })
})

describe('POST /api/webhook/setup', () => {
  test('SETUP_SECRET non configuré : corps vide refusé, Stripe jamais appelé', async () => {
    for (const body of [undefined, '{}', '{"secret":null}', 'pas du json']) {
      const res = await POST(request(body))
      expect(res.status).toBe(401)
    }
    expect(stripeTouched()).toBe(false)
  })

  test('SETUP_SECRET non configuré : même une valeur fournie est refusée', async () => {
    const res = await POST(request('{"secret":"nimportequoi"}'))
    expect(res.status).toBe(401)
    expect(stripeTouched()).toBe(false)
  })

  test('SETUP_SECRET configuré : secret absent ou faux refusé', async () => {
    process.env.SETUP_SECRET = 'bon-secret'
    for (const body of [undefined, '{}', '{"secret":"mauvais"}', '{"secret":"bon-secre"}', '{"secret":123}']) {
      const res = await POST(request(body))
      expect(res.status).toBe(401)
    }
    expect(stripeTouched()).toBe(false)
  })

  test('SETUP_SECRET configuré : le bon secret autorise la configuration', async () => {
    process.env.SETUP_SECRET = 'bon-secret'
    const res = await POST(request('{"secret":"bon-secret"}'))
    expect(res.status).toBe(200)
    expect(mockCreateEndpoint).toHaveBeenCalledTimes(1)
  })
})
