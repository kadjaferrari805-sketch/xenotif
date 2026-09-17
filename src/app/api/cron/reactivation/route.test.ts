/**
 * @jest-environment node
 */
// Phase K8.1 — finding K8-06. Même correction et mêmes garanties que pour
// cron/abandoned-cart : corps générique, garde CRON_SECRET intacte, aucun
// e-mail réel (les modules d'envoi sont doublés).

type FakeError = { message: string; code?: string } | null

interface FakeQuery extends PromiseLike<unknown> {
  eq(...args: unknown[]): FakeQuery
  is(...args: unknown[]): FakeQuery
  limit(...args: unknown[]): FakeQuery
}

const mockState = {
  subsResult: { data: [] as unknown[] | null, error: null as FakeError },
}

const mockSendEmail = jest.fn()
const mockSendPush = jest.fn()
const mockSendWebPush = jest.fn()

function chain(result: unknown): FakeQuery {
  const query: FakeQuery = {
    eq: () => query,
    is: () => query,
    limit: () => query,
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return query
}

jest.mock('../../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => ({ select: () => chain(mockState.subsResult) }),
    auth: { admin: { listUsers: async () => ({ data: { users: [] } }) } },
  }),
}))
jest.mock('../../../../lib/emails', () => ({
  sendReactivationEmail: (...a: unknown[]) => mockSendEmail(...a),
}))
jest.mock('../../../../lib/push', () => ({ sendPushToUser: (...a: unknown[]) => mockSendPush(...a) }))
jest.mock('../../../../lib/web-push', () => ({ sendWebPushToUser: (...a: unknown[]) => mockSendWebPush(...a) }))

import { GET } from './route'

// La route dépend d'une colonne ajoutée hors migration : l'erreur 42703 est
// justement le cas réel que la fuite exposait au client.
const PG_ERROR = { code: '42703', message: 'column subscriptions.reactivation_sent_at does not exist' }

const request = (auth?: string) =>
  new Request('http://localhost/api/cron/reactivation', {
    headers: auth ? { Authorization: auth } : {},
  })

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  process.env = { ...ORIGINAL_ENV, CRON_SECRET: 'secret-de-test' }
  mockState.subsResult = { data: [], error: null }
})

afterAll(() => { process.env = ORIGINAL_ENV })

describe('cron/reactivation — garde CRON_SECRET inchangée', () => {
  test('sans en-tête : 401, aucun envoi', async () => {
    const res = await GET(request())
    expect(res.status).toBe(401)
    expect(mockSendEmail).not.toHaveBeenCalled()
  })

  test('secret erroné : 401', async () => {
    expect((await GET(request('Bearer mauvais'))).status).toBe(401)
    expect(mockSendEmail).not.toHaveBeenCalled()
  })

  test('CRON_SECRET absent : fail-closed, 401', async () => {
    delete process.env.CRON_SECRET
    expect((await GET(request('Bearer secret-de-test'))).status).toBe(401)
    expect(mockSendEmail).not.toHaveBeenCalled()
  })
})

describe('cron/reactivation — K8-06 : aucun détail Postgres exposé', () => {
  test('erreur base : 500 et corps générique', async () => {
    mockState.subsResult = { data: null, error: PG_ERROR }
    const res = await GET(request('Bearer secret-de-test'))

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server_error' })
  })

  test('le corps ne nomme ni la table, ni la colonne manquante', async () => {
    mockState.subsResult = { data: null, error: PG_ERROR }
    const body = JSON.stringify(await (await GET(request('Bearer secret-de-test'))).json()).toLowerCase()

    for (const fuite of ['column', 'subscriptions', 'reactivation_sent_at', 'does not exist', '42703']) {
      expect(body).not.toContain(fuite)
    }
  })

  test('une erreur base n’envoie aucun e-mail ni push', async () => {
    mockState.subsResult = { data: null, error: PG_ERROR }
    await GET(request('Bearer secret-de-test'))

    expect(mockSendEmail).not.toHaveBeenCalled()
    expect(mockSendPush).not.toHaveBeenCalled()
    expect(mockSendWebPush).not.toHaveBeenCalled()
  })

  test('le détail complet reste dans les logs serveur', async () => {
    mockState.subsResult = { data: null, error: PG_ERROR }
    await GET(request('Bearer secret-de-test'))

    expect(console.error).toHaveBeenCalledWith('[reactivation] query error:', PG_ERROR)
  })
})

describe('cron/reactivation — logique métier inchangée', () => {
  test('aucun abonné à relancer : 200 { sent: 0 }', async () => {
    mockState.subsResult = { data: [], error: null }
    const res = await GET(request('Bearer secret-de-test'))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ sent: 0 })
    expect(mockSendEmail).not.toHaveBeenCalled()
  })
})
