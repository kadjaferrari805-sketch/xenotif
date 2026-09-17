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

/** UUID v4 tel que produit par `crypto.randomUUID()`. */
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

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
 *
 * Le jeton n'entre PAS dans les dimensions de limitation : il est gratuit à
 * générer, et l'y substituer offrirait un contournement à coût nul.
 */
const IP_RULE = { limit: 20, windowSeconds: 3600 }
const EMAIL_RULE = { limit: 10, windowSeconds: 3600 }

/**
 * PROPRIÉTÉ DU PANIER (05-K8.4, finding K8-03).
 *
 * Avant : la clé d'upsert était l'adresse e-mail. Quiconque la connaissait
 * pouvait remplacer le panier de son titulaire et, l'upsert remettant
 * `reminder_sent` et `recovered` à false, RÉARMER un rappel déjà envoyé.
 *
 * Désormais la ligne est désignée par `cart_token`, capability secrète générée
 * par le navigateur. Trois cas, et un seul refus :
 *   - jeton inconnu                → création
 *   - jeton connu, même adresse    → mise à jour
 *   - jeton connu, autre adresse   → 409, AUCUNE écriture
 *
 * Ce dernier cas est le cœur de la règle : un jeton autorise à modifier SON
 * panier, jamais à le réattribuer à une autre adresse. Sans cela, un jeton volé
 * permettrait de faire envoyer un rappel Xenotif vers une adresse arbitraire.
 *
 * CE QUE LE JETON NE PROUVE PAS : la possession de l'adresse. Il ferme
 * l'écrasement et le réarmement, pas l'envoi vers un tiers — cela demanderait
 * une vérification de possession (double opt-in), hors périmètre.
 *
 * UNE MISE À JOUR NE RÉARME PAS le rappel : `reminder_sent` et `recovered` ne
 * sont pas réécrits. Un panier déjà relancé ne peut donc pas l'être à nouveau,
 * même par son propriétaire légitime.
 */
export async function POST(req: NextRequest) {
  try {
    const { cart_token: cartToken, email, items, locale: rawLocale } = await req.json() as {
      cart_token?: unknown
      email: string
      items: { product_id: string; quantity: number }[]
      locale?: string
    }
    const locale = rawLocale === 'en' ? 'en' : 'fr'

    if (typeof cartToken !== 'string' || !UUID_V4.test(cartToken)) {
      return NextResponse.json({ error: 'Jeton de panier invalide' }, { status: 400 })
    }

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

    const { data: existant, error: lectureErr } = await supabase
      .from('abandoned_carts')
      .select('email')
      .eq('cart_token', cartToken)
      .maybeSingle()

    if (lectureErr) {
      console.error('[save-cart] lecture impossible:', lectureErr)
      return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 })
    }

    if (existant && existant.email !== cleanEmail) {
      // Le jeton désigne un panier appartenant à une autre adresse : on refuse
      // sans rien écrire. Le corps ne révèle pas l'adresse enregistrée.
      return NextResponse.json({ error: 'Panier non modifiable' }, { status: 409 })
    }

    const maintenant = new Date().toISOString()

    if (existant) {
      const { error } = await supabase
        .from('abandoned_carts')
        .update({ items: validItems, locale, updated_at: maintenant })
        .eq('cart_token', cartToken)

      if (error) {
        console.error('[save-cart] update error:', error)
        return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 })
      }
      return NextResponse.json({ ok: true })
    }

    const { error } = await supabase.from('abandoned_carts').insert({
      cart_token: cartToken,
      email: cleanEmail,
      items: validItems,
      reminder_sent: false,
      recovered: false,
      locale,
      updated_at: maintenant,
    })

    if (error) {
      // 23505 sur l'adresse : tant que la clé primaire reste `email` (étape A,
      // la bascule appartient à l'étape G), deux paniers pour une même adresse
      // sont impossibles. On le signale explicitement plutôt que de renvoyer un
      // 500 opaque. Après la bascule, ce cas disparaît.
      if (error.code === '23505') {
        console.error('[save-cart] conflit d unicite (PK email encore en place):', error.code)
        return NextResponse.json({ error: 'Panier déjà enregistré pour cette adresse' }, { status: 409 })
      }
      console.error('[save-cart] insert error:', error)
      return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[save-cart] error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
