import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

function subPeriodEnd(sub: Stripe.Subscription): string {
  return new Date((sub.items.data[0]?.current_period_end ?? 0) * 1000).toISOString()
}

// Filet de sécurité : resynchronise l'abonnement Stripe de l'utilisateur connecté.
// Utile si le webhook n'a pas rattaché l'abonnement au compte (ex. email différent).
// Cherche le client Stripe par l'email du compte et recrée l'entrée `subscriptions`.
export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ error: 'config' }, { status: 500 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    // Email à rechercher : celui saisi (= email de paiement, peut différer du compte),
    // sinon l'email du compte.
    let searchEmail = user.email ?? ''
    try {
      const body = await req.json()
      if (body?.email && typeof body.email === 'string') searchEmail = body.email.trim().toLowerCase()
    } catch { /* pas de body : on garde l'email du compte */ }
    if (!searchEmail) return NextResponse.json({ error: 'no_email' }, { status: 400 })

    const stripe = new Stripe(secretKey)

    // Cherche le(s) client(s) Stripe correspondant à l'email fourni.
    const customers = await stripe.customers.list({ email: searchEmail, limit: 10 })
    let found: Stripe.Subscription | null = null
    for (const c of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 })
      const active = subs.data.find(s => ['active', 'trialing', 'past_due'].includes(s.status))
      if (active) { found = active; break }
    }

    if (!found) return NextResponse.json({ synced: false, reason: 'no_subscription' })

    const plan = found.metadata?.plan
      ?? ((found.items.data[0]?.price?.unit_amount ?? 0) > 1000 ? 'elite' : 'pro')

    const service = await createServiceClient()

    // Sécurité : ne pas voler un abonnement déjà rattaché à un AUTRE compte.
    const { data: already } = await service
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', found.id)
      .maybeSingle()
    if (already && already.user_id !== user.id) {
      return NextResponse.json({ synced: false, reason: 'already_linked' })
    }

    await service.from('subscriptions').upsert({
      user_id: user.id,
      stripe_customer_id: typeof found.customer === 'string' ? found.customer : found.customer.id,
      stripe_subscription_id: found.id,
      plan,
      status: found.status,
      trial_end: found.trial_end ? new Date(found.trial_end * 1000).toISOString() : null,
      current_period_end: subPeriodEnd(found),
      cancel_at_period_end: found.cancel_at_period_end,
    }, { onConflict: 'user_id' })

    return NextResponse.json({ synced: true, plan, status: found.status })
  } catch (err) {
    console.error('subscription sync error:', err)
    return NextResponse.json({ error: 'sync_failed' }, { status: 500 })
  }
}
