/**
 * @jest-environment node
 */
// Phase K8.9 — finding K8.9-04 : la garde CRON_SECRET.
//
// Sept routes comparaient l'en-tête à `Bearer ${process.env.CRON_SECRET}` SANS
// vérifier que la variable existe. Si elle manquait, le gabarit produisait la
// chaîne littérale « Bearer undefined » — qu'un tiers peut deviner. Les dix
// routes sont désormais fail-closed.
//
// UNE SEULE MATRICE pour les dix routes : la garde est identique partout, et
// dix fichiers quasi dupliqués seraient impossibles à maintenir. Toute route
// cron ajoutée sans garde fail-closed fera échouer ce fichier.
//
// AUCUN e-mail, AUCUN push, AUCUNE base : toutes les dépendances sont doublées,
// y compris celles évaluées au CHARGEMENT du module (getPublicBaseUrl).

const chaîne = (result: unknown) => {
  const q: Record<string, unknown> = {}
  for (const m of ['select', 'eq', 'is', 'in', 'lt', 'limit', 'order', 'update', 'upsert']) {
    q[m] = () => q
  }
  q.then = (ok: (v: unknown) => unknown) => Promise.resolve(result).then(ok)
  return q
}

jest.mock('../../../lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => chaîne({ data: [], error: null }),
    auth: { admin: { listUsers: async () => ({ data: { users: [] }, error: null }) } },
  }),
}))
jest.mock('../../../lib/emails', () => ({
  sendAbandonedCartEmail: jest.fn(),
  sendOnboardingEmail: jest.fn(),
  sendReactivationEmail: jest.fn(),
  sendDailyMotivationEmail: jest.fn(),
  sendThemedDailyEmail: jest.fn(),
}))
jest.mock('../../../lib/push', () => ({ sendPushToUser: jest.fn(async () => 0) }))
jest.mock('../../../lib/web-push', () => ({ sendWebPushToUser: jest.fn(async () => 0) }))
jest.mock('../../../lib/push-recipients', () => ({ getDevicePushRecipients: async () => [] }))
jest.mock('../../../lib/campaigns', () => ({
  getCampaignPush: () => ({ title: 't', body: 'b', url: '/u', tag: 'tag' }),
  getDailyEmailTheme: () => 'motivation',
}))
jest.mock('../../../lib/daily-motivation', () => ({
  getDailyPushContent: () => ({ title: 't', body: 'b' }),
  getEveningPushContent: () => ({ title: 't', body: 'b' }),
}))
jest.mock('../../../lib/streak/service', () => ({ getStreak: jest.fn() }))
jest.mock('../../../lib/streak/reminder-content', () => ({ getStreakReminderContent: () => ({ title: 't', body: 'b' }) }))
jest.mock('../../../lib/onboarding', () => ({ nextOnboardingStep: () => null, accountAgeDays: () => 0 }))
jest.mock('../../../lib/boutique/products', () => ({ PRODUCTS: [], formatPrice: () => '0 €' }))
// Évalué au CHARGEMENT du module par cron/abandoned-cart : sans ce double,
// l'import de la route échouerait avant même le premier test.
jest.mock('../../../lib/env/deployment', () => ({ getPublicBaseUrl: () => 'https://xenotif.test' }))

import { GET as abandonedCart } from './abandoned-cart/route'
import { GET as boutiquePush } from './boutique-push/route'
import { GET as dailyMotivation } from './daily-motivation/route'
import { GET as dailyNewsletter } from './daily-newsletter/route'
import { GET as eveningReminder } from './evening-reminder/route'
import { GET as guidePush } from './guide-push/route'
import { GET as onboarding } from './onboarding/route'
import { GET as reactivation } from './reactivation/route'
import { GET as streakFinalize } from './streak-finalize/route'
import { GET as subscribePush } from './subscribe-push/route'

const SECRET = 'secret-de-test'

/** Les DIX routes cron du Website. */
const ROUTES: [string, (r: Request) => Promise<Response>][] = [
  ['abandoned-cart', abandonedCart],
  ['boutique-push', boutiquePush],
  ['daily-motivation', dailyMotivation],
  ['daily-newsletter', dailyNewsletter],
  ['evening-reminder', eveningReminder],
  ['guide-push', guidePush],
  ['onboarding', onboarding],
  ['reactivation', reactivation],
  ['streak-finalize', streakFinalize],
  ['subscribe-push', subscribePush],
]

const requête = (auth?: string) =>
  new Request('http://localhost/api/cron/x', { headers: auth ? { Authorization: auth } : {} })

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})
  process.env = { ...ORIGINAL_ENV, CRON_SECRET: SECRET }
})

afterAll(() => { process.env = ORIGINAL_ENV })

describe('crons — la garde refuse (K8.9-04)', () => {
  test.each(ROUTES)('%s : en-tête ABSENT → 401', async (_nom, GET) => {
    expect((await GET(requête())).status).toBe(401)
  })

  test.each(ROUTES)('%s : mauvais secret → 401', async (_nom, GET) => {
    expect((await GET(requête('Bearer mauvais'))).status).toBe(401)
  })

  test.each(ROUTES)('%s : CRON_SECRET ABSENT de l’environnement → 401', async (_nom, GET) => {
    delete process.env.CRON_SECRET
    expect((await GET(requête(`Bearer ${SECRET}`))).status).toBe(401)
  })

  test.each(ROUTES)('%s : CRON_SECRET absent ET en-tête « Bearer undefined » → 401', async (_nom, GET) => {
    // LE défaut corrigé. Avant, le gabarit produisait cette chaîne exacte et la
    // comparaison réussissait : la garde était franchissable.
    delete process.env.CRON_SECRET
    expect((await GET(requête('Bearer undefined'))).status).toBe(401)
  })

  test.each(ROUTES)('%s : CRON_SECRET vide → 401', async (_nom, GET) => {
    process.env.CRON_SECRET = ''
    expect((await GET(requête('Bearer '))).status).toBe(401)
  })
})

describe('crons — la garde accepte le bon secret (K8.9-04)', () => {
  test.each(ROUTES)('%s : bon secret → pas 401', async (_nom, GET) => {
    const res = await GET(requête(`Bearer ${SECRET}`))
    expect(res.status).not.toBe(401)
  })
})

describe('crons — le 401 ne divulgue rien (K8.9-04)', () => {
  test.each(ROUTES)('%s : corps générique, sans secret ni en-tête', async (_nom, GET) => {
    const res = await GET(requête('Bearer mauvais'))
    const corps = JSON.stringify(await res.json())

    expect(corps).toEqual('{"error":"Unauthorized"}')
    for (const fuite of [SECRET, 'CRON_SECRET', 'Authorization', 'Bearer', 'token', 'at ', 'node_modules']) {
      expect(corps).not.toContain(fuite)
    }
  })
})
