/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

const mockUpsert = jest.fn()

jest.mock('../../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({ from: () => ({ upsert: (...a: unknown[]) => mockUpsert(...a) }) }),
}))
jest.mock('../../../../lib/boutique/products', () => ({
  PRODUCTS: [{ id: 'd1' }, { id: 'd2' }],
}))

import { InMemoryRateLimitStore, setRateLimitStore } from '../../../../lib/security/rate-limit-store'
import { RateLimitStoreUnavailable } from '../../../../lib/security/rate-limit'
import { POST } from './route'

const ITEMS = [{ product_id: 'd1', quantity: 1 }]

const request = (body: Record<string, unknown>, ip = '203.0.113.7') =>
  new NextRequest('http://localhost/api/boutique/save-cart', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'x-forwarded-for': ip },
  })

beforeEach(() => {
  jest.clearAllMocks()
  mockUpsert.mockResolvedValue({ error: null })
  setRateLimitStore(new InMemoryRateLimitStore())
})

afterAll(() => setRateLimitStore(null))

describe('POST /api/boutique/save-cart — limitation de débit (F-03)', () => {
  test('sous la limite : le panier est enregistré', async () => {
    const res = await POST(request({ email: 'a@exemple.fr', items: ITEMS }))
    expect(res.status).toBe(200)
    expect(mockUpsert).toHaveBeenCalledTimes(1)
  })

  test('au-delà de la limite IP : 429 et abandoned_carts n’est pas alimentée', async () => {
    for (let i = 0; i < 20; i++) {
      await POST(request({ email: `a${i}@exemple.fr`, items: ITEMS }))
    }
    mockUpsert.mockClear()

    const res = await POST(request({ email: 'depasse@exemple.fr', items: ITEMS }))
    expect(res.status).toBe(429)
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  test('stockage indisponible : fail-closed, aucune écriture', async () => {
    setRateLimitStore({ hit: async () => { throw new RateLimitStoreUnavailable() } })
    const res = await POST(request({ email: 'a@exemple.fr', items: ITEMS }))
    expect(res.status).toBe(429)
    expect(mockUpsert).not.toHaveBeenCalled()
  })
})

describe('POST /api/boutique/save-cart — validation', () => {
  test('adresse invalide ou trop longue : 400', async () => {
    expect((await POST(request({ email: 'pas-une-adresse', items: ITEMS }))).status).toBe(400)
    const long = `${'a'.repeat(250)}@exemple.fr`
    expect((await POST(request({ email: long, items: ITEMS }))).status).toBe(400)
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  test('l’adresse est normalisée avant écriture', async () => {
    await POST(request({ email: '  MOI@Exemple.FR ', items: ITEMS }))
    expect(mockUpsert.mock.calls[0][0].email).toBe('moi@exemple.fr')
  })

  test('panier vide : 400 ; produits inconnus : ignorés sans écriture', async () => {
    expect((await POST(request({ email: 'a@exemple.fr', items: [] }))).status).toBe(400)
    const res = await POST(request({ email: 'a@exemple.fr', items: [{ product_id: 'inconnu', quantity: 1 }] }))
    expect(res.status).toBe(200)
    expect(mockUpsert).not.toHaveBeenCalled()
  })
})
