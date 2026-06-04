import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

// ⚠️ OUTIL PONCTUEL — protégé par jeton, à RETIRER après usage.
// Diagnostique et configure le(s) webhook(s) Stripe via l'API.
const TOKEN = 'xeno-repair-k7Q2mZ9p'
const URL = 'https://xenotif.com/api/webhook/stripe'
const EVENTS: Stripe.WebhookEndpointUpdateParams.EnabledEvent[] = [
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_failed',
]

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  if (p.get('token') !== TOKEN) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const action = p.get('action')

  if (action === 'fix') {
    const id = p.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const ep = await stripe.webhookEndpoints.update(id, {
      url: URL,
      enabled_events: EVENTS as Stripe.WebhookEndpointUpdateParams.EnabledEvent[],
      disabled: false,
    })
    return NextResponse.json({ updated: ep.id, url: ep.url, status: ep.status, events: ep.enabled_events })
  }

  if (action === 'create') {
    const ep = await stripe.webhookEndpoints.create({
      url: URL,
      enabled_events: EVENTS as Stripe.WebhookEndpointCreateParams.EnabledEvent[],
    })
    // secret renvoyé une seule fois — à mettre dans STRIPE_WEBHOOK_SECRET (Vercel)
    return NextResponse.json({ created: ep.id, url: ep.url, secret: ep.secret, events: ep.enabled_events })
  }

  // list (diagnostic)
  const list = await stripe.webhookEndpoints.list({ limit: 20 })
  return NextResponse.json({
    endpoints: list.data.map(e => ({ id: e.id, url: e.url, status: e.status, events: e.enabled_events })),
  })
}
