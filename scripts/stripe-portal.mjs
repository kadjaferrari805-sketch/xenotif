/**
 * Provisioning administratif du portail client Stripe — hors build.
 *
 *   npm run stripe:portal                    simulation (lecture seule), cible TEST
 *   npm run stripe:portal -- --live          simulation sur le portail LIVE
 *   npm run stripe:portal -- --live --apply  applique sur le portail LIVE
 *
 * Règles :
 *   - la cible (test ou live) est TOUJOURS explicite : `--live` la bascule ;
 *   - une clé LIVE sans `--live` est refusée, et inversement ;
 *   - rien n'est modifié sans `--apply` ;
 *   - la configuration visée est celle marquée par défaut (`is_default`) ;
 *   - aucune erreur n'est avalée : code de sortie non nul ;
 *   - aucun secret n'est affiché (seul le mode de la clé l'est).
 */
import { assertKeyAllowed, buildTargetConfiguration, runPortal, stripeKeyMode } from './stripe-portal.lib.mjs'

const argv = process.argv.slice(2)
const apply = argv.includes('--apply')
const target = argv.includes('--live') ? 'live' : 'test'
const returnUrlArg = argv.find((a) => a.startsWith('--return-url='))?.split('=')[1]

const key = process.env.STRIPE_SECRET_KEY
const mode = stripeKeyMode(key)

console.log(`[stripe-portal] cible=${target} ; clé=${mode} ; mode=${apply ? 'APPLIQUER' : 'simulation'}`)

try {
  assertKeyAllowed(mode, target)
} catch (err) {
  console.error(`[stripe-portal] ERREUR : ${err.message}`)
  process.exit(2)
}

const Stripe = (await import('stripe')).default
const stripe = new Stripe(key)

try {
  const result = await runPortal({
    stripe,
    apply,
    target: buildTargetConfiguration({ returnUrl: returnUrlArg ?? process.env.STRIPE_PORTAL_RETURN_URL }),
  })

  if (result.status === 'aucune-configuration-par-defaut') {
    console.error(
      '[stripe-portal] ERREUR : aucune configuration de portail marquée par défaut. ' +
        'Créer la configuration dans le Dashboard Stripe, puis relancer.',
    )
    process.exit(3)
  }
  if (result.status === 'configuration-par-defaut-ambigue') {
    console.error('[stripe-portal] ERREUR : plusieurs configurations par défaut renvoyées. Aucun choix arbitraire.')
    process.exit(3)
  }
  if (result.status === 'simulation' && result.diff.length > 0) process.exit(0)
} catch (err) {
  console.error(`[stripe-portal] ERREUR Stripe : ${err.message}`)
  process.exit(1)
}
