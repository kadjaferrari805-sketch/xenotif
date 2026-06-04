import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// ⚠️ OUTIL PONCTUEL — protégé par jeton, à RETIRER. Diagnostic + rattachement.
const TOKEN = 'xeno-repair-k7Q2mZ9p'

function periodEnd(sub: Stripe.Subscription): string {
  return new Date((sub.items.data[0]?.current_period_end ?? 0) * 1000).toISOString()
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  if (p.get('token') !== TOKEN) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const service = await createServiceClient()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  // ── Action: rattacher un abonnement (par email paiement) à un compte (par email) ──
  if (p.get('action') === 'link') {
    const account = (p.get('account') ?? '').trim().toLowerCase()
    const payment = (p.get('payment') ?? account).trim().toLowerCase()
    const customers = await stripe.customers.list({ email: payment, limit: 10 })
    let found: Stripe.Subscription | null = null
    for (const c of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 })
      const pick = subs.data.find(s => ['active', 'trialing', 'past_due'].includes(s.status))
      if (pick) { found = pick; break }
    }
    const { data: list } = await service.auth.admin.listUsers({ perPage: 200 })
    const user = list?.users?.find(u => u.email?.toLowerCase() === account)
    if (!found || !user) return NextResponse.json({ ok: false, foundSub: !!found, userFound: !!user })
    const plan = found.metadata?.plan ?? ((found.items.data[0]?.price?.unit_amount ?? 0) > 1000 ? 'elite' : 'pro')
    const { error } = await service.from('subscriptions').upsert({
      user_id: user.id,
      stripe_customer_id: typeof found.customer === 'string' ? found.customer : found.customer.id,
      stripe_subscription_id: found.id,
      plan, status: found.status,
      trial_end: found.trial_end ? new Date(found.trial_end * 1000).toISOString() : null,
      current_period_end: periodEnd(found),
      cancel_at_period_end: found.cancel_at_period_end,
    }, { onConflict: 'user_id' })
    return NextResponse.json({ ok: !error, upsertError: error?.message ?? null, sub: found.id, status: found.status, account, userId: user.id })
  }

  // ── Diagnostic (lecture seule) ──
  const { data: list } = await service.auth.admin.listUsers({ perPage: 200 })
  const accounts = (list?.users ?? []).map(u => ({ id: u.id, email: u.email }))
  const { data: rows } = await service.from('subscriptions').select('user_id, stripe_customer_id, stripe_subscription_id, status, plan')
  return NextResponse.json({ accounts, subscriptionRows: rows ?? [] })
}
