import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { parseGaClientId } from '@/lib/ga-measurement'

const PLAN_CONFIG = {
  pro: {
    name: 'Xenotif® - Plan Pro',
    description: 'Accès illimité à toutes les disciplines & programmes, coach IA personnalisé, suivi & statistiques, vidéos HD, rappels quotidiens, synchronisation montre.',
    unit_monthly: 999,
    unit_annual: 9588,
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
    // Stripe Checkout supporte fr/en/de → on garde la langue du site (avant : de tombait en fr).
    const locale = rawLocale === 'en' ? 'en' : rawLocale === 'de' ? 'de' : 'fr'

    if (!plan || !(plan in PLAN_CONFIG)) {
      return NextResponse.json({ error: 'Plan invalide.' }, { status: 400 })
    }

    const config = PLAN_CONFIG[plan as PlanKey]
    const stripe = new Stripe(secretKey)
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.com'
    const isAnnual = period === 'annual'

    const priceId = isAnnual ? process.env.STRIPE_PRICE_PRO_ANNUAL : process.env.STRIPE_PRICE_PRO

    // client_id GA4 (cookie _ga) → stocké sur l'abonnement pour envoyer la
    // conversion « purchase » côté serveur au 1er vrai paiement (fin d'essai).
    const gaClientId = parseGaClientId(req.cookies.get('_ga')?.value)
    // Signaux Meta (Event Match Quality) : cookies _fbp/_fbc + IP + User-Agent,
    // relayés au webhook pour un bien meilleur rattachement des conversions aux pubs.
    const fbp = req.cookies.get('_fbp')?.value ?? ''
    const fbc = req.cookies.get('_fbc')?.value ?? ''
    const clientIp = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim()
    const userAgent = (req.headers.get('user-agent') ?? '').slice(0, 480)

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
                name: `${config.name}${isAnnual ? ' - Annuel' : ''}`,
                description: config.description,
              },
            },
          }],
      allow_promotion_codes: true,
      // Essai gratuit 7 jours : la carte est collectée à l'inscription, aucun débit
      // avant la fin de l'essai. La conversion d'achat (GA4/Ads) est envoyée côté
      // serveur au 1er vrai paiement (webhook invoice.paid → Measurement Protocol).
      payment_method_collection: 'always',
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          plan, period, locale, user_id: userId ?? '',
          ga_client_id: gaClientId,
          fb_fbp: fbp, fb_fbc: fbc, fb_ip: clientIp, fb_ua: userAgent,
        },
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
