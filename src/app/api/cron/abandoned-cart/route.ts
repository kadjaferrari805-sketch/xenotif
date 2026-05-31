import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendAbandonedCartEmail } from '@/lib/emails'
import { PRODUCTS, formatPrice } from '@/lib/boutique/products'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PRODUCT_BY_ID = new Map(PRODUCTS.map(p => [p.id, p]))
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.com'

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Paniers abandonnés depuis +1h, pas encore relancés, non récupérés
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { data: carts, error } = await supabase
    .from('abandoned_carts')
    .select('*')
    .eq('reminder_sent', false)
    .eq('recovered', false)
    .lt('updated_at', oneHourAgo)
    .limit(50)

  if (error) {
    console.error('[abandoned-cart] query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!carts || carts.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  for (const cart of carts) {
    const items = (cart.items as { product_id: string; quantity: number }[])
      .map(i => {
        const p = PRODUCT_BY_ID.get(i.product_id)
        if (!p) return null
        return {
          name: p.name,
          price: formatPrice(p.price_cents * i.quantity),
          image: p.images[0] ?? '',
          cents: p.price_cents * i.quantity,
        }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)

    if (items.length === 0) continue

    const total = formatPrice(items.reduce((s, i) => s + i.cents, 0))

    try {
      await sendAbandonedCartEmail({
        email: cart.email,
        items: items.map(i => ({ name: i.name, price: i.price, image: i.image })),
        total,
        recoverUrl: `${BASE_URL}/boutique/panier`,
      })
      await supabase
        .from('abandoned_carts')
        .update({ reminder_sent: true, reminded_at: new Date().toISOString() })
        .eq('email', cart.email)
      sent++
    } catch (err) {
      console.error(`[abandoned-cart] send error for ${cart.email}:`, err)
    }
  }

  return NextResponse.json({ sent, processed: carts.length })
}
