import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient, createServiceClient } from '@/lib/supabase/server'

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
      return NextResponse.json({ error: 'Aucun abonnement actif.' }, { status: 404 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    await service
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('user_id', user.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Cancel subscription error:', err)
    return NextResponse.json({ error: 'Erreur lors de la résiliation.' }, { status: 500 })
  }
}
