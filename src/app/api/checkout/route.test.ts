/**
 * @jest-environment node
 */
// Environnement Node : les Route Handlers importent `next/server`, qui requiert
// les globals Fetch API natifs à Node (cf. src/app/api/streak/route.test.ts).
import { NextRequest } from 'next/server'

const mockCreateSession = jest.fn()
let mockUser: { id: string; email: string } | null = null

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    checkout: { sessions: { create: (...args: unknown[]) => mockCreateSession(...args) } },
  })),
}))
jest.mock('../../../lib/supabase/session', () => ({ getCurrentUser: async () => mockUser }))
jest.mock('../../../lib/ga-measurement', () => ({ parseGaClientId: () => '' }))

import { POST } from './route'

const request = (body: Record<string, unknown>) =>
  new NextRequest('http://localhost/api/checkout', { method: 'POST', body: JSON.stringify(body) })

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  jest.clearAllMocks()
  process.env = { ...ORIGINAL_ENV }
  process.env.STRIPE_SECRET_KEY = 'sk_test'
  delete process.env.VERCEL_ENV
  mockCreateSession.mockResolvedValue({ url: 'https://checkout.stripe.com/c/pay/cs_test' })
})

afterAll(() => {
  process.env = ORIGINAL_ENV
})

describe('POST /api/checkout', () => {
  test('connecté : le compte vient de la session, jamais du corps de la requête', async () => {
    mockUser = { id: 'user-session', email: 'moi@exemple.fr' }
    const res = await POST(request({ plan: 'pro', userId: 'user-victime', email: 'victime@exemple.fr' }))

    expect(res.status).toBe(200)
    const params = mockCreateSession.mock.calls[0][0]
    expect(params.client_reference_id).toBe('user-session')
    expect(params.customer_email).toBe('moi@exemple.fr')
    expect(params.subscription_data.metadata.user_id).toBe('user-session')
    expect(params.metadata.user_id).toBe('user-session')
  })

  test('sans session : aucun rattachement par ID, e-mail seulement pré-rempli', async () => {
    mockUser = null
    await POST(request({ plan: 'pro', userId: 'user-victime', email: 'nouveau@exemple.fr' }))

    const params = mockCreateSession.mock.calls[0][0]
    expect(params.client_reference_id).toBeUndefined()
    expect(params.customer_email).toBe('nouveau@exemple.fr')
    expect(params.subscription_data.metadata.user_id).toBe('')
  })

  test('preview : les URL de retour pointent vers la preview, jamais vers la production', async () => {
    mockUser = null
    process.env.VERCEL_ENV = 'preview'
    process.env.VERCEL_BRANCH_URL = 'xenotif-git-preview-kadjaferrari805-sketchs-projects.vercel.app'
    delete process.env.NEXT_PUBLIC_URL

    await POST(request({ plan: 'pro' }))

    const params = mockCreateSession.mock.calls[0][0]
    expect(params.success_url).toBe(
      'https://xenotif-git-preview-kadjaferrari805-sketchs-projects.vercel.app/success?session_id={CHECKOUT_SESSION_ID}',
    )
    expect(params.cancel_url).not.toContain('xenotif.com')
  })

  test('production : les URL de retour restent celles de la production', async () => {
    mockUser = null
    process.env.VERCEL_ENV = 'production'
    process.env.NEXT_PUBLIC_URL = 'https://xenotif.com'

    await POST(request({ plan: 'pro' }))

    const params = mockCreateSession.mock.calls[0][0]
    expect(params.success_url).toBe('https://xenotif.com/success?session_id={CHECKOUT_SESSION_ID}')
    expect(params.cancel_url).toBe('https://xenotif.com/#tarifs')
  })

  test('preview + clé Stripe LIVE → refus, aucune session créée', async () => {
    mockUser = null
    process.env.VERCEL_ENV = 'preview'
    process.env.VERCEL_BRANCH_URL = 'xenotif-git-preview-kadjaferrari805-sketchs-projects.vercel.app'
    process.env.STRIPE_SECRET_KEY = 'sk_live_interdite'

    const res = await POST(request({ plan: 'pro' }))

    expect(res.status).toBe(500)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })

  test('plan inconnu → 400', async () => {
    mockUser = null
    const res = await POST(request({ plan: 'elite' }))
    expect(res.status).toBe(400)
    expect(mockCreateSession).not.toHaveBeenCalled()
  })
})

// ─── Phase 09.8.5 — localisation des URL de retour ────────────────────────
//
// Avant cette phase, `success_url` et `cancel_url` étaient construites sur la
// seule `baseUrl` : un client EN ou DE qui validait ou annulait son paiement
// atterrissait sur l'accueil FRANÇAIS, alors que la locale était déjà connue
// (et déjà transmise à Stripe et aux metadata).

describe('POST /api/checkout — localisation des URL de retour', () => {
  beforeEach(() => {
    mockUser = null
    process.env.VERCEL_ENV = 'production'
    process.env.NEXT_PUBLIC_URL = 'https://xenotif.com'
  })

  const params = () => mockCreateSession.mock.calls[0][0]

  test.each([
    ['fr', 'https://xenotif.com/success?session_id={CHECKOUT_SESSION_ID}', 'https://xenotif.com/#tarifs'],
    ['en', 'https://xenotif.com/en/success?session_id={CHECKOUT_SESSION_ID}', 'https://xenotif.com/en/#tarifs'],
    ['de', 'https://xenotif.com/de/success?session_id={CHECKOUT_SESSION_ID}', 'https://xenotif.com/de/#tarifs'],
  ])('locale %s → success_url et cancel_url localisées', async (locale, success, cancel) => {
    await POST(request({ plan: 'pro', locale }))

    expect(params().success_url).toBe(success)
    expect(params().cancel_url).toBe(cancel)
  })

  test.each(['fr', 'en', 'de'])(
    'locale %s : le placeholder Stripe est conservé littéralement',
    async (locale) => {
      await POST(request({ plan: 'pro', locale }))
      expect(params().success_url).toContain('?session_id={CHECKOUT_SESSION_ID}')
      // Le placeholder ne doit être ni encodé ni substitué.
      expect(params().success_url).not.toContain('%7BCHECKOUT_SESSION_ID%7D')
    },
  )

  test.each(['fr', 'en', 'de'])('locale %s : base URL conservée, aucun double slash', async (locale) => {
    await POST(request({ plan: 'pro', locale }))

    for (const url of [params().success_url, params().cancel_url]) {
      expect(url.startsWith('https://xenotif.com/')).toBe(true)
      // Hors du `https://` initial, aucune séquence `//` ne doit subsister.
      expect(url.slice('https://'.length)).not.toContain('//')
    }
  })

  test('CONTRÔLE NÉGATIF : en DE, les URL non localisées ne sont plus produites', async () => {
    await POST(request({ plan: 'pro', locale: 'de' }))

    expect(params().cancel_url).not.toBe('https://xenotif.com/#tarifs')
    expect(params().success_url).not.toBe('https://xenotif.com/success?session_id={CHECKOUT_SESSION_ID}')
  })

  test('locale absente ou inconnue → retour non préfixé (locale par défaut)', async () => {
    await POST(request({ plan: 'pro', locale: 'xx' }))
    expect(params().cancel_url).toBe('https://xenotif.com/#tarifs')
    expect(params().success_url).toBe('https://xenotif.com/success?session_id={CHECKOUT_SESSION_ID}')
    expect(params().locale).toBe('fr')
  })

  test.each(['fr', 'en', 'de'])(
    'locale %s : la locale envoyée à Stripe et aux metadata est inchangée',
    async (locale) => {
      await POST(request({ plan: 'pro', locale }))

      expect(params().locale).toBe(locale)
      expect(params().metadata.locale).toBe(locale)
      expect(params().subscription_data.metadata.locale).toBe(locale)
    },
  )

  test('preview : la localisation s’applique aussi, sans jamais viser la production', async () => {
    process.env.VERCEL_ENV = 'preview'
    process.env.VERCEL_BRANCH_URL = 'xenotif-git-preview-kadjaferrari805-sketchs-projects.vercel.app'
    delete process.env.NEXT_PUBLIC_URL

    await POST(request({ plan: 'pro', locale: 'de' }))

    expect(params().success_url).toBe(
      'https://xenotif-git-preview-kadjaferrari805-sketchs-projects.vercel.app/de/success?session_id={CHECKOUT_SESSION_ID}',
    )
    expect(params().cancel_url).toBe(
      'https://xenotif-git-preview-kadjaferrari805-sketchs-projects.vercel.app/de/#tarifs',
    )
    expect(params().success_url).not.toContain('xenotif.com')
    expect(params().cancel_url).not.toContain('xenotif.com')
  })

  test('la logique métier Stripe n’est pas affectée par la locale', async () => {
    await POST(request({ plan: 'pro', locale: 'en' }))
    const p = params()

    expect(p.mode).toBe('subscription')
    expect(p.subscription_data.trial_period_days).toBe(7)
    expect(p.payment_method_collection).toBe('always')
    expect(p.allow_promotion_codes).toBe(true)
    expect(p.line_items).toHaveLength(1)
  })
})
