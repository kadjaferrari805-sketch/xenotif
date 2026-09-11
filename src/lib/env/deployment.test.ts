import {
  assertStripeKeyAllowed,
  assertSupabaseEnvironment,
  assertWebhookEventAllowed,
  getDeploymentEnv,
  getGa4MeasurementId,
  getPublicBaseUrl,
  getStripeSecretKey,
  stripeKeyMode,
  supabaseKeyRef,
  supabaseProjectRef,
  PRODUCTION_GA4_MEASUREMENT_ID,
  PRODUCTION_ORIGIN,
  PRODUCTION_SUPABASE_REF,
} from './deployment'

// Aucune valeur réelle ici : uniquement des préfixes et des références de projet,
// qui ne sont pas des secrets.
const PREVIEW_REF = 'jmdfgpvxdbnwqjtdamcu'
const PREVIEW_HOST = 'xenotif-git-preview-kadjaferrari805-sketchs-projects.vercel.app'

const preview = (extra: Record<string, string> = {}) => ({ VERCEL_ENV: 'preview', ...extra })
const production = (extra: Record<string, string> = {}) => ({ VERCEL_ENV: 'production', ...extra })
const development = (extra: Record<string, string> = {}) => ({ VERCEL_ENV: 'development', ...extra })

/** Clé Supabase historique factice : un JWT dont seul le claim `ref` compte. */
const keyForRef = (ref: string) =>
  `header.${Buffer.from(JSON.stringify({ ref, role: 'anon' })).toString('base64url')}.signature`

describe('getDeploymentEnv', () => {
  test.each([
    [{ VERCEL_ENV: 'production' }, 'production'],
    [{ VERCEL_ENV: 'preview' }, 'preview'],
    [{ VERCEL_ENV: 'development' }, 'development'],
    [{ NEXT_PUBLIC_VERCEL_ENV: 'preview' }, 'preview'],
    [{ VERCEL_ENV: 'staging' }, 'development'],
    [{}, 'development'],
  ])('%j → %s', (env, expected) => {
    expect(getDeploymentEnv(env as Record<string, string>)).toBe(expected)
  })
})

describe('garde Stripe', () => {
  test.each([
    ['sk_test_x', 'test'],
    ['rk_test_x', 'test'],
    ['sk_live_x', 'live'],
    ['rk_live_x', 'live'],
    ['pk_autre', 'unknown'],
    [undefined, 'missing'],
  ])('stripeKeyMode(%s) = %s', (key, expected) => {
    expect(stripeKeyMode(key as string | undefined)).toBe(expected)
  })

  test('preview + sk_test → accepté', () => {
    expect(() => assertStripeKeyAllowed('sk_test_x', preview())).not.toThrow()
  })

  test('preview + rk_test → accepté', () => {
    expect(() => assertStripeKeyAllowed('rk_test_x', preview())).not.toThrow()
  })

  test('preview + sk_live → refusé', () => {
    expect(() => assertStripeKeyAllowed('sk_live_x', preview())).toThrow(/LIVE refusée/)
  })

  test('preview + rk_live → refusé', () => {
    expect(() => assertStripeKeyAllowed('rk_live_x', preview())).toThrow(/LIVE refusée/)
  })

  test('preview + préfixe inconnu → refusé', () => {
    expect(() => assertStripeKeyAllowed('clef_bizarre', preview())).toThrow(/préfixe inconnu/)
  })

  test('production + LIVE → accepté', () => {
    expect(() => assertStripeKeyAllowed('sk_live_x', production())).not.toThrow()
  })

  test('development + TEST → accepté, development + LIVE → refusé', () => {
    expect(() => assertStripeKeyAllowed('sk_test_x', development())).not.toThrow()
    expect(() => assertStripeKeyAllowed('sk_live_x', development())).toThrow(/LIVE refusée/)
  })

  test('clé absente → aucune erreur (les routes gèrent déjà l’absence)', () => {
    expect(() => assertStripeKeyAllowed(undefined, preview())).not.toThrow()
    expect(getStripeSecretKey(preview())).toBeNull()
  })

  test('getStripeSecretKey renvoie la clé de test en preview et lève sur une clé LIVE', () => {
    expect(getStripeSecretKey(preview({ STRIPE_SECRET_KEY: 'sk_test_x' }))).toBe('sk_test_x')
    expect(() => getStripeSecretKey(preview({ STRIPE_SECRET_KEY: 'sk_live_x' }))).toThrow()
  })
})

describe('garde webhook', () => {
  test('preview + événement de test → accepté', () => {
    expect(() => assertWebhookEventAllowed(false, preview())).not.toThrow()
  })

  test('preview + événement LIVE → refusé', () => {
    expect(() => assertWebhookEventAllowed(true, preview())).toThrow(/LIVE reçu/)
  })

  test('production + événement LIVE → accepté', () => {
    expect(() => assertWebhookEventAllowed(true, production())).not.toThrow()
  })
})

describe('URL publique', () => {
  test('production : NEXT_PUBLIC_URL, sinon le domaine de production', () => {
    expect(getPublicBaseUrl(production({ NEXT_PUBLIC_URL: 'https://xenotif.com' }))).toBe(PRODUCTION_ORIGIN)
    expect(getPublicBaseUrl(production())).toBe(PRODUCTION_ORIGIN)
  })

  test('preview : NEXT_PUBLIC_URL de preview', () => {
    expect(getPublicBaseUrl(preview({ NEXT_PUBLIC_URL: `https://${PREVIEW_HOST}` }))).toBe(`https://${PREVIEW_HOST}`)
  })

  test('preview : une URL de production configurée est ignorée au profit de l’URL de branche', () => {
    const url = getPublicBaseUrl(preview({ NEXT_PUBLIC_URL: 'https://xenotif.com', VERCEL_BRANCH_URL: PREVIEW_HOST }))
    expect(url).toBe(`https://${PREVIEW_HOST}`)
    expect(url).not.toContain('xenotif.com')
  })

  test('preview : repli sur VERCEL_URL', () => {
    expect(getPublicBaseUrl(preview({ VERCEL_URL: 'xenotif-abc123.vercel.app' }))).toBe('https://xenotif-abc123.vercel.app')
  })

  test('preview : aucune URL exploitable → erreur (jamais de repli production)', () => {
    expect(() => getPublicBaseUrl(preview())).toThrow(/URL publique introuvable/)
    expect(() => getPublicBaseUrl(preview({ NEXT_PUBLIC_URL: 'https://www.xenotif.com' }))).toThrow()
  })

  test('development : localhost par défaut', () => {
    expect(getPublicBaseUrl(development())).toBe('http://localhost:3000')
  })
})

describe('garde Supabase', () => {
  const previewUrl = `https://${PREVIEW_REF}.supabase.co`
  const productionUrl = `https://${PRODUCTION_SUPABASE_REF}.supabase.co`

  test('extraction des références', () => {
    expect(supabaseProjectRef(previewUrl)).toBe(PREVIEW_REF)
    expect(supabaseProjectRef('pas une url')).toBeNull()
    expect(supabaseKeyRef(keyForRef(PREVIEW_REF))).toBe(PREVIEW_REF)
    expect(supabaseKeyRef('sb_secret_sans_claim')).toBeNull()
  })

  test('preview + projet Preview → accepté', () => {
    expect(() =>
      assertSupabaseEnvironment({ url: previewUrl, keys: [keyForRef(PREVIEW_REF)] }, preview()),
    ).not.toThrow()
  })

  test('preview + projet de PRODUCTION → refusé', () => {
    expect(() => assertSupabaseEnvironment({ url: productionUrl }, preview())).toThrow(/PRODUCTION/)
  })

  test('preview + clé du projet de PRODUCTION → refusé', () => {
    expect(() =>
      assertSupabaseEnvironment({ url: previewUrl, keys: [keyForRef(PRODUCTION_SUPABASE_REF)] }, preview()),
    ).toThrow(/PRODUCTION/)
  })

  test('preview + clé d’un autre projet que l’URL → refusé', () => {
    expect(() =>
      assertSupabaseEnvironment({ url: previewUrl, keys: [keyForRef('autreprojetref')] }, preview()),
    ).toThrow(/incohérente/)
  })

  test('preview + projet différent de EXPECTED_SUPABASE_PROJECT_REF → refusé', () => {
    expect(() =>
      assertSupabaseEnvironment({ url: previewUrl }, preview({ EXPECTED_SUPABASE_PROJECT_REF: 'autre' })),
    ).toThrow(/attendu/)
  })

  test('production + projet de production → accepté', () => {
    expect(() => assertSupabaseEnvironment({ url: productionUrl }, production())).not.toThrow()
  })
})

describe('GA4', () => {
  test('production → identifiant de production', () => {
    expect(getGa4MeasurementId(production())).toBe(PRODUCTION_GA4_MEASUREMENT_ID)
  })

  test('preview → désactivé tant qu’aucune propriété dédiée n’est configurée', () => {
    expect(getGa4MeasurementId(preview())).toBeNull()
    expect(getGa4MeasurementId(development())).toBeNull()
  })

  test('preview + propriété dédiée → cette propriété', () => {
    expect(getGa4MeasurementId(preview({ NEXT_PUBLIC_GA4_MEASUREMENT_ID: 'G-PREVIEW' }))).toBe('G-PREVIEW')
  })
})
