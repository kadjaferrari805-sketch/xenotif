/**
 * @jest-environment node
 */
// Environnement Node requis (et non le jsdom par défaut du projet, cf.
// jest.config.ts) : les Route Handlers importent `next/server`, qui référence
// les globals Fetch API (Request/Response/Headers) natifs à Node - absents de
// jsdom. Node les fournit nativement, sans polyfill.
import { GET } from './route'

jest.mock('../../../lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
}))

describe('GET /api/streak', () => {
  test('non authentifié → 401', async () => {
    const res = await GET()
    expect(res.status).toBe(401)
  })
})
