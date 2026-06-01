import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PRODUCTS } from '@/lib/boutique/products'

export const runtime = 'nodejs'

const VALID_IDS = new Set(PRODUCTS.map(p => p.id))

export async function POST(req: NextRequest) {
  try {
    const { email, items, locale: rawLocale } = await req.json() as {
      email: string
      items: { product_id: string; quantity: number }[]
      locale?: string
    }
    const locale = rawLocale === 'en' ? 'en' : 'fr'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Ne garder que les produits Xenotif valides (payables via Stripe)
    const validItems = items.filter(i => VALID_IDS.has(i.product_id))
    if (validItems.length === 0) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('abandoned_carts').upsert({
      email: email.toLowerCase().trim(),
      items: validItems,
      reminder_sent: false,
      recovered: false,
      locale,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' })

    if (error) {
      console.error('[save-cart] upsert error:', error)
      return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[save-cart] error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
