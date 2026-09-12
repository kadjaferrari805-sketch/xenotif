/**
 * @jest-environment node
 */
// Le portail client doit renvoyer vers l'environnement courant : une preview ne
// doit jamais ramener l'utilisateur sur la production.
const mockCreatePortalSession = jest.fn()

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    billingPortal: { sessions: { create: (...args: unknown[]) => mockCreatePortalSession(...args) } },
  })),
}))
jest.mock('../../../lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: 'user-1' } } }) } }),
  createServiceClient: async () => ({
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { stripe_customer_id: 'cus_test' } }) }) }),
    }),
  }),
}))

const ORIGINAL = { ...process.env }
const PREVIEW_HOST = 'xenotif-git-preview-kadjaferrari805-sketchs-projects.vercel.app'

async function post(env: Record<string, string | undefined>) {
  jest.resetModules()
  process.env = { ...ORIGINAL, ...env }
  const { POST } = await import('./route')
  return POST()
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCreatePortalSession.mockResolvedValue({ url: 'https://billing.stripe.com/session' })
})

afterAll(() => {
  process.env = ORIGINAL
})

describe('POST /api/stripe-portal', () => {
  test('preview : retour vers l’URL de preview, jamais vers la production', async () => {
    const res = await post({
      VERCEL_ENV: 'preview',
      STRIPE_SECRET_KEY: 'sk_test_x',
      VERCEL_BRANCH_URL: PREVIEW_HOST,
      NEXT_PUBLIC_URL: undefined,
    })
    expect(res.status).toBe(200)
    const params = mockCreatePortalSession.mock.calls[0][0]
    expect(params.return_url).toBe(`https://${PREVIEW_HOST}/dashboard/abonnement`)
    expect(params.return_url).not.toContain('xenotif.com')
  })

  test('production : comportement inchangé', async () => {
    const res = await post({
      VERCEL_ENV: 'production',
      STRIPE_SECRET_KEY: 'sk_live_x',
      NEXT_PUBLIC_URL: 'https://xenotif.com',
    })
    expect(res.status).toBe(200)
    expect(mockCreatePortalSession.mock.calls[0][0].return_url).toBe('https://xenotif.com/dashboard/abonnement')
  })

  test('preview + clé LIVE → refus, aucune session de portail créée', async () => {
    const res = await post({
      VERCEL_ENV: 'preview',
      STRIPE_SECRET_KEY: 'sk_live_x',
      VERCEL_BRANCH_URL: PREVIEW_HOST,
    })
    expect(res.status).toBe(500)
    expect(mockCreatePortalSession).not.toHaveBeenCalled()
  })
})
