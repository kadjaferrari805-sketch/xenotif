/**
 * @jest-environment node
 */
// Phase K8.4 — le checkout boutique transmet desormais `cart_token` dans les
// metadonnees Stripe, afin que le webhook marque `recovered` sur LA ligne payee
// plutot que sur toutes celles partageant l'adresse.
//
// AUCUN appel Stripe reel : le SDK est double. Aucune session n'est creee.
import { NextRequest } from 'next/server'

const mockCreateSession = jest.fn()

jest.mock('../../../../lib/stripe/server', () => ({
  createStripeClient: () => ({
    checkout: { sessions: { create: (...a: unknown[]) => mockCreateSession(...a) } },
  }),
}))
jest.mock('../../../../lib/boutique/products', () => ({
  PRODUCTS: [
    { id: 'd1', name: 'Guide', description: 'desc', images: ['/i.jpg'], price_cents: 1900, type: 'digital', isAffiliate: false },
    { id: 'p1', name: 'Kettlebell', description: 'desc', images: ['/k.jpg'], price_cents: 4900, type: 'physical', isAffiliate: false },
  ],
}))

import { POST } from './route'

const TOKEN = '3f2504e0-4f89-41d3-9a0c-0305e82c3301'

const request = (body: Record<string, unknown>) =>
  new NextRequest('http://localhost/api/boutique/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  process.env = { ...ORIGINAL_ENV, STRIPE_SECRET_KEY: 'sk_test' }
  mockCreateSession.mockResolvedValue({ url: 'https://checkout.stripe.com/c/pay/cs_test' })
})

afterAll(() => { process.env = ORIGINAL_ENV })

describe('checkout boutique — transmission du jeton', () => {
  test('jeton valide : présent dans metadata, aux côtés de digital_ids et locale', async () => {
    const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }], locale: 'fr' }))

    expect(res.status).toBe(200)
    const params = mockCreateSession.mock.calls[0][0]
    expect(params.metadata).toEqual({ digital_ids: 'd1', locale: 'fr', cart_token: TOKEN })
  })

  test('jeton absent : la clé est OMISE, et le paiement aboutit quand même', async () => {
    const res = await POST(request({ items: [{ product_id: 'd1', quantity: 1 }], locale: 'fr' }))

    expect(res.status).toBe(200)
    const params = mockCreateSession.mock.calls[0][0]
    expect(params.metadata).toEqual({ digital_ids: 'd1', locale: 'fr' })
    expect(params.metadata).not.toHaveProperty('cart_token')
  })

  test('jeton non-UUID : ignoré, le paiement n’est jamais bloqué', async () => {
    for (const jeton of ['pas-un-uuid', '', 42, null]) {
      jest.clearAllMocks()
      const res = await POST(request({ cart_token: jeton, items: [{ product_id: 'd1', quantity: 1 }] }))

      expect(res.status).toBe(200)
      expect(mockCreateSession.mock.calls[0][0].metadata).not.toHaveProperty('cart_token')
    }
  })
})

describe('checkout boutique — comportement inchangé', () => {
  test('panier vide : 400, aucune session Stripe', async () => {
    const res = await POST(request({ cart_token: TOKEN, items: [] }))
    expect(res.status).toBe(400)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  test('produit inconnu uniquement : 400, aucune session', async () => {
    const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'inconnu', quantity: 1 }] }))
    expect(res.status).toBe(400)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  test('quantité invalide : 400', async () => {
    for (const q of [0, -1, 100, 1.5]) {
      jest.clearAllMocks()
      const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: q }] }))
      expect(res.status).toBe(400)
      expect(mockCreateSession).not.toHaveBeenCalled()
    }
  })

  test('produit physique : collecte d’adresse et frais de port conservés', async () => {
    await POST(request({ cart_token: TOKEN, items: [{ product_id: 'p1', quantity: 1 }] }))

    const params = mockCreateSession.mock.calls[0][0]
    expect(params.shipping_address_collection).toBeDefined()
    expect(params.shipping_options).toHaveLength(2)
    expect(params.mode).toBe('payment')
  })

  test('Stripe non configuré : 503, aucune session', async () => {
    delete process.env.STRIPE_SECRET_KEY
    const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }] }))

    expect(res.status).toBe(503)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })
})
