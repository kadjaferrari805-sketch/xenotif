import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const PLAN_CONFIG = {
  pro: {
    name: 'Xenotif® — Plan Pro',
    description: 'Accès illimité à tous les programmes, coaching IA personnalisé, statistiques avancées, vidéos HD, support prioritaire 7j/7.',
    unit_monthly: 999,
    unit_annual: 9588,
  },
  elite: {
    name: 'Xenotif® — Plan Élite',
    description: 'Tout le plan Pro + coach personnel dédié, bilan mensuel visio 1-1, plan nutritionnel sur mesure, analyse biomécanique vidéo.',
    unit_monthly: 2499,
    unit_annual: 23988,
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

    const { plan, period = 'monthly', locale: rawLocale, email, userId } = await req.json() as {
      plan: string; period?: string; locale?: string; email?: string; userId?: string
    }
    const locale = rawLocale === 'en' ? 'en' : 'fr'

    if (!plan || !(plan in PLAN_CONFIG)) {
      return NextResponse.json({ error: 'Plan invalide.' }, { status: 400 })
    }

    const config = PLAN_CONFIG[plan as PlanKey]
    const stripe = new Stripe(secretKey)
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.com'
    const isAnnual = period === 'annual'

    const priceId = isAnnual
      ? (plan === 'pro' ? process.env.STRIPE_PRICE_PRO_ANNUAL : process.env.STRIPE_PRICE_ELITE_ANNUAL)
      : (plan === 'pro' ? process.env.STRIPE_PRICE_PRO : process.env.STRIPE_PRICE_ELITE)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      locale,
      // Rattache l'abonnement au compte : email pré-rempli (= email du compte) +
      // ID utilisateur, pour que le webhook lie l'abonnement au bon compte (pas par
      // recherche d'email fragile).
      ...(email ? { customer_email: email } : {}),
      ...(userId ? { client_reference_id: userId } : {}),
      // Méthodes de paiement automatiques (carte, Apple Pay, Google Pay…)
      line_items: priceId
        ? [{ price: priceId, quantity: 1 }]
        : [{
            quantity: 1,
            price_data: {
              currency: 'eur',
              unit_amount: isAnnual ? config.unit_annual : config.unit_monthly,
              recurring: { interval: isAnnual ? 'year' : 'month' },
              product_data: {
                name: `${config.name}${isAnnual ? ' — Annuel' : ''}`,
                description: config.description,
              },
            },
          }],
      allow_promotion_codes: true,
      // La carte est OBLIGATOIRE dès l'inscription (même pendant l'essai gratuit),
      // pour que Stripe puisse débiter automatiquement à la fin des 7 jours.
      payment_method_collection: 'always',
      subscription_data: {
        trial_period_days: 7,
        // Comportement à la fin de l'essai : l'abonnement étant en
        // `charge_automatically` (défaut), Stripe débite automatiquement la carte
        // enregistrée. Si jamais aucune carte n'est disponible, on annule plutôt
        // que de laisser une facture impayée traîner.
        trial_settings: {
          end_behavior: { missing_payment_method: 'cancel' },
        },
        metadata: { plan, period, locale, user_id: userId ?? '' },
      },
      metadata: { plan, period, locale, user_id: userId ?? '' },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#tarifs`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement.' }, { status: 500 })
  }
}
