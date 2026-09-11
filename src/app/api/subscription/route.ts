import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { isInAppTrial, appTrialEnd } from '@/lib/access'
import { isClaimableBy, linkSubscriptionToUser, subscriptionRow } from '@/lib/billing/stripe-subscription'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    // Visiteur anonyme = simplement « pas d'abonnement » (200 null), pas une erreur.
    // Évite une erreur console 401 sur les pages publiques (gating disciplines/vidéos)
    // qui interrogent ce statut. Les consommateurs traitent déjà null = non-abonné.
    if (!user) return NextResponse.json(null)

    // Lecture en service-role : la table `subscriptions` est protégée par RLS et
    // n'est pas lisible par le client authentifié. On filtre par user.id (sûr).
    const service = await createServiceClient()
    const { data: sub } = await service
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (sub) return NextResponse.json(sub)

    // Essai gratuit 7 jours (sans carte) : compte sans abonnement créé il y a < 7 jours
    // → statut « trialing » synthétique pour que le gating client (disciplines/vidéos)
    // débloque l'accès PRO, en cohérence avec deriveAccess côté serveur.
    const createdAt = user.created_at ? new Date(user.created_at) : null
    if (isInAppTrial(createdAt)) {
      return NextResponse.json({
        plan: 'pro',
        status: 'trialing',
        trial_end: appTrialEnd(createdAt)!.toISOString(),
        current_period_end: null,
        cancel_at_period_end: false,
      })
    }

    // Pas en base : recherche Stripe par l'email du compte, puis rattachement.
    // Sans email, `customers.list` sans filtre renverrait le client de quelqu'un d'autre.
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey || !user.email) return NextResponse.json(null)

    const stripe = new Stripe(secretKey)
    const customers = await stripe.customers.list({ email: user.email, limit: 1 })
    const customer = customers.data[0]
    if (!customer) return NextResponse.json(null)

    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1,
      status: 'all',
    })
    const stripeSub = subs.data[0]
    // Un abonnement créé pour un autre compte n'est jamais rattaché ici.
    if (!stripeSub || !isClaimableBy(stripeSub, user.id)) return NextResponse.json(null)

    const outcome = await linkSubscriptionToUser(service, user.id, stripeSub)
    if (outcome !== 'linked') return NextResponse.json(null)

    return NextResponse.json(subscriptionRow(stripeSub, user.id))
  } catch (err) {
    console.error('GET /api/subscription error:', err)
    return NextResponse.json(null)
  }
}
