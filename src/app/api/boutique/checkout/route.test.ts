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

// ─── K8.8 — finding F6 de l'audit K8.7 ─────────────────────────────
//
// La route renvoyait `Erreur paiement : ${err.message}` : le message de
// l'exception Stripe partait TEL QUEL au client. Il peut nommer un identifiant
// de prix, la configuration du compte, une contrainte, parfois un request ID.
// Même acquis que K8-02 sur /api/reviews — le détail reste côté serveur.
//
// AUCUN appel Stripe réel : le SDK est doublé et on le fait rejeter.
describe('checkout boutique — le détail Stripe ne fuit pas (K8.8)', () => {
  /** Exception réaliste : message bavard, request ID, pile d'appels. */
  function erreurStripeBavarde() {
    const err = new Error(
      "No such price: 'price_1QxAbCdEfGhIjKlMnOpQrStU'; a similar object exists in test mode, " +
      'but a live mode key was used to make this request. request-id: req_7ZxKpQm4Nv2Ld',
    )
    err.stack = `${err.message}\n    at StripeAPI.create (/var/task/node_modules/stripe/lib/api.js:412:19)`
    return err
  }

  /** Le corps rendu au visiteur, en texte brut. */
  async function corpsRendu(res: Response) {
    return JSON.stringify(await res.json())
  }

  test('1. exception Stripe → le statut HTTP reste 500', async () => {
    mockCreateSession.mockRejectedValue(erreurStripeBavarde())

    const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }] }))

    expect(res.status).toBe(500)
  })

  test('2. exception Stripe → message générique, et lui seul', async () => {
    mockCreateSession.mockRejectedValue(erreurStripeBavarde())

    const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }] }))

    expect(await res.json()).toEqual({ error: 'Erreur de paiement. Veuillez réessayer.' })
  })

  test('3. le message de l’exception est ABSENT de la réponse', async () => {
    const err = erreurStripeBavarde()
    mockCreateSession.mockRejectedValue(err)

    const corps = await corpsRendu(await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }] })))

    expect(corps).not.toContain(err.message)
    for (const fuite of ['No such price', 'price_1QxAbCdEfGhIjKlMnOpQrStU', 'req_7ZxKpQm4Nv2Ld', 'live mode']) {
      expect(corps).not.toContain(fuite)
    }
  })

  test('4. aucune pile d’appels dans la réponse', async () => {
    mockCreateSession.mockRejectedValue(erreurStripeBavarde())

    const corps = await corpsRendu(await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }] })))

    expect(corps).not.toContain('at StripeAPI')
    expect(corps).not.toContain('node_modules')
    expect(corps).not.toMatch(/\.js:\d+:\d+/)
  })

  test('5. aucun secret dans la réponse', async () => {
    // `sk_test` est bien en environnement (posé par le beforeEach) : le test
    // n'est donc pas vide, il vérifie une valeur réellement présente.
    expect(process.env.STRIPE_SECRET_KEY).toBe('sk_test')
    mockCreateSession.mockRejectedValue(erreurStripeBavarde())

    const corps = await corpsRendu(await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }] })))

    expect(corps).not.toContain('sk_test')
    expect(corps).not.toMatch(/sk_(live|test)/)
  })

  test('6. le cart_token n’apparaît pas dans la réponse', async () => {
    mockCreateSession.mockRejectedValue(erreurStripeBavarde())

    const corps = await corpsRendu(await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }] })))

    // Le jeton est une capability : le renvoyer dans un corps d'erreur le
    // rendrait visible dans les journaux de n'importe quel intermédiaire.
    expect(corps).not.toContain(TOKEN)
  })

  test('le détail complet reste disponible côté serveur', async () => {
    const err = erreurStripeBavarde()
    mockCreateSession.mockRejectedValue(err)
    const journal = jest.spyOn(console, 'error')

    await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }] }))

    // Supprimer la fuite ne doit pas supprimer le diagnostic.
    expect(journal).toHaveBeenCalledWith('[boutique/checkout] session Stripe refusée :', err)
  })

  test('une quantité invalide est refusée AVANT tout appel Stripe, même si Stripe échouerait', async () => {
    mockCreateSession.mockRejectedValue(erreurStripeBavarde())

    const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 0 }] }))

    expect(res.status).toBe(400)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  test('un produit inconnu est refusé AVANT tout appel Stripe, même si Stripe échouerait', async () => {
    mockCreateSession.mockRejectedValue(erreurStripeBavarde())

    const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'inconnu', quantity: 1 }] }))

    expect(res.status).toBe(400)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  test('le garde d’environnement reste prioritaire sur l’échec Stripe', async () => {
    delete process.env.STRIPE_SECRET_KEY
    mockCreateSession.mockRejectedValue(erreurStripeBavarde())

    const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }] }))

    expect(res.status).toBe(503)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  test('le chemin nominal est inchangé : 200 et URL Stripe', async () => {
    const res = await POST(request({ cart_token: TOKEN, items: [{ product_id: 'd1', quantity: 1 }], locale: 'fr' }))

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ url: 'https://checkout.stripe.com/c/pay/cs_test' })
  })
})
