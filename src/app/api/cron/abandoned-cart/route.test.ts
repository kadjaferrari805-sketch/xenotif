/**
 * @jest-environment node
 */
// Phase K8.1 — finding K8-06. La route renvoyait `error.message` de Postgres.
// Elle n'est atteignable qu'avec CRON_SECRET, mais la fuite n'avait aucune
// raison d'être. Ces tests verrouillent la correction ET la garde d'accès.
//
// AUCUN e-mail réel : @/lib/emails et les deux modules de push sont doublés.

type FakeError = { message: string; code?: string } | null

interface FakeQuery extends PromiseLike<unknown> {
  eq(...args: unknown[]): FakeQuery
  lt(...args: unknown[]): FakeQuery
  limit(...args: unknown[]): FakeQuery
}

const mockState = {
  cartsResult: { data: [] as unknown[] | null, error: null as FakeError },
}

const mockSendEmail = jest.fn()
const mockSendPush = jest.fn()
const mockSendWebPush = jest.fn()

function chain(result: unknown): FakeQuery {
  const query: FakeQuery = {
    eq: () => query,
    lt: () => query,
    limit: () => query,
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return query
}

jest.mock('../../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => ({ select: () => chain(mockState.cartsResult) }),
    auth: { admin: { listUsers: async () => ({ data: { users: [] } }) } },
  }),
}))
jest.mock('../../../../lib/emails', () => ({
  sendAbandonedCartEmail: (...a: unknown[]) => mockSendEmail(...a),
}))
jest.mock('../../../../lib/push', () => ({ sendPushToUser: (...a: unknown[]) => mockSendPush(...a) }))
jest.mock('../../../../lib/web-push', () => ({ sendWebPushToUser: (...a: unknown[]) => mockSendWebPush(...a) }))
jest.mock('../../../../lib/env/deployment', () => ({ getPublicBaseUrl: () => 'https://xenotif.com' }))

import { GET } from './route'

const PG_ERROR = { code: '42P01', message: 'relation "public.abandoned_carts" does not exist' }

const request = (auth?: string) =>
  new Request('http://localhost/api/cron/abandoned-cart', {
    headers: auth ? { Authorization: auth } : {},
  })

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  process.env = { ...ORIGINAL_ENV, CRON_SECRET: 'secret-de-test' }
  mockState.cartsResult = { data: [], error: null }
})

afterAll(() => { process.env = ORIGINAL_ENV })

describe('cron/abandoned-cart — garde CRON_SECRET inchangée', () => {
  test('sans en-tête : 401, aucune requête métier', async () => {
    const res = await GET(request())
    expect(res.status).toBe(401)
    expect(mockSendEmail).not.toHaveBeenCalled()
  })

  test('secret erroné : 401', async () => {
    expect((await GET(request('Bearer mauvais'))).status).toBe(401)
    expect(mockSendEmail).not.toHaveBeenCalled()
  })

  test('CRON_SECRET absent de l’environnement : fail-closed, 401 même avec un en-tête', async () => {
    delete process.env.CRON_SECRET
    const res = await GET(request('Bearer secret-de-test'))
    expect(res.status).toBe(401)
    expect(mockSendEmail).not.toHaveBeenCalled()
  })
})

describe('cron/abandoned-cart — K8-06 : aucun détail Postgres exposé', () => {
  test('erreur base : 500 et corps générique', async () => {
    mockState.cartsResult = { data: null, error: PG_ERROR }
    const res = await GET(request('Bearer secret-de-test'))

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server_error' })
  })

  test('le corps ne contient ni message, ni code, ni nom de table', async () => {
    mockState.cartsResult = { data: null, error: PG_ERROR }
    const body = JSON.stringify(await (await GET(request('Bearer secret-de-test'))).json()).toLowerCase()

    for (const fuite of ['relation', 'abandoned_carts', 'does not exist', '42p01', 'public.']) {
      expect(body).not.toContain(fuite)
    }
  })

  test('une erreur base n’envoie aucun e-mail', async () => {
    mockState.cartsResult = { data: null, error: PG_ERROR }
    await GET(request('Bearer secret-de-test'))

    expect(mockSendEmail).not.toHaveBeenCalled()
    expect(mockSendPush).not.toHaveBeenCalled()
    expect(mockSendWebPush).not.toHaveBeenCalled()
  })

  test('le détail complet reste dans les logs serveur', async () => {
    mockState.cartsResult = { data: null, error: PG_ERROR }
    await GET(request('Bearer secret-de-test'))

    expect(console.error).toHaveBeenCalledWith('[abandoned-cart] query error:', PG_ERROR)
  })
})

describe('cron/abandoned-cart — logique métier inchangée', () => {
  test('aucun panier à relancer : 200 { sent: 0 }, aucun e-mail', async () => {
    mockState.cartsResult = { data: [], error: null }
    const res = await GET(request('Bearer secret-de-test'))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ sent: 0 })
    expect(mockSendEmail).not.toHaveBeenCalled()
  })
})
