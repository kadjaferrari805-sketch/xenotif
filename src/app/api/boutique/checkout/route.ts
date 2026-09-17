import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { PRODUCTS } from '@/lib/boutique/products'
import { createStripeClient } from '@/lib/stripe/server'

// Map slug → product pour validation et price_data inline
const PRODUCT_MAP = new Map(PRODUCTS.filter(p => !p.isAffiliate).map(p => [p.id, p]))

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Paiement non configuré - contactez le support' }, { status: 503 })
  }

  try {
    const { items, locale: rawLocale, cart_token: rawToken } = await req.json() as {
      items: { product_id: string; quantity: number }[]
      locale?: string
      cart_token?: unknown
    }
    const locale = rawLocale === 'en' ? 'en' : 'fr'

    // Jeton de panier (K8.4) : transmis à Stripe pour que le webhook marque
    // `recovered` sur LA ligne payée, et non sur toutes celles qui partagent
    // l'adresse. Facultatif ici : pendant la transition, un client déployé
    // avant cette version n'en envoie pas, et le paiement doit aboutir quand
    // même — le webhook conserve un repli sur l'adresse.
    const cartToken = typeof rawToken === 'string'
      && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawToken)
      ? rawToken
      : ''

    if (!items?.length) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Construire les line_items avec price_data inline (pas besoin de créer les prix dans Stripe)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    const hasPhysical = items.some(i => {
      const p = PRODUCT_MAP.get(i.product_id)
      return p?.type === 'physical'
    })

    for (const item of items) {
      const product = PRODUCT_MAP.get(item.product_id)
      if (!product) continue // Ignore les produits affiliés Amazon

      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json({ error: 'Quantité invalide' }, { status: 400 })
      }

      lineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: product.price_cents,
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images[0] ? [product.images[0]] : [],
            metadata: { id: product.id, type: product.type },
          },
        },
      })
    }

    if (!lineItems.length) {
      return NextResponse.json({ error: 'Aucun produit Xenotif dans le panier' }, { status: 400 })
    }

    const stripe = createStripeClient()

    // Ids des programmes digitaux achetés → utilisés pour la livraison (email
    // + téléchargement sécurisé du guide PDF après paiement).
    const digitalIds = items
      .map(i => PRODUCT_MAP.get(i.product_id))
      .filter((p): p is NonNullable<typeof p> => !!p && p.type === 'digital')
      .map(p => p.id)

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      // Pas de payment_method_types → Stripe affiche automatiquement toutes les
      // méthodes activées dans le dashboard (carte, Apple Pay, Google Pay…)
      line_items: lineItems,
      success_url: `${req.nextUrl.origin}/boutique/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/boutique/panier`,
      locale,
      billing_address_collection: 'auto',
      metadata: {
        digital_ids: digitalIds.join(','),
        locale,
        // Clé omise quand le jeton est absent : Stripe n'accepte que des
        // chaînes, et une valeur vide serait indiscernable d'un jeton perdu.
        ...(cartToken ? { cart_token: cartToken } : {}),
      },
    }

    // Ajouter la collecte d'adresse seulement pour les produits physiques
    if (hasPhysical) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'DE', 'AT'],
      }
      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'eur' },
            display_name: 'Livraison standard',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 699, currency: 'eur' },
            display_name: 'Livraison express',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ]
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return NextResponse.json({ url: session.url })

  } catch (err) {
    // K8.8 — finding F6 de l'audit K8.7. Le message de l'exception Stripe
    // partait TEL QUEL au client : il peut nommer des identifiants de prix, la
    // configuration du compte, une contrainte, parfois un request ID. Même
    // acquis que K8-02 sur /api/reviews — le détail reste côté serveur.
    //
    // POURQUOI PAS `server_error` ICI. C'est la convention des routes dont le
    // corps n'est jamais affiché. Celui-ci l'est : panier/page.tsx fait
    // `setError(data.error ?? …)`, et le visiteur lirait « server_error ». On
    // reprend donc la seconde convention maison — un message générique en
    // français, comme « Erreur sauvegarde » de save-cart.
    console.error('[boutique/checkout] session Stripe refusée :', err)
    return NextResponse.json({ error: 'Erreur de paiement. Veuillez réessayer.' }, { status: 500 })
  }
}
