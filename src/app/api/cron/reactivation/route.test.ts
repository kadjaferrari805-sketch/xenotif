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
  // Ajouté en K8.12.6 : le claim termine par `.select('user_id')` pour obtenir
  // un RETURNING. Sans cette méthode, l'UPDATE lèverait `select is not a function`.
  select(...args: unknown[]): FakeQuery
}

const mockState = {
  subsResult: { data: [] as unknown[] | null, error: null as FakeError },
  // Ajouté en K8.9 : comptes auth renvoyés par listUsers, pour atteindre le
  // chemin d'envoi. Vide par défaut — les tests K8.1 restent inchangés.
  users: [] as { id: string; email: string }[],
  // Ajouté en K8.12 : erreur renvoyée par l'UPDATE. `null` par défaut.
  updateError: null as FakeError,
  // Ajouté en K8.12.6 : pilote le RETURNING du claim. `true` → une ligne rendue
  // (CLAIM_WON) ; `false` → zéro ligne (CLAIM_LOST, un autre exécutant a gagné).
  claimWon: true,
  // File d'issues consommée appel par appel, quand plusieurs candidats doivent
  // connaître des sorts DIFFÉRENTS. Un booléen global ne le permettrait pas.
  claimSequence: [] as boolean[],
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
    select: () => query,
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
      // K8.12 : l'erreur devient configurable, sans quoi le chemin « écriture
      // refusée » resterait intestable.
      // K8.12.6 : l'UPDATE rend désormais `{ data, error }` — c'est le RETURNING
      // du claim qui départage CLAIM_WON de CLAIM_LOST.
      update: (payload: unknown) => {
        mockUpdates.push(payload)
        const gagne = mockState.claimSequence.length > 0
          ? mockState.claimSequence.shift()!
          : mockState.claimWon
        return chain({ data: gagne ? [{ user_id: 'claim' }] : [], error: mockState.updateError })
      },
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
  mockState.updateError = null
  // K8.12.6 — INDISPENSABLE : `clearAllMocks` n'efface que les appels, pas cet
  // état. Sans ces deux lignes, un test posant `claimWon = false` contaminait
  // tous les suivants : le claim y était perdu, `continue` s'exécutait, et
  // aucun envoi n'avait lieu — des tests échouaient, et d'autres réussissaient
  // pour la mauvaise raison.
  mockState.claimWon = true
  mockState.claimSequence = []
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
// Depuis K8.11, un refus d'API Resend LÈVE au lieu de se résoudre : l'échec est
// compté au lieu de passer pour un succès. Cette propriété est conservée.
//
// ⚠️ CE QUE K8.12.6 A INVERSÉ. Ce bloc assertait qu'un échec d'envoi ne marquait
// PAS l'abonné. Ce n'est plus vrai : l'appropriation précède désormais l'envoi
// et elle est DÉFINITIVE — c'est la perte rare explicitement acceptée en échange
// de la suppression du doublon (K8.12.3 §G).

describe('cron/reactivation — K8.11 : un échec d’envoi reste compté comme échec', () => {
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

  test('envoi en échec : l’abonné EST marqué — l’appropriation précède l’envoi', async () => {
    mockSendEmail.mockRejectedValue(new Error('Resend a refusé l’envoi (rate_limit_exceeded, HTTP 429)'))

    await GET(request('Bearer secret-de-test'))

    // INVERSION K8.12.6 : le claim a eu lieu AVANT l'envoi, donc il subsiste.
    expect(mockUpdates).toHaveLength(1)
    expect(mockUpdates[0]).toHaveProperty('reactivation_sent_at')
  })

  test('envoi en échec : `sent` reste à 0', async () => {
    mockSendEmail.mockRejectedValue(new Error('boom'))

    expect(await (await GET(request('Bearer secret-de-test'))).json())
      .toMatchObject({ sent: 0, processed: 1, failed: 1 })
  })

  test('aucune compensation : un SEUL UPDATE, jamais de remise à NULL', async () => {
    mockSendEmail.mockRejectedValue(new Error('boom'))

    await GET(request('Bearer secret-de-test'))

    expect(mockUpdates).toHaveLength(1)
    expect(JSON.stringify(mockUpdates)).not.toContain('null')
  })

  test('succès : l’UPDATE a bien lieu (non-régression)', async () => {
    await GET(request('Bearer secret-de-test'))

    expect(mockUpdates).toHaveLength(1)
    expect(mockUpdates[0]).toHaveProperty('reactivation_sent_at')
  })
})

// ── Phase K8.12 — COUCHE 1 : l'erreur d'UPDATE est enfin détectée.

describe('cron/reactivation — K8.12 : une erreur d’UPDATE n’est plus un succès', () => {
  const PG_WRITE_ERROR = { code: '42501', message: 'permission denied for table subscriptions' }

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

  test('écriture en erreur : `failed++`, `sent` inchangé', async () => {
    mockState.updateError = PG_WRITE_ERROR

    // AVANT K8.12 : { sent: 1 } alors que reactivation_sent_at restait NULL.
    expect(await (await GET(request('Bearer secret-de-test'))).json())
      .toMatchObject({ sent: 0, failed: 1, processed: 1 })
  })

  test('l’échec d’écriture est journalisé avec son libellé', async () => {
    mockState.updateError = PG_WRITE_ERROR

    await GET(request('Bearer secret-de-test'))

    const journal = (console.error as jest.Mock).mock.calls
      .flat()
      .map(a => (a instanceof Error ? a.message : String(a)))
      .join(' ')
    // INVERSION K8.12.6 : le libellé devient `claim echoue`, l'écriture étant
    // désormais l'appropriation elle-même.
    expect(journal).toContain('claim echoue')
    expect(journal).not.toContain('resilie@exemple.fr')
  })

  test('écriture OK : comportement inchangé', async () => {
    expect(await (await GET(request('Bearer secret-de-test'))).json())
      .toMatchObject({ sent: 1, failed: 0 })
  })
})

// ── Phase K8.12.6 — APPROPRIATION ATOMIQUE AVANT ENVOI (Option 3 simple).
//
// `UPDATE subscriptions SET reactivation_sent_at = now() WHERE user_id = … AND
// reactivation_sent_at IS NULL RETURNING user_id` n'accorde la ligne qu'à UN
// exécutant : c'est PostgreSQL qui arbitre, pas notre code.
//
// ⚠️ CES TESTS NE PROUVENT PAS LA CONCURRENCE RÉELLE. Ils vérifient que la
// route réagit correctement aux trois issues rendues par claimEvent, face à une
// doublure. La preuve PostgreSQL appartient à K8.12.8.

describe('cron/reactivation — K8.12.6 : claim atomique avant envoi', () => {
  const PG_WRITE_ERROR = { code: '42501', message: 'permission denied for table subscriptions' }
  const ADRESSE = 'resilie@exemple.fr'

  const journalDe = () =>
    (console.error as jest.Mock).mock.calls
      .flat()
      .map(a => (a instanceof Error ? a.message : typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a)))
      .join(' ')

  beforeEach(() => {
    mockUpdates.length = 0
    mockState.subsResult = {
      data: [{ user_id: USER_ID, status: 'canceled', reactivation_sent_at: null }],
      error: null,
    }
    mockState.users = [{ id: USER_ID, email: ADRESSE }]
    mockSendEmail.mockResolvedValue(undefined)
    mockSendWebPush.mockResolvedValue(0)
    mockSendPush.mockResolvedValue(0)
  })

  test('A. CLAIM_WON : e-mail envoyé, `sent++`, `failed` inchangé', async () => {
    const res = await GET(request('Bearer secret-de-test'))

    expect(mockSendEmail).toHaveBeenCalledTimes(1)
    expect(await res.json()).toMatchObject({ sent: 1, failed: 0 })
  })

  test('B. CLAIM_LOST : aucun e-mail, aucun compteur', async () => {
    mockState.claimWon = false

    const res = await GET(request('Bearer secret-de-test'))

    // Ni succès ni erreur : l'autre exécutant a gagné, c'est à lui d'envoyer.
    expect(mockSendEmail).not.toHaveBeenCalled()
    expect(await res.json()).toMatchObject({ sent: 0, failed: 0 })
  })

  test('C. DB_ERROR : aucun e-mail, `failed++`, rien d’interne dans la réponse', async () => {
    mockState.updateError = PG_WRITE_ERROR

    const res = await GET(request('Bearer secret-de-test'))
    const corps = JSON.stringify(await res.json())

    expect(mockSendEmail).not.toHaveBeenCalled()
    expect(res.status).toBe(200)
    expect(corps).toContain('"failed":1')
    for (const fuite of ['permission denied', '42501', 'subscriptions', ADRESSE]) {
      expect(corps).not.toContain(fuite)
    }
  })

  test('D. CLAIM_WON + échec Resend : `failed++`, marquage conservé, aucune compensation', async () => {
    mockSendEmail.mockRejectedValue(new Error('Resend a refusé l’envoi (rate_limit_exceeded, HTTP 429)'))

    const res = await GET(request('Bearer secret-de-test'))

    expect(mockSendEmail).toHaveBeenCalledTimes(1)
    expect(await res.json()).toMatchObject({ sent: 0, failed: 1 })
    expect(mockUpdates).toHaveLength(1)
    expect(mockUpdates[0]).toHaveProperty('reactivation_sent_at')
  })

  test('E. K8.12.2 : aucune erreur DB silencieuse, aucun `sent++` après échec d’écriture', async () => {
    mockState.updateError = PG_WRITE_ERROR

    await GET(request('Bearer secret-de-test'))

    expect(journalDe()).toContain('claim echoue')
    expect(journalDe()).toContain('permission denied')
  })

  test('F. K8.11 : le refus Resend reste distingué du refus d’écriture', async () => {
    mockSendEmail.mockRejectedValue(new Error('Resend a refusé l’envoi (validation_error, HTTP 422)'))

    await GET(request('Bearer secret-de-test'))

    expect(journalDe()).toContain('envoi echoue')
    expect(journalDe()).not.toContain('claim echoue')
  })

  test('G. K8.10 : aucune adresse dans les journaux, seul l’identifiant', async () => {
    mockState.updateError = PG_WRITE_ERROR

    await GET(request('Bearer secret-de-test'))

    expect(journalDe()).not.toContain(ADRESSE)
    expect(journalDe()).not.toContain('exemple.fr')
    expect(journalDe()).toContain(USER_ID)
  })

  test('plusieurs candidats : un claim perdu ne bloque pas les suivants', async () => {
    const AUTRE = '11111111-2222-3333-4444-555555555555'
    mockState.subsResult = {
      data: [
        { user_id: USER_ID, status: 'canceled', reactivation_sent_at: null },
        { user_id: AUTRE, status: 'canceled', reactivation_sent_at: null },
      ],
      error: null,
    }
    mockState.users = [{ id: USER_ID, email: ADRESSE }, { id: AUTRE, email: 'autre@exemple.fr' }]
    mockState.claimSequence = [false, true]

    const res = await GET(request('Bearer secret-de-test'))

    expect(mockSendEmail).toHaveBeenCalledTimes(1)
    expect(await res.json()).toMatchObject({ sent: 1, failed: 0, processed: 2 })
  })

  test('CLAIM_LOST saute aussi le push : il revient au gagnant', async () => {
    mockState.claimWon = false

    await GET(request('Bearer secret-de-test'))

    expect(mockSendWebPush).not.toHaveBeenCalled()
    expect(mockSendPush).not.toHaveBeenCalled()
  })

  test('un abonné SANS adresse n’est jamais approprié', async () => {
    // Le claim est à l'intérieur de `if (email)` : approprier un abonné dont
    // l'adresse est introuvable consommerait son unique réactivation sans
    // qu'aucun envoi ne soit possible — une perte SYSTÉMATIQUE.
    mockState.users = []

    await GET(request('Bearer secret-de-test'))

    expect(mockUpdates).toHaveLength(0)
    expect(mockSendEmail).not.toHaveBeenCalled()
    // Le push best-effort reste tenté, comme avant.
    expect(mockSendWebPush).toHaveBeenCalled()
  })
})
