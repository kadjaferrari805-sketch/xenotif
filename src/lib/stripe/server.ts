import Stripe from 'stripe'
import { EnvironmentGuardError, getStripeSecretKey } from '@/lib/env/deployment'

// Point de passage unique vers Stripe côté serveur. Chaque route construisait
// son client avec `new Stripe(process.env.STRIPE_SECRET_KEY!)` : rien
// n'empêchait une clé LIVE d'être utilisée depuis une preview. La garde est
// appliquée ici, donc pour toutes les routes à la fois.

/** Client Stripe, ou `null` si aucune clé n'est configurée (comportement des routes inchangé). */
export function createStripeClientOrNull(): Stripe | null {
  const key = getStripeSecretKey()
  return key ? new Stripe(key) : null
}

/** Client Stripe. Lève si la clé est absente ou interdite dans cet environnement. */
export function createStripeClient(): Stripe {
  const client = createStripeClientOrNull()
  if (!client) throw new EnvironmentGuardError('STRIPE_SECRET_KEY absente.')
  return client
}
