import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { claimEvent } from '@/lib/supabase/claim'
import { sendAbandonedCartEmail } from '@/lib/emails'
import { sendPushToUser } from '@/lib/push'
import { sendWebPushToUser } from '@/lib/web-push'
import { PRODUCTS, formatPrice } from '@/lib/boutique/products'
import { getPublicBaseUrl } from '@/lib/env/deployment'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PRODUCT_BY_ID = new Map(PRODUCTS.map(p => [p.id, p]))
const BASE_URL = getPublicBaseUrl()

/**
 * BUDGET D'ENVOI (K8.5). Il porte sur des DESTINATAIRES DISTINCTS, pas sur des
 * lignes lues.
 *
 * Avant la bascule de clé primaire, une adresse ne pouvait porter qu'un panier :
 * `limit(50)` valait donc « 50 destinataires ». Depuis K8.5, `email` n'est plus
 * unique — 50 lignes peuvent appartenir à une seule personne, et le budget
 * d'envoi serait entièrement consommé par elle pendant que d'autres adresses
 * attendent indéfiniment. On lit donc large, puis on compte les destinataires.
 *
 * LIMITE CONNUE, ASSUMÉE : si le nombre de lignes éligibles dépasse
 * `LECTURE_MAX`, la fenêtre de lecture ne couvre pas toute la table. L'ordre
 * étant `updated_at` décroissant, ce sont les paniers les plus récents qui sont
 * servis — un choix défendable, mais ce n'est pas une équité stricte. Sur les
 * volumes réels (aucun panier enregistré sur 30 jours au calibrage K.5), la
 * fenêtre est très au-dessus de l'usage.
 */
const MAX_DESTINATAIRES = 50
const LECTURE_MAX = 500

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

  // Paniers abandonnés depuis +1h, pas encore relancés, non récupérés.
  // L'ORDER BY est EXPLICITE : sans lui, `limit` ramenait un sous-ensemble
  // arbitraire, et deux exécutions sur les mêmes données pouvaient retenir des
  // paniers différents.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { data: carts, error } = await supabase
    .from('abandoned_carts')
    .select('*')
    .eq('reminder_sent', false)
    .eq('recovered', false)
    .lt('updated_at', oneHourAgo)
    .order('updated_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(LECTURE_MAX)

  if (error) {
    console.error('[abandoned-cart] query error:', error)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }

  if (!carts || carts.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  // ORDRE TOTAL, réappliqué côté serveur (K8.5). Postgres trie déjà — mais la
  // règle de départage est une garantie métier, pas un détail de requête : la
  // réappliquer ici la rend vérifiable sans dépendre de l'ordre rendu par la
  // base. `updated_at` décroissant, puis `id` décroissant quand deux paniers
  // portent EXACTEMENT le même horodatage.
  const ordonnes = [...carts].sort((a, b) => {
    const ta = new Date(a.updated_at as string).getTime()
    const tb = new Date(b.updated_at as string).getTime()
    if (ta !== tb) return tb - ta
    const ia = String(a.id ?? ''), ib = String(b.id ?? '')
    return ia < ib ? 1 : ia > ib ? -1 : 0
  })

  // DÉDUPLICATION PAR ADRESSE (K8.4, durcie en K8.5). Une même adresse peut
  // porter plusieurs paniers : deux appareils, ou un localStorage vidé. La liste
  // étant triée, la PREMIÈRE ligne rencontrée pour une adresse est forcément la
  // plus récente — un seul rappel part donc par adresse et par cycle.
  //
  // CE QUI A CHANGÉ EN K8.5 : les lignes écartées ne sont plus marquées. Elles
  // restent éligibles pour un cycle ultérieur, où elles deviendront à leur tour
  // la plus récente de leur adresse. Conséquence assumée et voulue : une
  // personne ayant laissé trois paniers recevra trois rappels, un par cycle —
  // jamais deux dans le même. L'alternative (marquer toute l'adresse) éteignait
  // silencieusement des paniers jamais relancés.
  const parEmail = new Map<string, typeof carts[number]>()
  for (const cart of ordonnes) {
    const cle = (cart.email as string).toLowerCase()
    if (!parEmail.has(cle)) parEmail.set(cle, cart)
    if (parEmail.size >= MAX_DESTINATAIRES) break
  }
  const aRelancer = [...parEmail.values()]

  // Résolution email → user_id (pour le push : la table abandoned_carts ne stocke
  // que l'email). On ne mappe que les adresses réellement relancées.
  const wantedEmails = new Set(aRelancer.map(c => (c.email as string).toLowerCase()))
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

  // K8.12 — `failed` manquait : un échec n'était observable nulle part, ni dans
  // les compteurs, ni dans la réponse. Il ne couvre QUE le couple envoi+marquage ;
  // le push, best-effort, garde son propre `catch` et n'est pas compté ici.
  let sent = 0
  let pushed = 0
  let failed = 0
  for (const cart of aRelancer) {
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

    // ── K8.12.5 — APPROPRIATION AVANT ENVOI.
    //
    // L'UPDATE conditionnel est atomique : PostgreSQL n'accorde la ligne qu'à UN
    // seul exécutant. Deux crons concurrents ne peuvent donc plus envoyer deux
    // fois le même rappel. Le marquage porte toujours sur LA SEULE LIGNE
    // retenue (`id`, K8.5) ; les gardes `reminder_sent`/`recovered` rejouent la
    // condition de sélection AU MOMENT de l'écriture, ce que le SELECT initial
    // ne peut pas garantir.
    //
    // ⚠️ COMPROMIS ASSUMÉ (K8.12.3 §G, arbitrage validé) : l'appropriation est
    // DÉFINITIVE. Un échec d'envoi ou un crash après ce point laisse le panier
    // marqué sans rappel parti — une perte rare, échangée contre la suppression
    // du doublon. Aucune compensation n'est effectuée : remettre
    // `reminder_sent=false` rouvrirait précisément la fenêtre de doublon.
    const claim = await claimEvent(
      supabase
        .from('abandoned_carts')
        .update({ reminder_sent: true, reminded_at: new Date().toISOString() })
        .eq('id', cart.id)
        .eq('reminder_sent', false)
        .eq('recovered', false)
        .select('id'),
    )

    // Un autre exécutant a gagné : ni succès ni échec pour celui-ci. Aucun
    // compteur, aucun envoi, et pas de push non plus — il revient au gagnant.
    if (claim.outcome === 'CLAIM_LOST') continue

    if (claim.outcome === 'DB_ERROR') {
      // JAMAIS confondu avec CLAIM_LOST : une écriture refusée doit rester
      // visible. Seul le message est journalisé — il ne porte ni adresse, ni
      // jeton, ni contenu de panier.
      failed++
      console.error('[abandoned-cart] claim echoue :', cart.id, claim.error.message)
    } else {
      try {
        await sendAbandonedCartEmail({
          email: cart.email,
          items: items.map(i => ({ name: i.name, price: i.price, image: i.image })),
          total,
          recoverUrl: `${BASE_URL}/boutique/panier`,
          locale: cart.locale ?? 'fr',
        })
        sent++
      } catch (err) {
        failed++
        // K8.10-01 — l'adresse partait en clair dans le journal serveur. `cart.id`
        // est la clé primaire depuis K8.5 : la corrélation avec la ligne reste
        // entière via la base, sans écrire de donnée personnelle. L'exception est
        // toujours transmise telle quelle — le diagnostic n'est pas réduit.
        console.error('[abandoned-cart] envoi echoue :', cart.id, err)
      }
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
        // K8.10-02 — même correction que ci-dessus.
        console.error('[abandoned-cart] push echoue :', cart.id, err)
      }
    }
  }

  // `processed` compte les DESTINATAIRES retenus apres deduplication — pas les
  // lignes lues. `read` conserve la visibilite sur l'ecart.
  return NextResponse.json({ sent, pushed, processed: aRelancer.length, read: carts.length, failed })
}
