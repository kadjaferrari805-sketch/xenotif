import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Renvoie la carte par défaut + l'historique des factures de l'utilisateur connecté,
// pour les afficher DANS le site (pas via le portail Stripe externe).
export async function GET() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) return NextResponse.json({ card: null, invoices: [] })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    // stripe_customer_id en service-role (table protégée par RLS), filtré par user.id.
    const service = await createServiceClient()
    const { data: sub } = await service
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!sub?.stripe_customer_id) return NextResponse.json({ card: null, invoices: [] })

    const stripe = new Stripe(secretKey)
    const customerId = sub.stripe_customer_id

    // Carte par défaut (ou première carte attachée)
    let card: { brand: string; last4: string; exp_month: number; exp_year: number } | null = null
    try {
      const pms = await stripe.paymentMethods.list({ customer: customerId, type: 'card', limit: 1 })
      const c = pms.data[0]?.card
      if (c) card = { brand: c.brand, last4: c.last4, exp_month: c.exp_month, exp_year: c.exp_year }
    } catch { /* pas de carte */ }

    // Factures
    const inv = await stripe.invoices.list({ customer: customerId, limit: 12 })
    const invoices = inv.data.map(i => ({
      id: i.id,
      number: i.number ?? null,
      date: new Date((i.created ?? 0) * 1000).toISOString(),
      amount: (i.amount_paid || i.amount_due || 0) / 100,
      currency: (i.currency ?? 'eur').toUpperCase(),
      status: i.status,
      pdf: i.invoice_pdf ?? i.hosted_invoice_url ?? null,
    }))

    return NextResponse.json({ card, invoices })
  } catch (err) {
    console.error('GET /api/subscription/billing error:', err)
    return NextResponse.json({ card: null, invoices: [] })
  }
}
