/**
 * @jest-environment node
 */
// Phase K8.1 — finding K8-07. Les trois opérations renvoyaient `error.message`
// de Postgres. La route est protégée par `admin_users`, donc la fuite était
// bornée aux administrateurs, mais elle n'avait aucune raison d'être : ces
// tests verrouillent la correction et, au passage, la garde d'accès.
import { NextRequest } from 'next/server'

type FakeError = { message: string; code?: string } | null

interface FakeQuery extends PromiseLike<unknown> {
  eq(...args: unknown[]): FakeQuery
  order(...args: unknown[]): FakeQuery
  limit(...args: unknown[]): FakeQuery
  maybeSingle(): FakeQuery
}

const mockState = {
  user: null as { id: string } | null,
  adminRow: null as { id: string } | null,
  selectResult: { data: [] as unknown[] | null, error: null as FakeError },
  updateResult: { error: null as FakeError },
  deleteResult: { error: null as FakeError },
}

function chain(result: unknown): FakeQuery {
  const query: FakeQuery = {
    eq: () => query,
    order: () => query,
    limit: () => query,
    maybeSingle: () => query,
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return query
}

jest.mock('../../../../lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: mockState.user } }) },
  }),
  createServiceClient: async () => ({
    from: (table: string) => ({
      select: () => chain(
        table === 'admin_users'
          ? { data: mockState.adminRow, error: null }
          : mockState.selectResult,
      ),
      update: () => chain(mockState.updateResult),
      delete: () => chain(mockState.deleteResult),
    }),
  }),
}))

import { GET, PATCH, DELETE } from './route'

const PG_ERROR = { code: '42703', message: 'column reviews.hidden does not exist' }

const patchRequest = (body: unknown) =>
  new NextRequest('http://localhost/api/admin/reviews', {
    method: 'PATCH', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' },
  })

const deleteRequest = (qs: string) =>
  new NextRequest(`http://localhost/api/admin/reviews?${qs}`, { method: 'DELETE' })

function signInAsAdmin() {
  mockState.user = { id: 'admin-1' }
  mockState.adminRow = { id: 'admin-1' }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  mockState.user = null
  mockState.adminRow = null
  mockState.selectResult = { data: [], error: null }
  mockState.updateResult = { error: null }
  mockState.deleteResult = { error: null }
})

describe('/api/admin/reviews — garde d’accès inchangée', () => {
  test('non authentifié : 403 sur les trois verbes', async () => {
    expect((await GET()).status).toBe(403)
    expect((await PATCH(patchRequest({ id: 'r1', hidden: true }))).status).toBe(403)
    expect((await DELETE(deleteRequest('id=r1'))).status).toBe(403)
  })

  test('authentifié mais absent de admin_users : 403', async () => {
    mockState.user = { id: 'user-ordinaire' }
    mockState.adminRow = null

    expect((await GET()).status).toBe(403)
    expect((await PATCH(patchRequest({ id: 'r1', hidden: true }))).status).toBe(403)
  })
})

describe('/api/admin/reviews — comportement nominal inchangé', () => {
  test('GET administrateur : 200 et la liste', async () => {
    signInAsAdmin()
    mockState.selectResult = { data: [{ id: 'r1', hidden: false }], error: null }

    const res = await GET()
    expect(res.status).toBe(200)
    expect((await res.json()).reviews).toHaveLength(1)
  })

  test('PATCH et DELETE administrateur : 200 { ok: true }', async () => {
    signInAsAdmin()

    const patch = await PATCH(patchRequest({ id: 'r1', hidden: true }))
    expect(patch.status).toBe(200)
    expect(await patch.json()).toEqual({ ok: true })

    const del = await DELETE(deleteRequest('id=r1'))
    expect(del.status).toBe(200)
    expect(await del.json()).toEqual({ ok: true })
  })

  test('validation inchangée : corps ou identifiant invalide → 400', async () => {
    signInAsAdmin()

    expect((await PATCH(patchRequest({ id: 'r1' }))).status).toBe(400)
    expect((await PATCH(patchRequest({ hidden: true }))).status).toBe(400)
    expect((await DELETE(deleteRequest(''))).status).toBe(400)
  })
})

describe('/api/admin/reviews — K8-07 : aucun détail Postgres exposé', () => {
  test('GET en erreur : 500 générique', async () => {
    signInAsAdmin()
    mockState.selectResult = { data: null, error: PG_ERROR }

    const res = await GET()
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server_error' })
  })

  test('PATCH en erreur : 500 générique', async () => {
    signInAsAdmin()
    mockState.updateResult = { error: PG_ERROR }

    const res = await PATCH(patchRequest({ id: 'r1', hidden: true }))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server_error' })
  })

  test('DELETE en erreur : 500 générique', async () => {
    signInAsAdmin()
    mockState.deleteResult = { error: PG_ERROR }

    const res = await DELETE(deleteRequest('id=r1'))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server_error' })
  })

  test('aucun des trois corps ne contient de détail Postgres', async () => {
    signInAsAdmin()
    mockState.selectResult = { data: null, error: PG_ERROR }
    mockState.updateResult = { error: PG_ERROR }
    mockState.deleteResult = { error: PG_ERROR }

    const corps = [
      JSON.stringify(await (await GET()).json()),
      JSON.stringify(await (await PATCH(patchRequest({ id: 'r1', hidden: true }))).json()),
      JSON.stringify(await (await DELETE(deleteRequest('id=r1'))).json()),
    ].join(' ').toLowerCase()

    for (const fuite of ['column', 'hidden does not exist', '42703', 'relation', 'postgres']) {
      expect(corps).not.toContain(fuite)
    }
  })
})
