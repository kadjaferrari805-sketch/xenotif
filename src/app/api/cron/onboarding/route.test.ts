/**
 * @jest-environment node
 */
// Phase K8.9 — findings K8.9-01 et K8.9-02 sur cron/onboarding.
//
// K8.9-01 : la route renvoyait `subErr.message` et `profErr.message`, donc le
// message Postgres brut — table, colonne, contrainte — au client.
//
// K8.9-02 : elle renvoyait aussi un tableau `errors` dont chaque entrée était
// construite comme `onboarding ${u.email} (step ${step}): ${e}`. C'était une
// fuite de DONNÉES PERSONNELLES dans une réponse 200, qu'aucun motif de
// recherche portant sur `.message` ne pouvait détecter.
//
// AUCUN e-mail réel : le module d'envoi est doublé.

type FakeError = { message: string; code?: string } | null

const mockState = {
  subs: { data: [] as unknown[] | null, error: null as FakeError },
  profiles: { data: [] as unknown[] | null, error: null as FakeError },
  users: [] as { id: string; email: string; created_at: string }[],
  // Ajouté en K8.12 : erreur renvoyée par l'écriture. `null` par défaut.
  upsertError: null as FakeError,
  // Ajouté en K8.12.7 : pilote le RETURNING du claim. `true` → une ligne rendue
  // (CLAIM_WON) ; `false` → zéro ligne (CLAIM_LOST, un autre exécutant a gagné).
  claimWon: true,
  // File d'issues consommée appel par appel, quand plusieurs candidats doivent
  // connaître des sorts DIFFÉRENTS. Un booléen global ne le permettrait pas.
  claimSequence: [] as boolean[],
  // Étape renvoyée par `nextOnboardingStep`. Le double la figeait à 1, ce qui
  // rendait l'isolation par étape (scénario F) intestable.
  prochaineEtape: 1 as number | null,
}

const mockSendOnboarding = jest.fn()
/** Charges utiles des écritures observées (K8.11). Préfixé `mock` : contrainte du hoisting de jest.mock. */
const mockUpserts: unknown[] = []
/** Filtres des UPDATE de claim (K8.12.7) : prouve sur quelle ligne ET quelle étape il porte. */
const mockClaimFiltres: unknown[][] = []

/** `from('subscriptions')` puis `from('profiles')` : réponses distinctes. */
function chaîne(table: string) {
  const résultat = table === 'subscriptions' ? mockState.subs : mockState.profiles
  const q: Record<string, unknown> = {}
  q.select = () => q
  // Enregistré en K8.11 : sans cela, impossible d'affirmer que
  // `profiles.onboarding_step` n'est PAS consommé quand l'envoi échoue.
  q.upsert = (payload: unknown) => { mockUpserts.push(payload); return Promise.resolve({ error: mockState.upsertError }) }
  // K8.12.7 — le claim est un UPDATE conditionnel terminé par `.select('id')`.
  // La chaîne doit donc porter `eq` et `select`, et rendre `{ data, error }` :
  // c'est le RETURNING qui départage CLAIM_WON de CLAIM_LOST.
  q.update = (payload: unknown) => {
    mockUpserts.push(payload)
    const filtres: unknown[] = []
    const claim: Record<string, unknown> = {}
    claim.eq = (...args: unknown[]) => { filtres.push(['eq', ...args]); return claim }
    claim.select = () => claim
    claim.then = (ok: (v: unknown) => unknown) => {
      mockClaimFiltres.push(filtres)
      const gagne = mockState.claimSequence.length > 0
        ? mockState.claimSequence.shift()!
        : mockState.claimWon
      return Promise.resolve({
        data: gagne ? [{ id: 'claim' }] : [],
        error: mockState.upsertError,
      }).then(ok)
    }
    return claim
  }
  q.then = (ok: (v: unknown) => unknown) => Promise.resolve(résultat).then(ok)
  return q
}

jest.mock('../../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: (table: string) => chaîne(table),
    auth: {
      admin: {
        listUsers: async () => ({ data: { users: mockState.users }, error: null }),
      },
    },
  }),
}))
jest.mock('../../../../lib/emails', () => ({
  sendOnboardingEmail: (...a: unknown[]) => mockSendOnboarding(...a),
}))
jest.mock('../../../../lib/onboarding', () => ({
  // K8.12.7 : pilotable, pour pouvoir démontrer que (user, step 2) et
  // (user, step 3) sont deux événements distincts.
  nextOnboardingStep: () => mockState.prochaineEtape,
  accountAgeDays: () => 1,
}))

import { GET } from './route'

const SECRET = 'secret-de-test'
const ADRESSE = 'client@exemple.fr'

// La colonne onboarding_step est ajoutée hors migration : cette erreur est
// exactement le cas réel que la fuite exposait au client.
const PG_ERROR = { code: '42703', message: 'column profiles.onboarding_step does not exist' }

const requête = (auth?: string) =>
  new Request('http://localhost/api/cron/onboarding', { headers: auth ? { Authorization: auth } : {} })

const ok = () => requête(`Bearer ${SECRET}`)

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})
  process.env = { ...ORIGINAL_ENV, CRON_SECRET: SECRET }
  mockState.subs = { data: [], error: null }
  mockState.profiles = { data: [], error: null }
  mockState.users = []
  mockState.upsertError = null
  // K8.12.7 — INDISPENSABLE : `clearAllMocks` n'efface que les appels, pas cet
  // état. Sans ces réinitialisations, un test posant `claimWon = false`
  // contaminerait les suivants — c'est l'erreur commise en K8.12.6, où deux
  // tests échouaient et deux autres réussissaient POUR LA MAUVAISE RAISON.
  mockState.claimWon = true
  mockState.claimSequence = []
  mockState.prochaineEtape = 1
  mockClaimFiltres.length = 0
})

afterAll(() => { process.env = ORIGINAL_ENV })

describe('onboarding — K8.9-01 : aucun détail Postgres dans la réponse', () => {
  test('erreur sur subscriptions → 500 et corps générique', async () => {
    mockState.subs = { data: null, error: PG_ERROR }
    const res = await GET(ok())

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server_error' })
  })

  test('erreur sur profiles → 500 et corps générique', async () => {
    mockState.profiles = { data: null, error: PG_ERROR }
    const res = await GET(ok())

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'server_error' })
  })

  test('le corps ne nomme ni table, ni colonne, ni code SQL', async () => {
    mockState.profiles = { data: null, error: PG_ERROR }
    const corps = JSON.stringify(await (await GET(ok())).json()).toLowerCase()

    for (const fuite of ['column', 'profiles', 'onboarding_step', 'does not exist', '42703']) {
      expect(corps).not.toContain(fuite)
    }
  })

  test('le détail complet reste dans les logs serveur', async () => {
    mockState.subs = { data: null, error: PG_ERROR }
    await GET(ok())

    expect(console.error).toHaveBeenCalledWith('[onboarding] subscriptions query error:', PG_ERROR)
  })
})

describe('onboarding — K8.9-02 : aucune adresse dans la réponse', () => {
  beforeEach(() => {
    mockState.users = [{ id: 'user-1', email: ADRESSE, created_at: new Date().toISOString() }]
  })

  test('un envoi qui échoue ne fait PAS fuiter l’adresse', async () => {
    mockSendOnboarding.mockRejectedValue(new Error('SMTP 550 mailbox unavailable'))

    const res = await GET(ok())
    const corps = JSON.stringify(await res.json())

    expect(res.status).toBe(200)
    expect(corps).not.toContain(ADRESSE)
    expect(corps).not.toContain('exemple.fr')
    expect(corps).not.toContain('SMTP')
    expect(corps).not.toContain('mailbox unavailable')
  })

  test('l’échec est tout de même journalisé, avec l’identifiant et non l’adresse', async () => {
    const erreur = new Error('SMTP 550 mailbox unavailable')
    mockSendOnboarding.mockRejectedValue(erreur)

    await GET(ok())

    expect(console.error).toHaveBeenCalledWith('[onboarding] envoi echoue :', 'user-1', 'step 1', erreur)
    // L'identifiant de compte suffit au diagnostic ; l'adresse n'a rien à faire
    // dans un journal.
    const journalisé = (console.error as jest.Mock).mock.calls.flat().join(' ')
    expect(journalisé).not.toContain(ADRESSE)
  })

  test('la réponse ne porte qu’un COMPTE d’échecs', async () => {
    mockSendOnboarding.mockRejectedValue(new Error('boom'))

    expect(await (await GET(ok())).json()).toEqual({ sent: 0, failed: 1 })
  })
})

describe('onboarding — comportement nominal inchangé', () => {
  test('aucun compte à traiter : 200 { sent: 0, failed: 0 }', async () => {
    const res = await GET(ok())

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ sent: 0, failed: 0 })
    expect(mockSendOnboarding).not.toHaveBeenCalled()
  })

  test('un envoi réussi est compté, et rien n’est journalisé en erreur', async () => {
    mockState.users = [{ id: 'user-1', email: ADRESSE, created_at: new Date().toISOString() }]
    mockSendOnboarding.mockResolvedValue(undefined)

    const res = await GET(ok())

    expect(await res.json()).toEqual({ sent: 1, failed: 0 })
    expect(console.error).not.toHaveBeenCalled()
  })
})

// ── Phase K8.11 — K8.11-02, côté appelant.
//
// Depuis K8.11, un refus d'API Resend LÈVE au lieu de se résoudre : l'échec est
// compté au lieu de passer pour un succès. Cette propriété est conservée.
//
// ⚠️ CE QUE K8.12.7 A INVERSÉ. Ce bloc assertait qu'un échec d'envoi ne
// consommait PAS l'étape. Ce n'est plus vrai : l'appropriation précède désormais
// l'envoi et elle est DÉFINITIVE — c'est la perte rare explicitement acceptée en
// échange de la suppression du doublon (K8.12.3 §G).

describe('cron/onboarding — K8.11 : un échec d’envoi reste compté comme échec', () => {
  beforeEach(() => {
    mockUpserts.length = 0
    mockState.users = [{ id: 'user-1', email: ADRESSE, created_at: new Date().toISOString() }]
    mockSendOnboarding.mockResolvedValue(undefined)
  })

  test('envoi en échec : l’étape EST consommée — l’appropriation précède l’envoi', async () => {
    mockSendOnboarding.mockRejectedValue(new Error('Resend a refusé l’envoi (rate_limit_exceeded, HTTP 429)'))

    await GET(ok())

    // INVERSION K8.12.7 : le claim a eu lieu AVANT l'envoi, donc il subsiste.
    expect(mockUpserts).toHaveLength(1)
    expect(mockUpserts[0]).toMatchObject({ onboarding_step: 1 })
  })

  test('envoi en échec : `sent` reste à 0 et `failed` compte l’échec', async () => {
    mockSendOnboarding.mockRejectedValue(new Error('boom'))

    expect(await (await GET(ok())).json()).toEqual({ sent: 0, failed: 1 })
  })

  test('aucune compensation : une SEULE écriture, jamais de restauration', async () => {
    mockSendOnboarding.mockRejectedValue(new Error('boom'))

    await GET(ok())

    expect(mockUpserts).toHaveLength(1)
  })

  test('succès : l’étape est consommée (non-régression)', async () => {
    await GET(ok())

    expect(mockUpserts).toHaveLength(1)
    expect(mockUpserts[0]).toMatchObject({ onboarding_step: 1 })
  })
})

// ── Phase K8.12 — COUCHE 1 : l'erreur d'UPSERT est enfin détectée.

describe('cron/onboarding — K8.12 : une erreur d’UPSERT n’est plus un succès', () => {
  const PG_WRITE_ERROR = { code: '42501', message: 'permission denied for table profiles' }

  beforeEach(() => {
    mockUpserts.length = 0
    mockState.users = [{ id: 'user-1', email: ADRESSE, created_at: new Date().toISOString() }]
    mockSendOnboarding.mockResolvedValue(undefined)
  })

  test('écriture en erreur : `failed++`, `sent` inchangé', async () => {
    mockState.upsertError = PG_WRITE_ERROR

    // AVANT K8.12 : { sent: 1 } alors que l'étape n'était pas consommée.
    expect(await (await GET(ok())).json()).toEqual({ sent: 0, failed: 1 })
  })

  test('l’échec d’écriture est journalisé, sans l’adresse', async () => {
    mockState.upsertError = PG_WRITE_ERROR

    await GET(ok())

    const journal = (console.error as jest.Mock).mock.calls
      .flat()
      .map(a => (a instanceof Error ? a.message : String(a)))
      .join(' ')
    // INVERSION K8.12.7 : le libellé devient `claim echoue`, l'écriture étant
    // désormais l'appropriation elle-même.
    expect(journal).toContain('claim echoue')
    expect(journal).not.toContain(ADRESSE)
    expect(journal).toContain('user-1')
  })

  test('une erreur DB ne produit PAS un statut HTTP d’erreur', async () => {
    mockState.upsertError = PG_WRITE_ERROR

    expect((await GET(ok())).status).toBe(200)
  })

  test('écriture OK : comportement inchangé', async () => {
    expect(await (await GET(ok())).json()).toEqual({ sent: 1, failed: 0 })
  })
})

// ── Phase K8.12.7 — APPROPRIATION ATOMIQUE AVANT ENVOI (Option 3 simple).
//
// `UPDATE profiles SET onboarding_step = <step> WHERE id = <u.id> AND
// onboarding_step = <current> RETURNING id` n'accorde la ligne qu'à UN
// exécutant. L'identité protégée est le COUPLE (profile.id, onboarding_step).
//
// ⚠️ CES TESTS NE PROUVENT PAS LA CONCURRENCE RÉELLE. Ils vérifient que la
// route réagit correctement aux trois issues rendues par claimEvent, face à une
// doublure. La preuve PostgreSQL appartient à K8.12.8.

describe('cron/onboarding — K8.12.7 : claim atomique avant envoi', () => {
  const PG_WRITE_ERROR = { code: '42501', message: 'permission denied for table profiles' }

  const journalDe = () =>
    (console.error as jest.Mock).mock.calls
      .flat()
      .map(a => (a instanceof Error ? a.message : typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a)))
      .join(' ')

  beforeEach(() => {
    mockUpserts.length = 0
    mockState.users = [{ id: 'user-1', email: ADRESSE, created_at: new Date().toISOString() }]
    mockSendOnboarding.mockResolvedValue(undefined)
  })

  test('A. CLAIM_WON : e-mail envoyé, `sent++`', async () => {
    const res = await GET(ok())

    expect(mockSendOnboarding).toHaveBeenCalledTimes(1)
    expect(await res.json()).toEqual({ sent: 1, failed: 0 })
  })

  test('B. CLAIM_LOST : aucun e-mail, aucun compteur', async () => {
    mockState.claimWon = false

    const res = await GET(ok())

    expect(mockSendOnboarding).not.toHaveBeenCalled()
    expect(await res.json()).toEqual({ sent: 0, failed: 0 })
  })

  test('C. DB_ERROR : aucun e-mail, `failed++`, rien d’interne dans la réponse', async () => {
    mockState.upsertError = PG_WRITE_ERROR

    const res = await GET(ok())
    const corps = JSON.stringify(await res.json())

    expect(mockSendOnboarding).not.toHaveBeenCalled()
    expect(res.status).toBe(200)
    for (const fuite of ['permission denied', '42501', 'profiles', ADRESSE]) {
      expect(corps).not.toContain(fuite)
    }
  })

  test('D. CLAIM_WON + échec Resend : `failed++`, étape conservée, aucune compensation', async () => {
    mockSendOnboarding.mockRejectedValue(new Error('Resend a refusé l’envoi (rate_limit_exceeded, HTTP 429)'))

    const res = await GET(ok())

    expect(mockSendOnboarding).toHaveBeenCalledTimes(1)
    expect(await res.json()).toEqual({ sent: 0, failed: 1 })
    expect(mockUpserts).toHaveLength(1)
  })

  test('E. e-mail absent : AUCUN claim, l’étape n’est pas consommée', async () => {
    // Le claim suit le test `if (!u.email …)` : approprier un compte sans
    // adresse consommerait son étape sans qu'aucun envoi soit possible — une
    // perte SYSTÉMATIQUE, et non la perte rare acceptée.
    mockState.users = [{ id: 'user-1', email: '', created_at: new Date().toISOString() }]

    await GET(ok())

    expect(mockUpserts).toHaveLength(0)
    expect(mockSendOnboarding).not.toHaveBeenCalled()
  })

  test('F. STEP ISOLATION : le claim porte sur (id, étape courante), pas sur le seul profil', async () => {
    mockState.profiles = { data: [{ id: 'user-1', full_name: 'A', locale: 'fr', onboarding_step: 1 }], error: null }
    mockState.prochaineEtape = 2

    await GET(ok())

    // La garde cible l'étape LUE (1), et l'écriture pose l'étape suivante (2) :
    // s'approprier l'étape 2 laisse `current = 2`, donc l'étape 3 reste
    // éligible plus tard. Un claim ne bloque jamais l'étape d'après.
    expect(mockClaimFiltres[0]).toEqual([['eq', 'id', 'user-1'], ['eq', 'onboarding_step', 1]])
    expect(mockUpserts[0]).toMatchObject({ onboarding_step: 2 })
  })

  test('F bis. deux étapes du même compte sont deux événements distincts', async () => {
    mockState.profiles = { data: [{ id: 'user-1', full_name: 'A', locale: 'fr', onboarding_step: 2 }], error: null }
    mockState.prochaineEtape = 3

    await GET(ok())

    expect(mockClaimFiltres[0]).toEqual([['eq', 'id', 'user-1'], ['eq', 'onboarding_step', 2]])
    expect(mockUpserts[0]).toMatchObject({ onboarding_step: 3 })
  })

  test('G. K8.11 : le refus Resend reste distingué du refus d’écriture', async () => {
    mockSendOnboarding.mockRejectedValue(new Error('Resend a refusé l’envoi (validation_error, HTTP 422)'))

    await GET(ok())

    expect(journalDe()).toContain('envoi echoue')
    expect(journalDe()).not.toContain('claim echoue')
  })

  test('H. K8.12.2 : l’erreur d’écriture reste détectée et observable', async () => {
    mockState.upsertError = PG_WRITE_ERROR

    await GET(ok())

    expect(journalDe()).toContain('claim echoue')
    expect(journalDe()).toContain('permission denied')
  })

  test('I. K8.10 : aucune adresse dans les journaux, seul l’identifiant', async () => {
    mockState.upsertError = PG_WRITE_ERROR

    await GET(ok())

    expect(journalDe()).not.toContain(ADRESSE)
    expect(journalDe()).not.toContain('exemple.fr')
    expect(journalDe()).toContain('user-1')
  })

  // ── K8.12.7 — `upsert` → `update` : les deux cas, normal et anormal.
  //
  // CAS NORMAL   auth.users → handle_new_user → profiles → claim
  // CAS ANORMAL  profiles absent → UPDATE rend 0 ligne → CLAIM_LOST
  //              → aucun e-mail, AUCUNE création implicite de profil.
  //
  // C'est le seul écart de comportement introduit par le passage d'`upsert` à
  // `update`, et il doit être FAIL-SAFE : on préfère ne rien envoyer plutôt que
  // de recréer une ligne à l'insu du trigger.

  test('CAS NORMAL : profil présent → claim gagné → e-mail envoyé', async () => {
    mockState.profiles = {
      data: [{ id: 'user-1', full_name: 'A', locale: 'fr', onboarding_step: 0 }],
      error: null,
    }

    const res = await GET(ok())

    expect(mockSendOnboarding).toHaveBeenCalledTimes(1)
    expect(await res.json()).toEqual({ sent: 1, failed: 0 })
  })

  test('CAS ANORMAL : profil absent → UPDATE rend 0 → CLAIM_LOST, fail-safe', async () => {
    // Aucune ligne `profiles` pour ce compte : la garde `id = u.id` ne peut
    // matcher, donc le RETURNING est vide.
    mockState.profiles = { data: [], error: null }
    mockState.claimWon = false

    const res = await GET(ok())

    expect(mockSendOnboarding).not.toHaveBeenCalled()
    expect(await res.json()).toEqual({ sent: 0, failed: 0 })
  })

  test('CAS ANORMAL : AUCUNE création implicite de profil', async () => {
    mockState.profiles = { data: [], error: null }
    mockState.claimWon = false

    await GET(ok())

    // Le contraste avec l'ancien `upsert` est ici : il aurait CRÉÉ la ligne
    // absente, à l'insu du trigger `on_auth_user_created`. L'`update` ne peut
    // pas — et c'est voulu : la création de profil reste la seule affaire du
    // trigger (`handle_new_user`), jamais celle de ce cron.
    expect(mockUpserts).toHaveLength(1)
    expect(JSON.stringify(mockUpserts[0])).not.toContain('"id"')
    expect(mockClaimFiltres[0]).toEqual([['eq', 'id', 'user-1'], ['eq', 'onboarding_step', 0]])
  })

  test('CAS ANORMAL : un profil absent ne fait échouer aucun autre candidat', async () => {
    mockState.users = [
      { id: 'sans-profil', email: 'a@exemple.fr', created_at: new Date().toISOString() },
      { id: 'user-2', email: 'b@exemple.fr', created_at: new Date().toISOString() },
    ]
    mockState.claimSequence = [false, true]

    const res = await GET(ok())

    expect(mockSendOnboarding).toHaveBeenCalledTimes(1)
    expect(await res.json()).toEqual({ sent: 1, failed: 0 })
  })

  test('plusieurs candidats : un claim perdu ne bloque pas les suivants', async () => {
    mockState.users = [
      { id: 'user-1', email: 'a@exemple.fr', created_at: new Date().toISOString() },
      { id: 'user-2', email: 'b@exemple.fr', created_at: new Date().toISOString() },
    ]
    mockState.claimSequence = [false, true]

    const res = await GET(ok())

    expect(mockSendOnboarding).toHaveBeenCalledTimes(1)
    expect(await res.json()).toEqual({ sent: 1, failed: 0 })
  })
})
