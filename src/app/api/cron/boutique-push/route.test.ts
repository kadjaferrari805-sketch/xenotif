/**
 * @jest-environment node
 */
// Phase K8.9 — finding K8.9-03 sur les routes cron de PUSH.
//
// Ces routes accumulaient un tableau `errors` dont chaque entrée était bâtie
// comme `${userId}: ${e}` — donc l'identifiant de compte ET le texte brut de
// l'exception (souvent le corps de la réponse Expo ou VAPID) dans une réponse
// 200. La réponse ne porte plus qu'un COMPTE ; le détail part en journal.
//
// boutique-push est la REPRÉSENTANTE des sept routes push : guide-push,
// subscribe-push, daily-motivation, evening-reminder et streak-finalize
// appliquent le même patron, à l'identique. La garde d'authentification des dix
// routes est couverte séparément par ../auth.test.ts.
//
// AUCUN push réel : les deux transports sont doublés.

const mockState = {
  recipients: [] as { userId: string; locale: string }[],
}

const mockSendPush = jest.fn()
const mockSendWebPush = jest.fn()

jest.mock('../../../../lib/supabase/admin', () => ({ createAdminClient: () => ({}) }))
jest.mock('../../../../lib/push', () => ({ sendPushToUser: (...a: unknown[]) => mockSendPush(...a) }))
jest.mock('../../../../lib/web-push', () => ({ sendWebPushToUser: (...a: unknown[]) => mockSendWebPush(...a) }))
jest.mock('../../../../lib/push-recipients', () => ({
  getDevicePushRecipients: async () => mockState.recipients,
}))
jest.mock('../../../../lib/campaigns', () => ({
  getCampaignPush: () => ({ title: 'Titre', body: 'Corps', url: '/boutique', tag: 'boutique' }),
}))

import { GET } from './route'

const SECRET = 'secret-de-test'
const USER_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7'

const requête = (auth?: string) =>
  new Request('http://localhost/api/cron/boutique-push', { headers: auth ? { Authorization: auth } : {} })

const ok = () => requête(`Bearer ${SECRET}`)

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})
  process.env = { ...ORIGINAL_ENV, CRON_SECRET: SECRET }
  mockState.recipients = []
  mockSendPush.mockResolvedValue(0)
  mockSendWebPush.mockResolvedValue(0)
})

afterAll(() => { process.env = ORIGINAL_ENV })

describe('boutique-push — K8.9-03 : ni identifiant ni exception dans la réponse', () => {
  beforeEach(() => { mockState.recipients = [{ userId: USER_ID, locale: 'fr' }] })

  test('un push natif en échec ne fait fuiter ni userId ni exception', async () => {
    mockSendPush.mockRejectedValue(new Error('Expo 400 DeviceNotRegistered token ExponentPushToken[xxx]'))

    const res = await GET(ok())
    const corps = JSON.stringify(await res.json())

    expect(res.status).toBe(200)
    expect(corps).not.toContain(USER_ID)
    expect(corps).not.toContain('Expo')
    expect(corps).not.toContain('DeviceNotRegistered')
    expect(corps).not.toContain('ExponentPushToken')
    expect(corps).not.toContain('Error')
  })

  test('la réponse ne porte que des COMPTES', async () => {
    mockSendPush.mockRejectedValue(new Error('boom natif'))
    mockSendWebPush.mockRejectedValue(new Error('boom web'))

    // Les deux transports sont tentés indépendamment : deux échecs pour un seul
    // destinataire.
    expect(await (await GET(ok())).json()).toEqual({ pushed: 0, devices: 1, failed: 2 })
  })

  test('le diagnostic serveur reste complet : identifiant ET exception journalisés', async () => {
    const erreurNative = new Error('boom natif')
    const erreurWeb = new Error('boom web')
    mockSendPush.mockRejectedValue(erreurNative)
    mockSendWebPush.mockRejectedValue(erreurWeb)

    await GET(ok())

    expect(console.error).toHaveBeenCalledWith('[boutique-push] push natif echoue :', USER_ID, erreurNative)
    expect(console.error).toHaveBeenCalledWith('[boutique-push] web push echoue :', USER_ID, erreurWeb)
  })

  test('un transport en échec n’empêche pas l’autre', async () => {
    mockSendPush.mockRejectedValue(new Error('boom natif'))
    mockSendWebPush.mockResolvedValue(1)

    expect(await (await GET(ok())).json()).toEqual({ pushed: 1, devices: 1, failed: 1 })
  })
})

describe('boutique-push — comportement nominal inchangé', () => {
  test('aucun appareil enregistré : 200 { pushed: 0, devices: 0 }', async () => {
    const res = await GET(ok())

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ pushed: 0, devices: 0 })
    expect(mockSendPush).not.toHaveBeenCalled()
  })

  test('les deux transports réussissent : les envois sont cumulés', async () => {
    mockState.recipients = [{ userId: USER_ID, locale: 'fr' }]
    mockSendPush.mockResolvedValue(1)
    mockSendWebPush.mockResolvedValue(2)

    const res = await GET(ok())

    expect(await res.json()).toEqual({ pushed: 3, devices: 1, failed: 0 })
    expect(console.error).not.toHaveBeenCalled()
  })
})
