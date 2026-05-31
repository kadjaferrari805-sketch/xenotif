import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getProductById } from '@/lib/boutique/products'
import { getGuide } from '@/lib/boutique/guides'
import { generateGuidePdf } from '@/lib/boutique/guide-pdf'

export const runtime = 'nodejs'

/**
 * Téléchargement sécurisé d'un guide PDF après achat.
 *   GET /api/boutique/download?session=cs_xxx&p=d1
 *
 * Sécurité : on exige une session Stripe Checkout PAYÉE qui contient bien
 * le produit demandé (les ids des produits digitaux sont stockés dans
 * session.metadata.digital_ids au moment du checkout). Le PDF est généré
 * à la volée — aucun fichier n'est exposé publiquement.
 */
export async function POST() {
  return NextResponse.json({ error: 'Méthode non autorisée' }, { status: 405 })
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session') ?? ''
  const productId = req.nextUrl.searchParams.get('p') ?? ''

  if (!sessionId.startsWith('cs_') || !productId) {
    return NextResponse.json({ error: 'Lien invalide.' }, { status: 400 })
  }

  const product = getProductById(productId)
  const guide = getGuide(productId)
  if (!product || product.type !== 'digital' || !guide) {
    return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Service indisponible.' }, { status: 503 })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Paiement non confirmé pour cette commande.' }, { status: 402 })
    }

    const purchasedIds = (session.metadata?.digital_ids ?? '').split(',').map(s => s.trim()).filter(Boolean)
    if (!purchasedIds.includes(productId)) {
      return NextResponse.json({ error: 'Ce guide ne fait pas partie de ta commande.' }, { status: 403 })
    }

    const bytes = await generateGuidePdf(guide)
    const filename = `xenotif-${product.slug}.pdf`

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        // inline → le PDF s'affiche dans l'onglet du navigateur (plus de page
        // blanche about:blank quand le lien email ouvre un nouvel onglet).
        // Le filename reste utilisé pour « Enregistrer sous ».
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Length': String(bytes.length),
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (err) {
    console.error('Download error:', err)
    return NextResponse.json({ error: 'Impossible de générer le guide. Réessaie ou contacte le support.' }, { status: 500 })
  }
}
