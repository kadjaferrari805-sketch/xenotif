/**
 * @jest-environment node
 */
// Environnement Node : le Route Handler importe `next/server`.
//
// Cette route est la porte de moderation : elle decide ce qui devient PUBLIC
// dans la galerie. Les tests portent donc d'abord sur le refus — un visiteur
// non authentifie et un compte ordinaire ne doivent ni lire la file d'attente
// ni changer un statut.
import { NextRequest } from 'next/server'

type FakeError = { message: string } | null

interface FakeQuery extends PromiseLike<unknown> {
  eq(...args: unknown[]): FakeQuery
  order(...args: unknown[]): FakeQuery
  single(): FakeQuery
}

const mockState = {
  user: null as { id: string } | null,
  /** Ligne renvoyee par la recherche dans admin_users : null = pas administrateur. */
  adminRow: null as { id: string } | null,
  pending: [] as unknown[],
  updateResult: { error: null as FakeError },
  updates: [] as { payload: Record<string, unknown>; filters: unknown[][] }[],
}

function chain(result: unknown, filters: unknown[][] = []): FakeQuery {
  const query: FakeQuery = {
    eq: (...args: unknown[]) => { filters.push(['eq', ...args]); return query },
    order: () => query,
    single: () => query,
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return query
}

const mockService = {
  from: (table: string) => ({
    select: () => chain(
      table === 'admin_users'
        ? { data: mockState.adminRow, error: null }
        : { data: mockState.pending, error: null },
    ),
    update: (payload: Record<string, unknown>) => {
      const filters: unknown[][] = []
      mockState.updates.push({ payload, filters })
      return chain(mockState.updateResult, filters)
    },
  }),
  storage: {
    from: () => ({
      getPublicUrl: (path: string) => ({ data: { publicUrl: `https://cdn.test/transformations/${path}` } }),
    }),
  },
}

jest.mock('../../../../lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: mockState.user } }) },
  }),
  createServiceClient: async () => mockService,
}))

import { GET, POST } from './route'

const moderationRequest = (body: unknown) =>
  new NextRequest('http://localhost/api/admin/transformations', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

/** Rend la session administratrice : compte connecte ET present dans admin_users. */
function signInAsAdmin() {
  mockState.user = { id: 'admin-1' }
  mockState.adminRow = { id: 'admin-1' }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockState.user = null
  mockState.adminRow = null
  mockState.pending = []
  mockState.updateResult = { error: null }
  mockState.updates = []
})

describe('/api/admin/transformations — controle d’acces', () => {
  test('visiteur non authentifie : 403 en lecture comme en moderation', async () => {
    expect((await GET()).status).toBe(403)

    const res = await POST(moderationRequest({ id: 't1', status: 'approved' }))
    expect(res.status).toBe(403)
    expect(mockState.updates).toEqual([])
  })

  test('compte authentifie mais non administrateur : 403, aucune moderation', async () => {
    mockState.user = { id: 'user-ordinaire' }
    mockState.adminRow = null // absent de admin_users

    expect((await GET()).status).toBe(403)

    const res = await POST(moderationRequest({ id: 't1', status: 'approved' }))
    expect(res.status).toBe(403)
    expect(mockState.updates).toEqual([])
  })

  test('le refus ne divulgue pas la file d’attente', async () => {
    mockState.user = { id: 'user-ordinaire' }
    mockState.pending = [{ id: 't1', display_name: 'Alex', before_path: 'a', after_path: 'b', caption: null, weeks: null, created_at: null }]

    const body = await (await GET()).json()
    expect(body.items).toBeUndefined()
    expect(JSON.stringify(body)).not.toContain('Alex')
  })
})

describe('/api/admin/transformations — administration', () => {
  test('GET administrateur : la file d’attente et ses URL publiques', async () => {
    signInAsAdmin()
    mockState.pending = [{
      id: 't1', display_name: 'Alex', before_path: 'user-1/a-before.jpg',
      after_path: 'user-1/a-after.jpg', caption: 'Top', weeks: 12, created_at: '2026-09-16T00:00:00Z',
    }]

    const res = await GET()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      items: [{
        id: 't1', displayName: 'Alex', caption: 'Top', weeks: 12, createdAt: '2026-09-16T00:00:00Z',
        beforeUrl: 'https://cdn.test/transformations/user-1/a-before.jpg',
        afterUrl: 'https://cdn.test/transformations/user-1/a-after.jpg',
      }],
    })
  })

  test('GET administrateur, file vide : 200 et liste vide', async () => {
    signInAsAdmin()
    const res = await GET()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ items: [] })
  })

  test('POST administrateur : approbation appliquee a la bonne ligne', async () => {
    signInAsAdmin()
    const res = await POST(moderationRequest({ id: 't1', status: 'approved' }))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(mockState.updates).toHaveLength(1)
    expect(mockState.updates[0].payload).toEqual({ status: 'approved' })
    expect(mockState.updates[0].filters).toEqual([['eq', 'id', 't1']])
  })

  test('POST administrateur : rejet applique', async () => {
    signInAsAdmin()
    const res = await POST(moderationRequest({ id: 't1', status: 'rejected' }))

    expect(res.status).toBe(200)
    expect(mockState.updates[0].payload).toEqual({ status: 'rejected' })
  })

  test('statut arbitraire ou identifiant manquant : 400, aucune ecriture', async () => {
    signInAsAdmin()

    expect((await POST(moderationRequest({ id: 't1', status: 'publie' }))).status).toBe(400)
    expect((await POST(moderationRequest({ id: 't1' }))).status).toBe(400)
    expect((await POST(moderationRequest({ status: 'approved' }))).status).toBe(400)
    expect(mockState.updates).toEqual([])
  })

  test('corps illisible : 400, aucune ecriture', async () => {
    signInAsAdmin()
    const res = await POST(new NextRequest('http://localhost/api/admin/transformations', {
      method: 'POST', body: 'pas du json', headers: { 'Content-Type': 'application/json' },
    }))

    expect(res.status).toBe(400)
    expect(mockState.updates).toEqual([])
  })

  test('echec de la mise a jour : 500', async () => {
    signInAsAdmin()
    mockState.updateResult = { error: { message: 'update refuse' } }

    const res = await POST(moderationRequest({ id: 't1', status: 'approved' }))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'update_failed' })
  })
})
