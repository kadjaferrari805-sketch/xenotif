/**
 * @jest-environment node
 */
// Phase K8.4 — finding K8-03. La route ne fait plus `upsert onConflict:'email'`
// mais designe la ligne par `cart_token`. Les mocks de l'ancien test (upsert
// seul) ne pouvaient donc plus s'appliquer : ce fichier les remplace.
//
// La regle de propriete est au coeur des assertions : un jeton autorise a
// modifier SON panier, jamais a le reattribuer a une autre adresse.
import { NextRequest } from 'next/server'

type FakeError = { message: string; code?: string } | null

interface FakeQuery extends PromiseLike<unknown> {
  eq(...args: unknown[]): FakeQuery
  maybeSingle(): FakeQuery
}

const mockSelect = jest.fn()
const mockInsert = jest.fn()
const mockUpdate = jest.fn()

const mockState = {
  existant: null as { email: string } | null,
  selectError: null as FakeError,
  insertError: null as FakeError,
  updateError: null as FakeError,
}

function chain(result: unknown, journal?: (filtre: unknown[]) => void): FakeQuery {
  const query: FakeQuery = {
    eq: (...args: unknown[]) => { journal?.(args); return query },
    maybeSingle: () => query,
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return query
}

jest.mock('../../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => ({
      select: () => {
        mockSelect()
        return chain({ data: mockState.existant, error: mockState.selectError })
      },
      insert: (payload: unknown) => {
        mockInsert(payload)
        return chain({ error: mockState.insertError })
      },
      update: (payload: unknown) => {
        return chain({ error: mockState.updateError }, filtre => mockUpdate(payload, filtre))
      },
    }),
  }),
}))
jest.mock('../../../../lib/boutique/products', () => ({
  PRODUCTS: [{ id: 'd1' }, { id: 'd2' }],
}))

import { InMemoryRateLimitStore, setRateLimitStore } from '../../../../lib/security/rate-limit-store'
import { RateLimitStoreUnavailable } from '../../../../lib/security/rate-limit'
import { POST } from './route'

const ITEMS = [{ product_id: 'd1', quantity: 1 }]
const TOKEN = '3f2504e0-4f89-41d3-9a0c-0305e82c3301'
const AUTRE_TOKEN = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

const request = (body: Record<string, unknown>, ip = '203.0.113.7') =>
  new NextRequest('http://localhost/api/boutique/save-cart', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'x-forwarded-for': ip },
  })

/** Corps nominal : jeton valide, adresse valide, panier non vide. */
const corps = (over: Record<string, unknown> = {}) =>
  ({ cart_token: TOKEN, email: 'a@exemple.fr', items: ITEMS, ...over })

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  mockState.existant = null
  mockState.selectError = null
  mockState.insertError = null
  mockState.updateError = null
  setRateLimitStore(new InMemoryRateLimitStore())
})

afterAll(() => setRateLimitStore(null))

describe('save-cart — propriété par jeton (K8-03)', () => {
  test('jeton inconnu : création, avec le jeton et l’adresse normalisée', async () => {
    mockState.existant = null
    const res = await POST(request(corps({ email: '  MOI@Exemple.FR ' })))

    expect(res.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledTimes(1)
    const ligne = mockInsert.mock.calls[0][0] as Record<string, unknown>
    expect(ligne.cart_token).toBe(TOKEN)
    expect(ligne.email).toBe('moi@exemple.fr')
    expect(ligne.reminder_sent).toBe(false)
    expect(ligne.recovered).toBe(false)
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  test('jeton connu + MÊME adresse : mise à jour, aucune création', async () => {
    mockState.existant = { email: 'a@exemple.fr' }
    const res = await POST(request(corps()))

    expect(res.status).toBe(200)
    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockInsert).not.toHaveBeenCalled()
    const [payload, filtre] = mockUpdate.mock.calls[0]
    expect(filtre).toEqual(['cart_token', TOKEN])
    expect(payload).toHaveProperty('items')
    expect(payload).toHaveProperty('updated_at')
  })

  test('jeton connu + AUTRE adresse : 409 et AUCUNE écriture', async () => {
    mockState.existant = { email: 'victime@exemple.fr' }
    const res = await POST(request(corps({ email: 'attaquant@exemple.fr' })))

    expect(res.status).toBe(409)
    expect(mockInsert).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  test('le refus ne divulgue pas l’adresse enregistrée', async () => {
    mockState.existant = { email: 'victime@exemple.fr' }
    const body = JSON.stringify(await (await POST(request(corps({ email: 'attaquant@exemple.fr' })))).json())

    expect(body).not.toContain('victime')
    expect(body).not.toContain('@exemple.fr')
  })

  test('une mise à jour ne réarme PAS le rappel', async () => {
    mockState.existant = { email: 'a@exemple.fr' }
    await POST(request(corps()))

    const [payload] = mockUpdate.mock.calls[0]
    expect(payload).not.toHaveProperty('reminder_sent')
    expect(payload).not.toHaveProperty('recovered')
  })

  test('jeton différent, même adresse : traité comme une création', async () => {
    mockState.existant = null
    const res = await POST(request(corps({ cart_token: AUTRE_TOKEN })))

    expect(res.status).toBe(200)
    expect((mockInsert.mock.calls[0][0] as Record<string, unknown>).cart_token).toBe(AUTRE_TOKEN)
  })

  test('conflit d’unicité pendant la transition (PK email) : 409, pas 500', async () => {
    mockState.existant = null
    mockState.insertError = { code: '23505', message: 'duplicate key value violates unique constraint' }
    const res = await POST(request(corps()))

    expect(res.status).toBe(409)
    const body = JSON.stringify(await res.json()).toLowerCase()
    expect(body).not.toContain('duplicate')
    expect(body).not.toContain('constraint')
  })
})

describe('save-cart — validation du jeton', () => {
  test('jeton absent, vide ou non-UUID : 400, aucune lecture ni écriture', async () => {
    for (const jeton of [undefined, '', 'pas-un-uuid', 12345, '3f2504e0-4f89-11d3-9a0c-0305e82c3301']) {
      jest.clearAllMocks()
      const res = await POST(request(corps({ cart_token: jeton })))
      expect(res.status).toBe(400)
      expect(mockSelect).not.toHaveBeenCalled()
      expect(mockInsert).not.toHaveBeenCalled()
      expect(mockUpdate).not.toHaveBeenCalled()
    }
  })

  test('le jeton est validé AVANT l’adresse et le panier', async () => {
    const res = await POST(request({ cart_token: 'invalide', email: 'pas-une-adresse', items: [] }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Jeton de panier invalide' })
  })
})

describe('save-cart — validation inchangée', () => {
  test('adresse invalide ou trop longue : 400', async () => {
    expect((await POST(request(corps({ email: 'pas-une-adresse' })))).status).toBe(400)
    expect((await POST(request(corps({ email: `${'a'.repeat(250)}@exemple.fr` })))).status).toBe(400)
    expect(mockInsert).not.toHaveBeenCalled()
  })

  test('panier vide : 400 ; produits inconnus : ignorés sans écriture', async () => {
    expect((await POST(request(corps({ items: [] })))).status).toBe(400)
    const res = await POST(request(corps({ items: [{ product_id: 'inconnu', quantity: 1 }] })))
    expect(res.status).toBe(200)
    expect(mockInsert).not.toHaveBeenCalled()
  })

  test('erreur de lecture : 500 générique, aucun détail Postgres', async () => {
    mockState.selectError = { code: '42P01', message: 'relation "abandoned_carts" does not exist' }
    const res = await POST(request(corps()))

    expect(res.status).toBe(500)
    const body = JSON.stringify(await res.json()).toLowerCase()
    expect(body).not.toContain('relation')
    expect(body).not.toContain('42p01')
  })
})

describe('save-cart — limitation de débit K5 INCHANGÉE', () => {
  test('sous la limite : le panier est enregistré', async () => {
    const res = await POST(request(corps()))
    expect(res.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledTimes(1)
  })

  test('au-delà de la limite IP (20/h) : 429, aucune écriture', async () => {
    for (let i = 0; i < 20; i++) {
      await POST(request(corps({ email: `a${i}@exemple.fr` })))
    }
    jest.clearAllMocks()

    const res = await POST(request(corps({ email: 'depasse@exemple.fr' })))
    expect(res.status).toBe(429)
    expect(mockInsert).not.toHaveBeenCalled()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  test('au-delà de la limite e-mail (10/h) : 429 malgré des IP différentes', async () => {
    for (let i = 0; i < 10; i++) {
      await POST(request(corps(), `203.0.113.${i}`))
    }
    jest.clearAllMocks()

    const res = await POST(request(corps(), '198.51.100.1'))
    expect(res.status).toBe(429)
    expect(mockInsert).not.toHaveBeenCalled()
  })

  test('changer de jeton ne contourne PAS la borne par adresse', async () => {
    for (let i = 0; i < 10; i++) {
      await POST(request(corps({ cart_token: `3f2504e0-4f89-41d3-9a0c-0305e82c33${String(i).padStart(2, '0')}` })))
    }
    jest.clearAllMocks()

    const res = await POST(request(corps({ cart_token: AUTRE_TOKEN })))
    expect(res.status).toBe(429)
    expect(mockInsert).not.toHaveBeenCalled()
  })

  test('stockage indisponible : fail-closed, aucune écriture', async () => {
    setRateLimitStore({ hit: async () => { throw new RateLimitStoreUnavailable() } })
    const res = await POST(request(corps()))

    expect(res.status).toBe(429)
    expect(mockInsert).not.toHaveBeenCalled()
  })
})
