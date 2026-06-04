import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// ⚠️ OUTIL PONCTUEL — protégé par jeton, à RETIRER après usage.
// Annule (en fin de période) l'abonnement actif d'un email de paiement + met à
// jour la table subscriptions.
const TOKEN = 'xeno-repair-k7Q2mZ9p'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  if (p.get('token') !== TOKEN) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const payment = (p.get('payment') ?? '').trim().toLowerCase()
  if (!payment) return NextResponse.json({ error: 'payment required' }, { status: 400 })

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'no_stripe_key' }, { status: 500 })
  const stripe = new Stripe(secretKey)

  const customers = await stripe.customers.list({ email: payment, limit: 10 })
  let target: Stripe.Subscription | null = null
  for (const c of customers.data) {
    const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 })
    const active = subs.data.find(s => ['active', 'trialing', 'past_due'].includes(s.status))
    if (active) { target = active; break }
  }

  if (!target) return NextResponse.json({ cancelled: false, reason: 'no_active_subscription' })

  const updated = await stripe.subscriptions.update(target.id, { cancel_at_period_end: true })

  const service = await createServiceClient()
  await service.from('subscriptions')
    .update({ cancel_at_period_end: true, status: updated.status })
    .eq('stripe_subscription_id', target.id)

  return NextResponse.json({
    cancelled: true,
    subscription: target.id,
    status: updated.status,
    cancel_at_period_end: updated.cancel_at_period_end,
    current_period_end: new Date((updated.items.data[0]?.current_period_end ?? 0) * 1000).toISOString(),
  })
}
