/**
 * @jest-environment node
 */
// Environnement Node : le Route Handler importe `next/server`.
//
// Phase K8.1 — finding K8-02. Cette route est PUBLIQUE et renvoyait jusqu'ici
// `error.message` de Postgres, ce qui divulguait noms de tables, de colonnes et
// de contraintes à n'importe quel visiteur. Ces tests verrouillent la
// correction : le client ne reçoit plus qu'un code générique.
import { NextRequest } from 'next/server'

type FakeError = { message: string; code?: string } | null

interface FakeQuery extends PromiseLike<unknown> {
  eq(...args: unknown[]): FakeQuery
  order(...args: unknown[]): FakeQuery
  limit(...args: unknown[]): FakeQuery
}

const mockState = {
  selectResult: { data: [] as unknown[] | null, error: null as FakeError },
}

function chain(result: unknown): FakeQuery {
  const query: FakeQuery = {
    eq: () => query,
    order: () => query,
    limit: () => query,
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return query
}

jest.mock('../../../lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
  createServiceClient: async () => ({
    from: () => ({ select: () => chain(mockState.selectResult) }),
  }),
}))

import { GET } from './route'

const request = (qs: string) =>
  new NextRequest(`http://localhost/api/reviews?${qs}`)

/** Message Postgres réaliste : il nomme la table, la colonne et la contrainte. */
const PG_ERROR = {
  code: '42703',
  message: 'column reviews.hidden does not exist',
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  mockState.selectResult = { data: [], error: null }
})

describe('GET /api/reviews — succès', () => {
  test('liste vide : 200 et tableau vide', async () => {
    const res = await GET(request('type=platform'))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ reviews: [] })
  })

  test('avec données : les avis sont renvoyés tels quels', async () => {
    mockState.selectResult = {
      data: [{ id: 'r1', type: 'platform', rating: 5, comment: 'Excellent', author_name: 'Alex' }],
      error: null,
    }
    const res = await GET(request('type=platform'))

    expect(res.status).toBe(200)
    expect((await res.json()).reviews).toHaveLength(1)
  })

  test('validation inchangée : type absent → 400, produit sans id → 400', async () => {
    expect((await GET(request(''))).status).toBe(400)
    expect((await GET(request('type=inconnu'))).status).toBe(400)
    expect((await GET(request('type=product'))).status).toBe(400)
  })
})

describe('GET /api/reviews — K8-02 : aucun détail Postgres exposé', () => {
  test('erreur base : 500 et corps générique', async () => {
    mockState.selectResult = { data: null, error: PG_ERROR }
    const res = await GET(request('type=platform'))

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server_error' })
  })

  test('le corps ne contient NI le message, NI le code, NI de nom de table ou colonne', async () => {
    mockState.selectResult = { data: null, error: PG_ERROR }
    const body = JSON.stringify(await (await GET(request('type=platform'))).json()).toLowerCase()

    for (const fuite of ['column', 'reviews', 'hidden', 'does not exist', '42703', 'postgres', 'supabase', 'relation']) {
      expect(body).not.toContain(fuite)
    }
  })

  test('le détail complet reste dans les logs serveur', async () => {
    mockState.selectResult = { data: null, error: PG_ERROR }
    await GET(request('type=platform'))

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[GET /api/reviews]'),
      PG_ERROR.code,
      PG_ERROR.message,
    )
  })
})
