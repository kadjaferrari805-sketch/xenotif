import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    // Try Supabase first
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (sub) return NextResponse.json(sub)

    // Not in DB — fetch from Stripe by email and sync
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json(null)

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
    if (!stripeSub) return NextResponse.json(null)

    const plan = stripeSub.metadata?.plan
      ?? ((stripeSub.items.data[0]?.price?.unit_amount ?? 0) > 1000 ? 'elite' : 'pro')

    const row = {
      user_id: user.id,
      stripe_customer_id: customer.id,
      stripe_subscription_id: stripeSub.id,
      plan,
      status: stripeSub.status,
      trial_end: stripeSub.trial_end ? new Date(stripeSub.trial_end * 1000).toISOString() : null,
      current_period_end: new Date((stripeSub.items.data[0]?.current_period_end ?? 0) * 1000).toISOString(),
      cancel_at_period_end: stripeSub.cancel_at_period_end,
    }

    // Sync to Supabase so next load is instant
    const service = await createServiceClient()
    await service.from('subscriptions').upsert(row, { onConflict: 'user_id' })

    return NextResponse.json(row)
  } catch (err) {
    console.error('GET /api/subscription error:', err)
    return NextResponse.json(null)
  }
}
