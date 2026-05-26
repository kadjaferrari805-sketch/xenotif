/**
 * Auto-registers the Stripe webhook and sets STRIPE_WEBHOOK_SECRET in Vercel.
 * Runs automatically after each production build.
 * Requires: STRIPE_SECRET_KEY, VERCEL_TOKEN (both set in Vercel env).
 */

const VERCEL_PROJECT_ID = 'prj_pL3t9KgP44lzourq5Vusk4FEOhi6'
const VERCEL_TEAM_ID    = 'team_UPv0ZcLiLb5ewMjzOMCQbkkN'
const WEBHOOK_URL       = 'https://xenotif.vercel.app/api/webhook/stripe'

const EVENTS = [
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_failed',
]

const stripeKey      = process.env.STRIPE_SECRET_KEY
const vercelToken    = process.env.VERCEL_TOKEN
const alreadySet     = !!process.env.STRIPE_WEBHOOK_SECRET

if (!stripeKey) {
  console.log('[setup-webhook] STRIPE_SECRET_KEY not set — skipping')
  process.exit(0)
}

if (alreadySet) {
  console.log('[setup-webhook] STRIPE_WEBHOOK_SECRET already configured — skipping')
  process.exit(0)
}

if (!vercelToken) {
  console.log('[setup-webhook] VERCEL_TOKEN not set — skipping Vercel env update')
}

// Use dynamic import so this works without installing stripe as a build dep
const Stripe = (await import('stripe')).default
const stripe  = new Stripe(stripeKey)

// Remove old webhooks for this URL
const existing = await stripe.webhookEndpoints.list({ limit: 20 })
for (const wh of existing.data) {
  if (wh.url === WEBHOOK_URL) {
    await stripe.webhookEndpoints.del(wh.id)
    console.log(`[setup-webhook] Removed old webhook: ${wh.id}`)
  }
}

// Create new webhook
const webhook = await stripe.webhookEndpoints.create({
  url: WEBHOOK_URL,
  enabled_events: EVENTS,
  description: 'Xenotif® — auto-configured',
})

console.log(`[setup-webhook] Webhook created: ${webhook.id}`)
const secret = webhook.secret

if (vercelToken && secret) {
  const listUrl = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`
  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${vercelToken}` },
  })
  const listData = await listRes.json()
  const existingEnv = listData.envs?.find(e => e.key === 'STRIPE_WEBHOOK_SECRET')

  if (existingEnv) {
    await fetch(
      `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env/${existingEnv.id}?teamId=${VERCEL_TEAM_ID}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: secret }),
      }
    )
    console.log('[setup-webhook] STRIPE_WEBHOOK_SECRET updated in Vercel ✓')
  } else {
    await fetch(listUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${vercelToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'STRIPE_WEBHOOK_SECRET',
        value: secret,
        type: 'encrypted',
        target: ['production', 'preview'],
      }),
    })
    console.log('[setup-webhook] STRIPE_WEBHOOK_SECRET added to Vercel ✓')
  }
} else {
  console.log(`[setup-webhook] Add this to Vercel env vars manually:\nSTRIPE_WEBHOOK_SECRET=${secret}`)
}
