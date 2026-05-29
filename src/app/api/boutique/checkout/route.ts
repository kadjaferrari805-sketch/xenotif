import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const { items } = await req.json() as { items: { stripe_price_id: string; quantity: number }[] }

  if (!items?.length) return NextResponse.json({ error: 'Panier vide' }, { status: 400 })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: items.map(i => ({ price: i.stripe_price_id, quantity: i.quantity })),
    success_url: `${req.nextUrl.origin}/boutique/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/boutique/panier`,
    shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
  })

  return NextResponse.json({ url: session.url })
}
