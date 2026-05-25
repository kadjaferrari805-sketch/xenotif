import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const PLAN_CONFIG = {
  pro: {
    name: 'Xenotif® — Plan Pro',
    description: 'Accès illimité à tous les programmes, coaching IA personnalisé, statistiques avancées, vidéos HD, support prioritaire 7j/7.',
    unit_amount: 999,
  },
  elite: {
    name: 'Xenotif® — Plan Élite',
    description: 'Tout le plan Pro + coach personnel dédié, bilan mensuel visio 1-1, plan nutritionnel sur mesure, analyse biomécanique vidéo.',
    unit_amount: 2499,
  },
} as const

type PlanKey = keyof typeof PLAN_CONFIG

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      console.error('STRIPE_SECRET_KEY is not set')
      return NextResponse.json({ error: 'Configuration serveur manquante.' }, { status: 500 })
    }

    const { plan } = await req.json() as { plan: string }

    if (!plan || !(plan in PLAN_CONFIG)) {
      return NextResponse.json({ error: 'Plan invalide.' }, { status: 400 })
    }

    const config = PLAN_CONFIG[plan as PlanKey]
    const stripe = new Stripe(secretKey)
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.vercel.app'

    // Use pre-configured price IDs if available, otherwise use inline pricing
    const priceId = plan === 'pro' ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_ELITE

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      locale: 'fr',
      payment_method_types: ['card', 'paypal'],
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [{
            quantity: 1,
            price_data: {
              currency: 'eur',
              unit_amount: config.unit_amount,
              recurring: { interval: 'month' },
              product_data: {
                name: config.name,
                description: config.description,
              },
            },
          }],
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
