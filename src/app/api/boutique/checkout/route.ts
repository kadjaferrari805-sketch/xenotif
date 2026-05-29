import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { PRODUCTS } from '@/lib/boutique/products'

// Liste blanche des price_id autorisés
const ALLOWED_PRICE_IDS = new Set(PRODUCTS.map(p => p.stripe_price_id))

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Paiement non configuré' }, { status: 503 })
  }

  try {
    const { items } = await req.json() as { items: { stripe_price_id: string; quantity: number }[] }

    if (!items?.length) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Validation : seuls les price_id autorisés sont acceptés
    for (const item of items) {
      if (!ALLOWED_PRICE_IDS.has(item.stripe_price_id)) {
        return NextResponse.json({ error: 'Produit invalide' }, { status: 400 })
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json({ error: 'Quantité invalide' }, { status: 400 })
      }
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map(i => ({ price: i.stripe_price_id, quantity: i.quantity })),
      success_url: `${req.nextUrl.origin}/boutique/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/boutique/panier`,
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Boutique checkout error:', err)
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 })
  }
}
