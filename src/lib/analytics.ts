// Suivi des clics produits (côté client). Combine GA4 + Meta Pixel.
// Sans effet si les scripts ne sont pas chargés (ID non configuré / bloqueur).
import { trackMeta } from '@/lib/meta-pixel'
import type { Product } from '@/lib/boutique/products'

type Gtag = (...args: unknown[]) => void

// Clic sur une carte produit (vitrine, boutique, article). `source` = contexte
// (ex. 'home_recommended', 'blog', 'boutique') pour le reporting GA.
export function trackProductClick(product: Product, source = 'shop'): void {
  if (typeof window === 'undefined') return
  const price = product.price_cents / 100
  const w = window as unknown as { gtag?: Gtag }

  // GA4 — événement e-commerce standard « select_item ».
  w.gtag?.('event', 'select_item', {
    item_list_name: source,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.category,
        price,
        affiliation: product.isAffiliate ? 'Amazon' : 'Xenotif',
      },
    ],
  })

  // Événement affilié dédié → reporting simple des clics affiliés dans GA.
  if (product.isAffiliate) {
    w.gtag?.('event', 'affiliate_click', {
      item_id: product.id,
      item_name: product.name,
      value: price,
      currency: 'EUR',
      source,
    })
  }

  // Meta Pixel — intérêt produit.
  trackMeta('ViewContent', {
    content_ids: [product.id],
    content_type: 'product',
    content_name: product.name,
    value: price,
    currency: 'EUR',
  })
}

// Inscription réussie. Événement recommandé GA4 « sign_up ». `method` = plan
// choisi (gratuit/pro), pendant GA4 du `CompleteRegistration` Meta.
export function trackSignUp(method = 'gratuit'): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { gtag?: Gtag }
  w.gtag?.('event', 'sign_up', { method })
}

// Achat confirmé (guide boutique ou abonnement). Événement e-commerce GA4
// standard « purchase » → importable comme conversion Google Ads. `value` en
// euros, `transactionId` = id de session Stripe (dédup côté GA).
export function trackPurchase(opts: {
  value: number
  currency?: string
  transactionId?: string
  items?: { item_id: string; item_name: string }[]
}): void {
  if (typeof window === 'undefined') return
  const w = window as unknown as { gtag?: Gtag }
  w.gtag?.('event', 'purchase', {
    transaction_id: opts.transactionId,
    value: opts.value,
    currency: opts.currency ?? 'EUR',
    items: opts.items ?? [],
  })
}
