import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      console.error('ENV CHECK — STRIPE_SECRET_KEY: missing | STRIPE_PRICE_PRO:', process.env.STRIPE_PRICE_PRO ? 'ok' : 'missing', '| STRIPE_PRICE_ELITE:', process.env.STRIPE_PRICE_ELITE ? 'ok' : 'missing')
      return NextResponse.json({ error: 'Configuration serveur manquante.' }, { status: 500 })
    }

    const { plan } = await req.json()

    if (!plan || !['pro', 'elite'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide.' }, { status: 400 })
    }

    const priceId = plan === 'pro' ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_ELITE
    if (!priceId) {
      console.error(`STRIPE_PRICE_${(plan as string).toUpperCase()} is not set`)
      return NextResponse.json({ error: 'Ce plan n\'est pas encore configuré.' }, { status: 500 })
    }

    const stripe = new Stripe(secretKey)
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.vercel.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      locale: 'fr',
      payment_method_types: ['card', 'paypal'],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#tarifs`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement.' }, { status: 500 })
  }
}
