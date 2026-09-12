/**
 * Garde d'environnement au moment du build (branchée sur `prebuild`).
 *
 * Elle double la garde applicative de src/lib/env/deployment.ts : un build de
 * preview qui recevrait une clé Stripe LIVE ou le projet Supabase de production
 * échoue ici, avant même d'être déployé.
 *
 * Aucune valeur de secret n'est affichée : seuls le mode (live/test) et la
 * référence de projet Supabase, qui n'est pas un secret, apparaissent.
 */
const PRODUCTION_SUPABASE_REF = 'pciadjwuxuevkqkdarut'

const deployment = ['production', 'preview', 'development'].includes(process.env.VERCEL_ENV)
  ? process.env.VERCEL_ENV
  : 'development'

const stripeKey = process.env.STRIPE_SECRET_KEY
const stripeMode = !stripeKey
  ? 'absente'
  : /^(sk|rk)_live/.test(stripeKey)
    ? 'live'
    : /^(sk|rk)_test/.test(stripeKey)
      ? 'test'
      : 'préfixe inconnu'

let supabaseRef = null
try {
  const host = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname
  const match = /^([a-z0-9]+)\.supabase\./i.exec(host)
  supabaseRef = match ? match[1] : null
} catch {
  supabaseRef = null
}

const errors = []
const warnings = []

if (deployment !== 'production' && (stripeMode === 'live' || stripeMode === 'préfixe inconnu')) {
  errors.push(`clé Stripe ${stripeMode} refusée en environnement ${deployment} (clé de test attendue)`)
}
if (deployment === 'production' && stripeMode === 'préfixe inconnu') {
  errors.push('clé Stripe au préfixe inconnu en production')
}
if (deployment === 'preview' && supabaseRef === PRODUCTION_SUPABASE_REF) {
  errors.push(`projet Supabase de production (${PRODUCTION_SUPABASE_REF}) refusé en preview`)
}
if (deployment === 'development' && supabaseRef === PRODUCTION_SUPABASE_REF) {
  warnings.push(`projet Supabase de production (${PRODUCTION_SUPABASE_REF}) utilisé en local`)
}
if (deployment === 'production' && supabaseRef && supabaseRef !== PRODUCTION_SUPABASE_REF) {
  warnings.push(`projet Supabase ${supabaseRef} inattendu en production`)
}

console.log(
  `[check-environment] VERCEL_ENV=${process.env.VERCEL_ENV ?? 'absent'} → ${deployment} ; ` +
    `Stripe=${stripeMode} ; Supabase=${supabaseRef ?? 'non configuré'}`,
)
for (const warning of warnings) console.warn(`[check-environment] avertissement : ${warning}`)

if (errors.length > 0) {
  for (const error of errors) console.error(`[check-environment] ERREUR : ${error}`)
  process.exit(1)
}
