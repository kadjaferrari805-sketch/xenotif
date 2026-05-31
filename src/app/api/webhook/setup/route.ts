import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const VERCEL_PROJECT_ID = 'prj_pL3t9KgP44lzourq5Vusk4FEOhi6'
const VERCEL_TEAM_ID    = 'team_UPv0ZcLiLb5ewMjzOMCQbkkN'
const WEBHOOK_URL       = 'https://xenotif.com/api/webhook/stripe'

const EVENTS = [
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_failed',
]

export async function POST(req: Request) {
  // Require internal setup secret to protect this endpoint
  const { secret } = await req.json().catch(() => ({}))
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const vercelToken = process.env.VERCEL_TOKEN
  if (!stripeKey) return NextResponse.json({ error: 'STRIPE_SECRET_KEY manquante' }, { status: 500 })

  const stripe = new Stripe(stripeKey)

  // Remove old webhooks pointing to this URL to avoid duplicates
  const existing = await stripe.webhookEndpoints.list({ limit: 20 })
  for (const wh of existing.data) {
    if (wh.url === WEBHOOK_URL) {
      await stripe.webhookEndpoints.del(wh.id)
    }
  }

  // Create fresh webhook
  const webhook = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: EVENTS as Stripe.WebhookEndpointCreateParams.EnabledEvent[],
    description: 'Xenotif® — auto-configured',
  })

  const signingSecret = webhook.secret ?? ''

  // Push STRIPE_WEBHOOK_SECRET to Vercel env if VERCEL_TOKEN is available
  if (vercelToken && signingSecret) {
    const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`

    // Check if env var already exists
    const listRes = await fetch(url, {
      headers: { Authorization: `Bearer ${vercelToken}` },
    })
    const listData = await listRes.json()
    const existing = listData.envs?.find((e: { key: string }) => e.key === 'STRIPE_WEBHOOK_SECRET')

    if (existing) {
      // Update
      await fetch(`https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env/${existing.id}?teamId=${VERCEL_TEAM_ID}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: signingSecret }),
      })
    } else {
      // Create
      await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'STRIPE_WEBHOOK_SECRET',
          value: signingSecret,
          type: 'encrypted',
          target: ['production', 'preview'],
        }),
      })
    }
  }

  return NextResponse.json({
    ok: true,
    webhookId: webhook.id,
    vercelUpdated: !!vercelToken,
    signingSecret: vercelToken ? '(set automatically in Vercel)' : signingSecret,
  })
}
