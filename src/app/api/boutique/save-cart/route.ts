import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PRODUCTS } from '@/lib/boutique/products'
import {
  clientIp,
  enforceRateLimit,
  normalizeEmail,
  retryAfterHeaders,
  tooManyRequestsBody,
} from '@/lib/security/rate-limit'
import { getRateLimitStore } from '@/lib/security/rate-limit-store'

export const runtime = 'nodejs'

const VALID_IDS = new Set(PRODUCTS.map(p => p.id))

/**
 * Limitation (05-K.5, finding F-03). Cette route écrit dans abandoned_carts en
 * `service_role` avec une adresse fournie par un visiteur non authentifié. Le
 * cron /api/cron/abandoned-cart relance ENSUITE ces adresses par e-mail : sans
 * borne, la table devient un carnet d'envoi alimenté depuis l'extérieur.
 *
 * Calibrage : sur 30 jours, aucun panier n'a été enregistré. Les bornes sont
 * donc très au-dessus de l'usage réel.
 *
 * fail-closed : l'écriture déclenche un envoi différé. L'appel est déjà
 * silencieux côté client (`catch` vide dans la page panier), un refus n'a donc
 * aucun effet visible sur le parcours d'achat.
 */
const IP_RULE = { limit: 20, windowSeconds: 3600 }
const EMAIL_RULE = { limit: 10, windowSeconds: 3600 }

export async function POST(req: NextRequest) {
  try {
    const { email, items, locale: rawLocale } = await req.json() as {
      email: string
      items: { product_id: string; quantity: number }[]
      locale?: string
    }
    const locale = rawLocale === 'en' ? 'en' : 'fr'

    // Validation stricte de l'adresse : normalisation + syntaxe + longueur max.
    const cleanEmail = normalizeEmail(email)
    if (!cleanEmail) {
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

    const verdict = await enforceRateLimit({
      store: getRateLimitStore(),
      failClosed: true,
      dimensions: [
        { scope: 'save-cart:ip', value: clientIp(req), rule: IP_RULE, required: true },
        { scope: 'save-cart:email', value: cleanEmail, rule: EMAIL_RULE },
      ],
    })
    if (!verdict.allowed) {
      // Refus AVANT l'écriture : abandoned_carts n'est pas alimentée.
      return NextResponse.json(tooManyRequestsBody(), {
        status: 429,
        headers: retryAfterHeaders(verdict.retryAfterSeconds),
      })
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('abandoned_carts').upsert({
      email: cleanEmail,
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
