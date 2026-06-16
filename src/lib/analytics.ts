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
