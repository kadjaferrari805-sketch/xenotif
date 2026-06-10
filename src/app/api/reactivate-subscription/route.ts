import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// Réactivation d'un abonnement résilié AVANT la fin de période (cancel_at_period_end).
// Remet la facturation automatique : on annule la résiliation programmée côté Stripe.
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    // Lecture/écriture en service-role (table protégée par RLS), filtré par user.id.
    const service = await createServiceClient()
    const { data: sub } = await service
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!sub?.stripe_subscription_id) {
      return NextResponse.json({ error: 'Aucun abonnement à réactiver.' }, { status: 404 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    // Vérifie que l'abonnement Stripe est encore récupérable (pas définitivement terminé).
    const remote = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)
    if (remote.status === 'canceled' || remote.status === 'incomplete_expired') {
      // Plus rien à réactiver : il faut reprendre un nouvel abonnement.
      return NextResponse.json({ error: 'ended', resubscribe: true }, { status: 409 })
    }

    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: false,
    })

    await service
      .from('subscriptions')
      .update({ cancel_at_period_end: false })
      .eq('user_id', user.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Reactivate subscription error:', err)
    return NextResponse.json({ error: 'Erreur lors de la réactivation.' }, { status: 500 })
  }
}
