import type Stripe from 'stripe'
import type { SupabaseClient } from '@supabase/supabase-js'

// Rattachement d'un abonnement Stripe à un compte. Point de passage unique pour
// le webhook, la page /success, GET /api/subscription et /api/subscription/sync :
// chacun avait sa copie, avec des règles qui divergeaient.

export type DbSubscriptionStatus = 'trialing' | 'active' | 'canceled' | 'past_due' | 'incomplete'

// Statuts qui donnent (ou vont redonner) l'accès : un abonnement dans l'un de ces
// états ne doit jamais être écrasé par un autre.
export const LIVE_STATUSES: ReadonlySet<string> = new Set(['trialing', 'active', 'past_due'])

// La contrainte `subscriptions_status_check` n'accepte que 5 statuts. Stripe en a
// davantage : écrits tels quels, `unpaid` ou `paused` faisaient échouer l'écriture.
export function toDbStatus(status: Stripe.Subscription.Status): DbSubscriptionStatus {
  switch (status) {
    case 'trialing':
    case 'active':
    case 'canceled':
    case 'past_due':
    case 'incomplete':
      return status
    case 'unpaid':
      return 'past_due'
    default:
      // incomplete_expired, paused : plus d'accès.
      return 'canceled'
  }
}

export function subscriptionRow(sub: Stripe.Subscription, userId: string) {
  return {
    user_id: userId,
    stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
    stripe_subscription_id: sub.id,
    plan: 'pro' as const, // palier unique
    status: toDbStatus(sub.status),
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    current_period_end: new Date((sub.items.data[0]?.current_period_end ?? 0) * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
  }
}

// Un abonnement trouvé à partir de l'e-mail du compte n'est rattachable que s'il
// n'a pas été créé pour un AUTRE compte (metadata.user_id posé au checkout).
export function isClaimableBy(sub: Stripe.Subscription, userId: string): boolean {
  const owner = sub.metadata?.user_id ?? ''
  return owner === '' || owner === userId
}

const USERS_PAGE_SIZE = 1000
const MAX_USERS_PAGES = 100

// Recherche d'un compte par e-mail sur TOUTES les pages. L'ancien
// `listUsers({ perPage: 200 })` ne voyait que les 200 premiers comptes : au-delà,
// un client existant n'était plus retrouvé et son abonnement jamais rattaché.
export async function findUserIdByEmail(service: SupabaseClient, email: string): Promise<string | null> {
  const target = email.trim().toLowerCase()
  if (!target) return null

  for (let page = 1; page <= MAX_USERS_PAGES; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: USERS_PAGE_SIZE })
    if (error) throw error
    const users = data?.users ?? []
    const match = users.find(u => u.email?.toLowerCase() === target)
    if (match) return match.id
    if (users.length < USERS_PAGE_SIZE) return null
  }
  throw new Error('findUserIdByEmail : nombre de pages maximal atteint')
}

export type LinkOutcome = 'linked' | 'already_linked' | 'user_has_other_subscription'

const STRIPE_ID = /^[A-Za-z0-9_]+$/

// Écrit la ligne `subscriptions` du compte, sauf si :
//  - l'abonnement (ou le client Stripe) est déjà rattaché à un autre compte ;
//  - le compte porte déjà un AUTRE abonnement encore actif (on ne l'écrase pas).
// Lève une erreur si la base échoue, pour que l'appelant puisse réessayer.
export async function linkSubscriptionToUser(
  service: SupabaseClient,
  userId: string,
  sub: Stripe.Subscription,
): Promise<LinkOutcome> {
  const row = subscriptionRow(sub, userId)
  // Les identifiants entrent dans un filtre PostgREST : on refuse tout caractère inattendu.
  if (!STRIPE_ID.test(row.stripe_subscription_id) || !STRIPE_ID.test(row.stripe_customer_id)) {
    throw new Error('Identifiants Stripe inattendus')
  }

  const { data: existing, error } = await service
    .from('subscriptions')
    .select('user_id, stripe_subscription_id, status')
    .or(`user_id.eq.${userId},stripe_subscription_id.eq.${row.stripe_subscription_id},stripe_customer_id.eq.${row.stripe_customer_id}`)
  if (error) throw error

  const rows = (existing ?? []) as { user_id: string; stripe_subscription_id: string | null; status: string }[]
  if (rows.some(r => r.user_id !== userId)) return 'already_linked'

  const own = rows.find(r => r.user_id === userId)
  if (own && own.stripe_subscription_id !== row.stripe_subscription_id && LIVE_STATUSES.has(own.status)) {
    // Autre abonnement Stripe encore actif : on ne l'écrase pas.
    if (own.stripe_subscription_id) return 'user_has_other_subscription'
    // Accès actif sans Stripe (App Store via RevenueCat, attribution manuelle) :
    // seul un abonnement Stripe lui-même actif peut le remplacer. Un abonnement
    // Stripe terminé retrouvé par synchronisation ne retire jamais cet accès.
    if (!LIVE_STATUSES.has(row.status)) return 'user_has_other_subscription'
  }

  const { error: upsertError } = await service.from('subscriptions').upsert(row, { onConflict: 'user_id' })
  if (upsertError) throw upsertError
  return 'linked'
}
