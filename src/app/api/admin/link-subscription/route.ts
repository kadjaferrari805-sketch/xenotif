import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// ⚠️ OUTIL DE RÉPARATION PONCTUEL — protégé par un jeton, à RETIRER après usage.
// - action par défaut : relie un abonnement Stripe (par email de paiement) au
//   compte Supabase (par email de connexion) + diagnostic.
// - action=cancel : annule immédiatement les abonnements Stripe listés (subs=...).
const TOKEN = 'xeno-repair-k7Q2mZ9p'

function subPeriodEnd(sub: Stripe.Subscription): string {
  return new Date((sub.items.data[0]?.current_period_end ?? 0) * 1000).toISOString()
}

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  if (p.get('token') !== TOKEN) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'no_stripe_key' }, { status: 500 })
  const stripe = new Stripe(secretKey)

  // ── Mode annulation ──
  if (p.get('action') === 'cancel') {
    const ids = (p.get('subs') ?? '').split(',').map(s => s.trim()).filter(Boolean)
    const results: Array<{ id: string; status?: string; error?: string }> = []
    for (const sid of ids) {
      try {
        const c = await stripe.subscriptions.cancel(sid)
        results.push({ id: sid, status: c.status })
      } catch (e) {
        results.push({ id: sid, error: e instanceof Error ? e.message : 'error' })
      }
    }
    return NextResponse.json({ action: 'cancel', results })
  }

  // ── Mode rattachement (par défaut) ──
  const account = (p.get('account') ?? '').trim().toLowerCase()
  const payment = (p.get('payment') ?? account).trim().toLowerCase()
  if (!account) return NextResponse.json({ error: 'account required' }, { status: 400 })

  const service = await createServiceClient()
  const customersDiag: Array<{ id: string; email: string | null; subs: Array<{ id: string; status: string }> }> = []
  let found: Stripe.Subscription | null = null

  const customers = await stripe.customers.list({ email: payment, limit: 10 })
  for (const c of customers.data) {
    const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 })
    customersDiag.push({ id: c.id, email: c.email ?? null, subs: subs.data.map(s => ({ id: s.id, status: s.status })) })
    const pick = subs.data.find(s => ['active', 'trialing', 'past_due'].includes(s.status)) ?? subs.data[0] ?? null
    if (pick && !found) found = pick
  }

  const { data: list } = await service.auth.admin.listUsers({ perPage: 200 })
  const user = list?.users?.find(u => u.email?.toLowerCase() === account)

  let linked = false
  let subscription: { id: string; status: string; plan: string } | null = null
  if (found && user) {
    const plan = found.metadata?.plan
      ?? ((found.items.data[0]?.price?.unit_amount ?? 0) > 1000 ? 'elite' : 'pro')
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
    linked = true
    subscription = { id: found.id, status: found.status, plan }
  }

  return NextResponse.json({
    account, payment,
    customersFound: customersDiag.length,
    customers: customersDiag,
    userFound: !!user,
    userId: user?.id ?? null,
    linked, subscription,
  })
}
