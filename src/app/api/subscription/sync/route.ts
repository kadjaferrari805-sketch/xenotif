import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { isClaimableBy, linkSubscriptionToUser, LIVE_STATUSES, toDbStatus } from '@/lib/billing/stripe-subscription'

export const runtime = 'nodejs'

// Filet de sécurité : resynchronise l'abonnement Stripe de l'utilisateur connecté,
// si le webhook ne l'a pas rattaché au compte.
//
// La recherche se fait UNIQUEMENT par l'email du compte. Elle acceptait avant un
// email saisi librement : n'importe quel compte pouvait alors récupérer un abonnement
// payé par quelqu'un d'autre, tant qu'il n'était rattaché à personne. Un paiement
// fait avec une autre adresse passe désormais par le support.
export async function POST() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ error: 'config' }, { status: 500 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    if (!user.email) return NextResponse.json({ error: 'no_email' }, { status: 400 })

    const stripe = new Stripe(secretKey)

    const customers = await stripe.customers.list({ email: user.email, limit: 10 })
    let found: Stripe.Subscription | null = null
    for (const c of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 })
      const candidate = subs.data.find(s => LIVE_STATUSES.has(s.status) && isClaimableBy(s, user.id))
      if (candidate) { found = candidate; break }
    }

    if (!found) return NextResponse.json({ synced: false, reason: 'no_subscription' })

    const service = await createServiceClient()
    const outcome = await linkSubscriptionToUser(service, user.id, found)
    if (outcome === 'already_linked') return NextResponse.json({ synced: false, reason: 'already_linked' })
    if (outcome === 'user_has_other_subscription') return NextResponse.json({ synced: false, reason: 'other_subscription' })

    return NextResponse.json({ synced: true, plan: 'pro', status: toDbStatus(found.status) })
  } catch (err) {
    console.error('subscription sync error:', err)
    return NextResponse.json({ error: 'sync_failed' }, { status: 500 })
  }
}
