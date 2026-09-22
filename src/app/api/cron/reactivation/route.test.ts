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
  // Ajouté en K8.9 : le chemin nominal (jusque-là non couvert) interroge
  // profiles avec .in(...).
  in(...args: unknown[]): FakeQuery
}

const mockState = {
  subsResult: { data: [] as unknown[] | null, error: null as FakeError },
  // Ajouté en K8.9 : comptes auth renvoyés par listUsers, pour atteindre le
  // chemin d'envoi. Vide par défaut — les tests K8.1 restent inchangés.
  users: [] as { id: string; email: string }[],
}

const mockSendEmail = jest.fn()
const mockSendPush = jest.fn()
const mockSendWebPush = jest.fn()
/** Charges utiles des UPDATE observés (K8.11). Préfixé `mock` : contrainte du hoisting de jest.mock. */
const mockUpdates: unknown[] = []

function chain(result: unknown): FakeQuery {
  const query: FakeQuery = {
    eq: () => query,
    is: () => query,
    limit: () => query,
    in: () => query,
    then: (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected),
  }
  return query
}

jest.mock('../../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => ({
      select: () => chain(mockState.subsResult),
      // Ajouté en K8.9 : la route marque l'abonné relancé après un envoi réussi.
      // Enregistré en K8.11 : sans cela, impossible d'affirmer que
      // `reactivation_sent_at` n'est PAS marqué quand l'envoi échoue.
      update: (payload: unknown) => { mockUpdates.push(payload); return chain({ error: null }) },
    }),
    auth: { admin: { listUsers: async () => ({ data: { users: mockState.users } }) } },
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
  mockState.users = []
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

// ── Phase K8.9 — findings K8.9-02 (adresse) et K8.9-03 (identifiant + exception).
//
// La route renvoyait `errors: errors.slice(0, 10)`, chaque entrée construite
// comme `${userId}: ${e}` pour les push et à partir de l'adresse pour l'e-mail.
// Ces chemins n'étaient couverts par AUCUN test K8.1 : les deux seules
// assertions portaient sur l'erreur base et sur le retour anticipé `{ sent: 0 }`.

const USER_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7'
const ADRESSE = 'resilie@exemple.fr'
const UN_RESILIE = [{ user_id: USER_ID, status: 'canceled', reactivation_sent_at: null }]

describe('cron/reactivation — K8.9-02 : aucune adresse dans la réponse', () => {
  beforeEach(() => {
    mockState.subsResult = { data: UN_RESILIE, error: null }
    mockState.users = [{ id: USER_ID, email: ADRESSE }]
  })

  test('un envoi qui échoue ne fait fuiter ni adresse ni identifiant', async () => {
    mockSendEmail.mockRejectedValue(new Error('SMTP 550 mailbox unavailable'))

    const res = await GET(request('Bearer secret-de-test'))
    const corps = JSON.stringify(await res.json())

    expect(res.status).toBe(200)
    expect(corps).not.toContain(ADRESSE)
    expect(corps).not.toContain('exemple.fr')
    expect(corps).not.toContain(USER_ID)
    expect(corps).not.toContain('SMTP')
  })

  test('le journal retient l’identifiant, jamais l’adresse', async () => {
    const erreur = new Error('SMTP 550 mailbox unavailable')
    mockSendEmail.mockRejectedValue(erreur)

    await GET(request('Bearer secret-de-test'))

    expect(console.error).toHaveBeenCalledWith('[reactivation] envoi echoue :', USER_ID, erreur)
    const journalisé = (console.error as jest.Mock).mock.calls.flat().join(' ')
    expect(journalisé).not.toContain(ADRESSE)
  })

  test('un échec d’e-mail n’est compté qu’une fois et coupe le push', async () => {
    mockSendEmail.mockRejectedValue(new Error('boom'))

    expect(await (await GET(request('Bearer secret-de-test'))).json())
      .toEqual({ sent: 0, pushed: 0, processed: 1, failed: 1 })
    expect(mockSendWebPush).not.toHaveBeenCalled()
  })
})

describe('cron/reactivation — K8.9-03 : ni identifiant ni exception dans la réponse', () => {
  beforeEach(() => {
    // Aucun compte auth correspondant → pas d'adresse, donc le parcours va
    // directement au push : c'est le chemin K8.9-03 à isoler.
    mockState.subsResult = { data: UN_RESILIE, error: null }
    mockState.users = []
  })

  test('un push en échec ne fait fuiter ni userId ni exception', async () => {
    mockSendWebPush.mockRejectedValue(new Error('VAPID 403 unauthorized registration'))

    const corps = JSON.stringify(await (await GET(request('Bearer secret-de-test'))).json())

    expect(corps).not.toContain(USER_ID)
    expect(corps).not.toContain('VAPID')
    expect(corps).not.toContain('unauthorized')
  })

  test('la réponse ne porte que des COMPTES', async () => {
    mockSendWebPush.mockRejectedValue(new Error('boom'))

    expect(await (await GET(request('Bearer secret-de-test'))).json())
      .toEqual({ sent: 0, pushed: 0, processed: 1, failed: 1 })
  })

  test('le diagnostic serveur reste complet', async () => {
    const erreur = new Error('boom')
    mockSendWebPush.mockRejectedValue(erreur)

    await GET(request('Bearer secret-de-test'))

    expect(console.error).toHaveBeenCalledWith('[reactivation] push echoue :', USER_ID, erreur)
  })

  test('les deux transports réussissent : les envois sont cumulés', async () => {
    mockSendWebPush.mockResolvedValue(1)
    mockSendPush.mockResolvedValue(2)

    expect(await (await GET(request('Bearer secret-de-test'))).json())
      .toEqual({ sent: 0, pushed: 3, processed: 1, failed: 0 })
  })
})

// ── Phase K8.11 — K8.11-02, côté appelant.
//
// Un refus d'API Resend ne levait pas : l'UPDATE posait `reactivation_sent_at`
// et l'abonné était scellé « relancé » sans qu'aucun e-mail ne parte. Le module
// lève désormais, et le `catch` déjà présent — INCHANGÉ — reprend la main avant
// l'UPDATE, situé dans le même `try`.

describe('cron/reactivation — K8.11 : un échec d’envoi ne marque plus l’abonné', () => {
  beforeEach(() => {
    mockUpdates.length = 0
    mockState.subsResult = {
      data: [{ user_id: USER_ID, status: 'canceled', reactivation_sent_at: null }],
      error: null,
    }
    mockState.users = [{ id: USER_ID, email: 'resilie@exemple.fr' }]
    mockSendEmail.mockResolvedValue(undefined)
    mockSendWebPush.mockResolvedValue(0)
    mockSendPush.mockResolvedValue(0)
  })

  test('envoi en échec : AUCUN UPDATE — `reactivation_sent_at` reste nul', async () => {
    mockSendEmail.mockRejectedValue(new Error('Resend a refusé l’envoi (rate_limit_exceeded, HTTP 429)'))

    await GET(request('Bearer secret-de-test'))

    expect(mockUpdates).toHaveLength(0)
  })

  test('envoi en échec : `sent` reste à 0', async () => {
    mockSendEmail.mockRejectedValue(new Error('boom'))

    expect(await (await GET(request('Bearer secret-de-test'))).json())
      .toMatchObject({ sent: 0, processed: 1, failed: 1 })
  })

  test('succès : l’UPDATE a bien lieu (non-régression)', async () => {
    await GET(request('Bearer secret-de-test'))

    expect(mockUpdates).toHaveLength(1)
    expect(mockUpdates[0]).toHaveProperty('reactivation_sent_at')
  })
})
