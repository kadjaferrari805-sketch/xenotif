import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// ⚠️ DIAGNOSTIC PONCTUEL — protégé par jeton, à RETIRER. Lecture seule.
const TOKEN = 'xeno-repair-k7Q2mZ9p'

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('token') !== TOKEN) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const service = await createServiceClient()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  // Tous les comptes
  const { data: list } = await service.auth.admin.listUsers({ perPage: 200 })
  const accounts = (list?.users ?? []).map(u => ({ id: u.id, email: u.email, created: (u.created_at || '').slice(0, 16) }))

  // Toutes les lignes subscriptions
  const { data: rows } = await service.from('subscriptions')
    .select('user_id, stripe_customer_id, stripe_subscription_id, status, plan, cancel_at_period_end')

  // Abonnements Stripe récents (live)
  const subs = await stripe.subscriptions.list({ status: 'all', limit: 15 })
  const stripeSubs: Array<{ id: string; status: string; email: string | null; customer: string }> = []
  for (const s of subs.data) {
    let email: string | null = null
    try { const c = await stripe.customers.retrieve(s.customer as string); email = (c as Stripe.Customer).email ?? null } catch {}
    stripeSubs.push({ id: s.id, status: s.status, email, customer: s.customer as string })
  }

  return NextResponse.json({ accounts, subscriptionRows: rows ?? [], stripeSubscriptions: stripeSubs })
}
