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
}

const mockSendOnboarding = jest.fn()
/** Charges utiles des UPSERT observés (K8.11). Préfixé `mock` : contrainte du hoisting de jest.mock. */
const mockUpserts: unknown[] = []

/** `from('subscriptions')` puis `from('profiles')` : réponses distinctes. */
function chaîne(table: string) {
  const résultat = table === 'subscriptions' ? mockState.subs : mockState.profiles
  const q: Record<string, unknown> = {}
  q.select = () => q
  // Enregistré en K8.11 : sans cela, impossible d'affirmer que
  // `profiles.onboarding_step` n'est PAS consommé quand l'envoi échoue.
  q.upsert = (payload: unknown) => { mockUpserts.push(payload); return Promise.resolve({ error: null }) }
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
  nextOnboardingStep: () => 1,
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
// Un refus d'API Resend ne levait pas : l'UPSERT consommait l'étape
// `profiles.onboarding_step`, et le compte n'a jamais reçu l'e-mail de cette
// étape — définitivement. Le module lève désormais, et le `catch` déjà présent
// — INCHANGÉ — reprend la main avant l'UPSERT, situé dans le même `try`.

describe('cron/onboarding — K8.11 : un échec d’envoi ne consomme plus l’étape', () => {
  beforeEach(() => {
    mockUpserts.length = 0
    mockState.users = [{ id: 'user-1', email: ADRESSE, created_at: new Date().toISOString() }]
    mockSendOnboarding.mockResolvedValue(undefined)
  })

  test('envoi en échec : AUCUN UPSERT — l’étape reste à consommer', async () => {
    mockSendOnboarding.mockRejectedValue(new Error('Resend a refusé l’envoi (rate_limit_exceeded, HTTP 429)'))

    await GET(ok())

    expect(mockUpserts).toHaveLength(0)
  })

  test('envoi en échec : `sent` reste à 0 et `failed` compte l’échec', async () => {
    mockSendOnboarding.mockRejectedValue(new Error('boom'))

    expect(await (await GET(ok())).json()).toEqual({ sent: 0, failed: 1 })
  })

  test('succès : l’étape est consommée (non-régression)', async () => {
    await GET(ok())

    expect(mockUpserts).toHaveLength(1)
    expect(mockUpserts[0]).toMatchObject({ id: 'user-1', onboarding_step: 1 })
  })
})
