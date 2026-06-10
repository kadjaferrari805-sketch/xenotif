import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendAbandonedCartEmail } from '@/lib/emails'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'
import { PRODUCTS, formatPrice } from '@/lib/boutique/products'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PRODUCT_BY_ID = new Map(PRODUCTS.map(p => [p.id, p]))
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://xenotif.com'

// Texte court du push de relance panier, par langue.
const CART_PUSH: Record<string, { title: string; body: string }> = {
  fr: { title: '🛒 Ton panier t\'attend', body: 'Termine ta commande Xenotif® avant que ton panier n\'expire !' },
  en: { title: '🛒 Your cart is waiting', body: 'Complete your Xenotif® order before your cart expires!' },
  de: { title: '🛒 Dein Warenkorb wartet', body: 'Schließe deine Xenotif®-Bestellung ab, bevor dein Warenkorb verfällt!' },
}

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

  // Résolution email → user_id (pour le push : la table abandoned_carts ne stocke
  // que l'email). On ne mappe que les emails des paniers à relancer.
  const wantedEmails = new Set(carts.map(c => (c.email as string).toLowerCase()))
  const userIdByEmail = new Map<string, string>()
  for (let page = 1; page <= 25; page++) {
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (listErr) {
      console.error('[abandoned-cart] listUsers error:', listErr)
      break
    }
    for (const u of list.users) {
      if (u.email && wantedEmails.has(u.email.toLowerCase())) userIdByEmail.set(u.email.toLowerCase(), u.id)
    }
    if (list.users.length < 200) break
  }

  let sent = 0
  let pushed = 0
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
        locale: cart.locale ?? 'fr',
      })
      await supabase
        .from('abandoned_carts')
        .update({ reminder_sent: true, reminded_at: new Date().toISOString() })
        .eq('email', cart.email)
      sent++
    } catch (err) {
      console.error(`[abandoned-cart] send error for ${cart.email}:`, err)
    }

    // Push (web + natif) en plus de l'email, si on a retrouvé le compte utilisateur.
    // Best-effort : n'envoie rien si l'utilisateur n'a pas d'appareil/abonnement.
    const userId = userIdByEmail.get((cart.email as string).toLowerCase())
    if (userId) {
      const locale = (cart.locale as string) ?? 'fr'
      const p = CART_PUSH[locale] ?? CART_PUSH.fr
      try {
        pushed += await sendWebPushToUser(userId, {
          title: p.title,
          body: p.body,
          url: '/boutique/panier',
          tag: 'abandoned_cart',
        })
        pushed += await sendPushToUser(userId, {
          title: p.title,
          body: p.body,
          data: { type: 'abandoned_cart', url: '/boutique/panier' },
        })
      } catch (err) {
        console.error(`[abandoned-cart] push error for ${cart.email}:`, err)
      }
    }
  }

  return NextResponse.json({ sent, pushed, processed: carts.length })
}
