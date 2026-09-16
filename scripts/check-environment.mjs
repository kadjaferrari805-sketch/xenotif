/**
 * Garde d'environnement au moment du build (branchée sur `prebuild`).
 *
 * Elle double la garde applicative de src/lib/env/deployment.ts : un build de
 * preview qui recevrait une clé Stripe LIVE ou le projet Supabase de production
 * échoue ici, avant même d'être déployé.
 *
 * Depuis 05-K.3.7-bis, elle vérifie AUSSI les default privileges du schéma
 * public (voir plus bas).
 *
 * Aucune valeur de secret n'est affichée : seuls le mode (live/test) et la
 * référence de projet Supabase, qui n'est pas un secret, apparaissent.
 */
import { createClient } from '@supabase/supabase-js'

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

/**
 * GARDE DES DEFAULT PRIVILEGES — 05-K.3.7-bis.
 *
 * POURQUOI. K.3.4 a retiré à `anon` et `authenticated` les privilèges accordés
 * par défaut aux objets FUTURS du schéma public. K.3.5 a confirmé un chemin de
 * régression : XenotifFitness/packages/db/src/schema.sql ligne 2 contient un
 * `alter default privileges in schema public grant all on tables to postgres,
 * anon, authenticated, service_role` exécutable, que DEPLOYMENT.md prescrit
 * toujours d'appliquer. Une réexécution rétablirait le comportement dangereux
 * SANS AUCUN SIGNAL — et la première table créée ensuite naîtrait avec
 * TRUNCATE pour anon, le seul privilège que RLS ne filtre pas.
 *
 * Cette garde rend cette régression BRUYANTE : le build échoue.
 *
 * CE QU'ELLE INSPECTE. `pg_default_acl`, via la RPC read-only
 * `public.security_default_acl_report()` — et surtout PAS les ACL des tables
 * existantes. Les default privileges ne sont pas rétroactifs : une régression
 * ne se voit QUE dans pg_default_acl, jamais dans pg_class.relacl.
 *
 * PÉRIMÈTRE. Créateur `postgres`, schéma `public`, bénéficiaires `anon` et
 * `authenticated` uniquement. `postgres` et `service_role` sont légitimes.
 * `supabase_admin` est volontairement exclu : ses defaults sont hors d'atteinte
 * de `postgres` et hors politique K.3.4.
 *
 * DÉTECTION SEULE. Rien n'est corrigé automatiquement.
 *
 * DÉGRADATION. La disponibilité de SUPABASE_SERVICE_ROLE_KEY pendant le build
 * Vercel n'est pas garantie et n'a pas pu être vérifiée. Une clé absente ou une
 * RPC injoignable produisent donc un AVERTISSEMENT, jamais un échec : faire
 * échouer tous les déploiements sur une variable manquante serait pire que le
 * risque couvert. Seule une ACL réellement dangereuse fait échouer le build.
 */
const DANGEROUS_GRANTEES = ['anon', 'authenticated']

async function checkDefaultPrivileges() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    warnings.push(
      'default privileges non vérifiés : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY absente du build',
    )
    return
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await supabase.rpc('security_default_acl_report')

  if (error) {
    warnings.push(`default privileges non vérifiés : ${error.message}`)
    return
  }

  const dangerous = (data ?? []).filter((row) => DANGEROUS_GRANTEES.includes(row.grantee))

  if (dangerous.length === 0) {
    console.log('[check-environment] default privileges : aucun privilège dangereux (anon/authenticated)')
    return
  }

  console.error('[environment-guard] DANGEROUS DEFAULT PRIVILEGES DETECTED')
  for (const row of dangerous) {
    console.error(
      `[environment-guard]   owner=${row.owner_role} schema=${row.schema_name} ` +
        `object_type=${row.object_type} grantee=${row.grantee} privilege=${row.privilege}`,
    )
  }
  errors.push(
    `${dangerous.length} default privilege(s) accordé(s) à anon/authenticated sur public ` +
      '(cf. 05-K.3.4 / K.3.5 : réexécution probable de packages/db/src/schema.sql)',
  )
}

await checkDefaultPrivileges()

for (const warning of warnings) console.warn(`[check-environment] avertissement : ${warning}`)

if (errors.length > 0) {
  for (const error of errors) console.error(`[check-environment] ERREUR : ${error}`)
  process.exit(1)
}
