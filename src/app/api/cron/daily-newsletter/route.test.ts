/**
 * @jest-environment node
 */
// Phase K8.9 — finding K8.9-02 sur cron/daily-newsletter.
//
// La route renvoyait `errors: errors.slice(0, 10)`, chaque entrée construite
// comme `${r.email}: ${e}` — donc jusqu'à DIX adresses réelles dans une réponse
// 200. Le `slice` bornait le volume, il ne protégeait rien.
//
// PARTICULARITÉ DE CETTE ROUTE : ses destinataires « prospects » proviennent de
// newsletter_subscribers et n'ont PAS de compte, donc pas d'identifiant à
// journaliser à la place de l'adresse. Le log la MASQUE (ab***@domaine) : le
// diagnostic reste possible, sans écrire de donnée personnelle en clair.
//
// AUCUN e-mail réel : les deux modules d'envoi sont doublés.

const mockState = {
  users: [] as { id: string; email: string }[],
  leads: [] as { email: string; locale?: string }[],
}

const mockMotivation = jest.fn()
const mockThemed = jest.fn()

function chaîne(table: string) {
  const résultat =
    table === 'newsletter_subscribers' ? { data: mockState.leads, error: null }
    : { data: [], error: null }
  const q: Record<string, unknown> = {}
  for (const m of ['select', 'in', 'eq']) q[m] = () => q
  q.then = (ok: (v: unknown) => unknown) => Promise.resolve(résultat).then(ok)
  return q
}

jest.mock('../../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: (table: string) => chaîne(table),
    auth: {
      admin: { listUsers: async () => ({ data: { users: mockState.users }, error: null }) },
    },
  }),
}))
jest.mock('../../../../lib/emails', () => ({
  sendDailyMotivationEmail: (...a: unknown[]) => mockMotivation(...a),
  sendThemedDailyEmail: (...a: unknown[]) => mockThemed(...a),
}))
jest.mock('../../../../lib/campaigns', () => ({ getDailyEmailTheme: () => 'motivation' }))

import { GET } from './route'

const SECRET = 'secret-de-test'
const ADRESSE = 'destinataire@exemple.fr'

const requête = (auth?: string) =>
  new Request('http://localhost/api/cron/daily-newsletter', { headers: auth ? { Authorization: auth } : {} })

const ok = () => requête(`Bearer ${SECRET}`)

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})
  process.env = { ...ORIGINAL_ENV, CRON_SECRET: SECRET }
  mockState.users = []
  mockState.leads = []
})

afterAll(() => { process.env = ORIGINAL_ENV })

describe('daily-newsletter — K8.9-02 : aucune adresse dans la réponse', () => {
  beforeEach(() => { mockState.leads = [{ email: ADRESSE }] })

  test('un envoi qui échoue ne fait PAS fuiter l’adresse', async () => {
    mockMotivation.mockRejectedValue(new Error('SMTP 421 service not available'))

    const res = await GET(ok())
    const corps = JSON.stringify(await res.json())

    expect(res.status).toBe(200)
    expect(corps).not.toContain(ADRESSE)
    expect(corps).not.toContain('exemple.fr')
    expect(corps).not.toContain('destinataire')
    expect(corps).not.toContain('SMTP')
  })

  test('la réponse ne porte qu’un COMPTE d’échecs', async () => {
    mockMotivation.mockRejectedValue(new Error('boom'))

    expect(await (await GET(ok())).json()).toEqual({ sent: 0, recipients: 1, failed: 1 })
  })

  test('le journal garde l’adresse MASQUÉE, jamais en clair', async () => {
    mockMotivation.mockRejectedValue(new Error('boom'))

    await GET(ok())

    const journalisé = (console.error as jest.Mock).mock.calls.flat().join(' ')
    expect(journalisé).toContain('de***@exemple.fr')
    expect(journalisé).not.toContain(ADRESSE)
  })

  test('même avec plusieurs échecs, aucune adresse ne sort', async () => {
    mockState.leads = Array.from({ length: 15 }, (_, i) => ({ email: `u${i}@exemple.fr` }))
    mockMotivation.mockRejectedValue(new Error('boom'))

    const corps = JSON.stringify(await (await GET(ok())).json())

    for (let i = 0; i < 15; i++) expect(corps).not.toContain(`u${i}@exemple.fr`)
    expect(corps).not.toContain('@')
  })
})

describe('daily-newsletter — comportement nominal inchangé', () => {
  test('aucun destinataire : 200 { sent: 0 }', async () => {
    const res = await GET(ok())

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ sent: 0 })
    expect(mockMotivation).not.toHaveBeenCalled()
  })

  test('un envoi réussi est compté, et rien n’est journalisé en erreur', async () => {
    mockState.leads = [{ email: ADRESSE }]
    mockMotivation.mockResolvedValue(undefined)

    const res = await GET(ok())

    expect(await res.json()).toEqual({ sent: 1, recipients: 1, failed: 0 })
    expect(console.error).not.toHaveBeenCalled()
  })
})

// ── Phase K8.11 — K8.11-02, côté appelant.
//
// Cette route ne marque rien en base : le préjudice y était uniquement un
// compteur `sent` surdéclaré. Le module lève désormais sur refus d'API, et le
// `catch` déjà présent — INCHANGÉ — classe l'envoi du bon côté.

describe('cron/daily-newsletter — K8.11 : un refus d’API n’est plus compté comme envoyé', () => {
  beforeEach(() => {
    mockState.leads = [{ email: ADRESSE }]
    mockMotivation.mockResolvedValue(undefined)
  })

  test('refus d’API : `sent` reste à 0, l’échec est compté', async () => {
    mockMotivation.mockRejectedValue(new Error('Resend a refusé l’envoi (rate_limit_exceeded, HTTP 429)'))

    expect(await (await GET(ok())).json()).toEqual({ sent: 0, recipients: 1, failed: 1 })
  })

  test('sur plusieurs destinataires, seuls les envois réels sont comptés', async () => {
    mockState.leads = [{ email: 'a@exemple.fr' }, { email: 'b@exemple.fr' }, { email: 'c@exemple.fr' }]
    mockMotivation
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('rate_limit_exceeded'))
      .mockResolvedValueOnce(undefined)

    expect(await (await GET(ok())).json()).toEqual({ sent: 2, recipients: 3, failed: 1 })
  })
})
