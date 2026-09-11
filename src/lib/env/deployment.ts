// Source unique de vérité pour l'environnement de déploiement (production /
// preview / development) et pour tout ce qui doit en dépendre : clés Stripe,
// URL publique, projet Supabase, identifiant GA4.
//
// Pourquoi : jusqu'ici chaque route reconstruisait son URL avec
// `process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.com'`. Sur une preview sans
// NEXT_PUBLIC_URL, Stripe renvoyait donc l'utilisateur vers la PRODUCTION, et
// rien n'empêchait une clé Stripe LIVE d'être utilisée hors production.
//
// Ce module ne dépend que de JavaScript standard (pas de Buffer ni de `node:`) :
// il est importé aussi bien par le proxy que par les Route Handlers.

export type DeploymentEnv = 'production' | 'preview' | 'development'

export const PRODUCTION_ORIGIN = 'https://xenotif.com'
export const PRODUCTION_SUPABASE_REF = 'pciadjwuxuevkqkdarut'
export const PRODUCTION_GA4_MEASUREMENT_ID = 'G-3H3JTM404V'

const PRODUCTION_HOSTS = new Set(['xenotif.com', 'www.xenotif.com'])

type Env = Record<string, string | undefined>

/** Erreur de garde d'environnement : ne contient JAMAIS de secret, seulement un mode. */
export class EnvironmentGuardError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentGuardError'
  }
}

/**
 * VERCEL_ENV sur Vercel (`production` | `preview` | `development`),
 * NEXT_PUBLIC_VERCEL_ENV côté navigateur, `development` partout ailleurs
 * (local, tests). Une valeur inconnue est traitée comme `development` : jamais
 * comme production, pour que la garde reste fermée par défaut.
 */
export function getDeploymentEnv(env: Env = process.env): DeploymentEnv {
  const raw = env.VERCEL_ENV ?? env.NEXT_PUBLIC_VERCEL_ENV
  return raw === 'production' || raw === 'preview' || raw === 'development' ? raw : 'development'
}

export function isProductionDeployment(env: Env = process.env): boolean {
  return getDeploymentEnv(env) === 'production'
}

// ---------------------------------------------------------------- Stripe

export type StripeKeyMode = 'live' | 'test' | 'missing' | 'unknown'

/** Mode d'une clé Stripe d'après son seul préfixe (`sk_`/`rk_`). */
export function stripeKeyMode(key: string | undefined | null): StripeKeyMode {
  if (!key) return 'missing'
  if (/^(sk|rk)_live/.test(key)) return 'live'
  if (/^(sk|rk)_test/.test(key)) return 'test'
  return 'unknown'
}

/**
 * Production : Stripe LIVE (ou TEST) autorisé.
 * Preview et development : clé de TEST uniquement. Une clé LIVE, ou une clé au
 * préfixe inconnu, lève une erreur — on ne convertit jamais une clé LIVE en TEST.
 */
export function assertStripeKeyAllowed(key: string | undefined | null, env: Env = process.env): void {
  const deployment = getDeploymentEnv(env)
  const mode = stripeKeyMode(key)
  if (mode === 'missing') return
  if (deployment === 'production') {
    if (mode === 'unknown') {
      throw new EnvironmentGuardError('Stripe : préfixe de clé inconnu en production (attendu sk_/rk_).')
    }
    return
  }
  if (mode !== 'test') {
    throw new EnvironmentGuardError(
      `Stripe : clé ${mode === 'live' ? 'LIVE' : 'de préfixe inconnu'} refusée en environnement ${deployment}. ` +
        'Seule une clé de test (sk_test…/rk_test…) est autorisée hors production.',
    )
  }
}

/** Clé Stripe validée, ou `null` si aucune clé n'est configurée. */
export function getStripeSecretKey(env: Env = process.env): string | null {
  const key = env.STRIPE_SECRET_KEY
  assertStripeKeyAllowed(key, env)
  return key && key.length > 0 ? key : null
}

/**
 * Un événement Stripe `livemode: true` reçu hors production signale un webhook
 * LIVE pointé sur une preview : on refuse de le traiter.
 */
export function assertWebhookEventAllowed(livemode: boolean, env: Env = process.env): void {
  if (livemode && !isProductionDeployment(env)) {
    throw new EnvironmentGuardError(
      `Stripe : événement LIVE reçu en environnement ${getDeploymentEnv(env)}. Seuls les événements de test y sont acceptés.`,
    )
  }
}

// ------------------------------------------------------------------- URL

function normalizeUrl(value: string | undefined | null): string | null {
  const raw = value?.trim()
  if (!raw) return null
  const withScheme = /^https?:\/\//.test(raw) ? raw : `https://${raw}`
  try {
    const url = new URL(withScheme)
    return `${url.protocol}//${url.host}`
  } catch {
    return null
  }
}

function isProductionUrl(url: string): boolean {
  try {
    return PRODUCTION_HOSTS.has(new URL(url).hostname)
  } catch {
    return false
  }
}

/**
 * URL publique de l'environnement courant, pour toutes les URL de retour
 * (checkout, portail client, callbacks OAuth, liens des e-mails).
 *
 * Production : NEXT_PUBLIC_URL, sinon le domaine de production.
 * Preview : NEXT_PUBLIC_URL si elle ne vise pas la production, sinon l'URL de
 *   branche puis l'URL du déploiement fournies par Vercel. Jamais xenotif.com.
 * Development : NEXT_PUBLIC_URL, sinon localhost.
 */
export function getPublicBaseUrl(env: Env = process.env): string {
  const deployment = getDeploymentEnv(env)
  const configured = normalizeUrl(env.NEXT_PUBLIC_URL)

  if (deployment === 'production') return configured ?? PRODUCTION_ORIGIN

  if (deployment === 'preview') {
    const candidates = [
      configured,
      normalizeUrl(env.VERCEL_BRANCH_URL ?? env.NEXT_PUBLIC_VERCEL_BRANCH_URL),
      normalizeUrl(env.VERCEL_URL ?? env.NEXT_PUBLIC_VERCEL_URL),
    ]
    for (const candidate of candidates) {
      if (candidate && !isProductionUrl(candidate)) return candidate
    }
    throw new EnvironmentGuardError(
      'URL publique introuvable en preview : ni NEXT_PUBLIC_URL (hors production), ni VERCEL_BRANCH_URL, ni VERCEL_URL.',
    )
  }

  return configured ?? 'http://localhost:3000'
}

// -------------------------------------------------------------- Supabase

/** Référence de projet extraite d'une URL Supabase (`https://<ref>.supabase.co`). */
export function supabaseProjectRef(url: string | undefined | null): string | null {
  if (!url) return null
  try {
    const match = /^([a-z0-9]+)\.supabase\./i.exec(new URL(url).hostname)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/** Référence portée par une clé Supabase historique (JWT `anon`/`service_role`). */
export function supabaseKeyRef(key: string | undefined | null): string | null {
  const payload = key?.split('.')[1]
  if (!key || key.split('.').length !== 3 || !payload) return null
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='))
    const claims = JSON.parse(json) as { ref?: unknown }
    return typeof claims.ref === 'string' ? claims.ref : null
  } catch {
    return null
  }
}

/**
 * Hors production : refuse le projet Supabase de PRODUCTION, et toute clé dont
 * la référence ne correspond pas à l'URL. En production : journalise seulement,
 * pour ne jamais couper le site sur une simple divergence de configuration.
 */
export function assertSupabaseEnvironment(
  config: { url?: string | null; keys?: (string | undefined | null)[] },
  env: Env = process.env,
): void {
  const deployment = getDeploymentEnv(env)
  const urlRef = supabaseProjectRef(config.url)
  const expected = env.EXPECTED_SUPABASE_PROJECT_REF?.trim()

  if (deployment === 'production') {
    if (urlRef && urlRef !== PRODUCTION_SUPABASE_REF) {
      console.warn(`[env-guard] Supabase : projet ${urlRef} inattendu en production.`)
    }
    return
  }

  if (urlRef === PRODUCTION_SUPABASE_REF) {
    throw new EnvironmentGuardError(
      `Supabase : projet de PRODUCTION (${PRODUCTION_SUPABASE_REF}) refusé en environnement ${deployment}.`,
    )
  }
  if (expected && urlRef && urlRef !== expected) {
    throw new EnvironmentGuardError(`Supabase : projet ${urlRef} différent du projet attendu ${expected}.`)
  }
  for (const key of config.keys ?? []) {
    const keyRef = supabaseKeyRef(key)
    if (keyRef && keyRef === PRODUCTION_SUPABASE_REF) {
      throw new EnvironmentGuardError(
        `Supabase : clé du projet de PRODUCTION refusée en environnement ${deployment}.`,
      )
    }
    if (keyRef && urlRef && keyRef !== urlRef) {
      throw new EnvironmentGuardError(
        `Supabase : clé du projet ${keyRef} incohérente avec l'URL du projet ${urlRef}.`,
      )
    }
  }
}

// ------------------------------------------------------------------ GA4

/**
 * Identifiant GA4 à utiliser, ou `null` si l'analytics doit rester désactivée.
 * Hors production, aucune donnée ne part vers la propriété de production tant
 * que NEXT_PUBLIC_GA4_MEASUREMENT_ID n'est pas explicitement défini.
 */
export function getGa4MeasurementId(env: Env = process.env): string | null {
  const configured = env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim()
  if (configured) return configured
  return getDeploymentEnv(env) === 'production' ? PRODUCTION_GA4_MEASUREMENT_ID : null
}
