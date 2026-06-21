'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowLeft, ShoppingCart, Download, Check, Star, ExternalLink } from 'lucide-react'
import { formatPrice, type Product } from '@/lib/boutique/products'
import { getProductsLocalized } from '@/lib/boutique/products.en'
import { useCart } from '@/lib/boutique/cart'
import { ProductCard } from '@/components/boutique/ProductCard'
import { CustomerReviews } from '@/components/reviews/CustomerReviews'

// Partie interactive de la fiche produit (panier, état du bouton).
// Le composant serveur parent (page.tsx) fournit `product` + les métadonnées SEO.
export function ProductDetail({ product }: { product: Product }) {
  const t = useTranslations('boutique')
  const locale = useLocale()
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    // Pas d'ouverture auto du panier : le bouton passe à « Ajouté au panier ! »
    // et le compteur du panier flottant se met à jour.
    setTimeout(() => setAdded(false), 2000)
  }

  // Similaires : même catégorie.
  const related = getProductsLocalized(locale).filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)
  const discount = product.original_price_cents
    ? Math.round((1 - product.price_cents / product.original_price_cents) * 100)
    : null

  return (
    <div className="min-h-screen bg-sport-dark pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <Link href="/boutique" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-sport-gray hover:text-white transition-colors">
          <ArrowLeft size={14} /> {t('detail.back')}
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 mb-16">
          {/* Image */}
          <div className={`relative aspect-square overflow-hidden rounded-2xl border border-sport-border ${product.images[0]?.startsWith('/products/') ? 'bg-sport-dark' : 'bg-sport-card'}`}>
            <Image src={product.images[0] ?? ''} alt={product.name} fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={product.imageFit === 'contain' ? 'object-contain p-4' : 'object-cover'}
              style={product.imagePosition ? { objectPosition: product.imagePosition } : undefined} />
            {product.badge && (
              <span className="absolute top-4 left-4 rounded-full bg-sport-orange px-3 py-1 text-sm font-black text-white">{product.badge}</span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-sm font-black text-white">-{discount}%</span>
            )}
          </div>

          {/* Détails */}
          <div className="flex flex-col">
            {/* Marque + catégorie */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="rounded-full border border-sport-border bg-sport-card px-3 py-1 text-xs font-bold text-sport-gray">{product.brand}</span>
              <span className="rounded-full border border-sport-border bg-sport-card px-3 py-1 text-xs font-semibold text-sport-gray">{t(`categories.${product.category}`)}</span>
              <span className="rounded-full border border-sport-border bg-sport-card px-3 py-1 text-xs font-semibold text-sport-gray">
                {product.type === 'digital' ? t('detail.typeDigital') : t('detail.typePhysical')}
              </span>
              {product.isAffiliate && (
                <span className="rounded-full border border-sport-orange/40 bg-sport-orange/10 px-3 py-1 text-xs font-semibold text-sport-orange">
                  {t('detail.amazon')}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-white mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.rating) ? 'fill-sport-orange text-sport-orange' : 'fill-sport-border text-sport-border'} />
                ))}
              </div>
              <span className="text-sm font-bold text-sport-orange">{product.rating}/5</span>
              <span className="text-sm text-sport-gray">{t('detail.reviews', { count: product.reviews })}</span>
            </div>

            <p className="text-sport-gray leading-relaxed mb-8">
              {product.longDescription ?? product.description}
            </p>

            {/* Prix */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-black text-white">{formatPrice(product.price_cents)}</span>
              {product.original_price_cents && (
                <>
                  <span className="text-xl text-sport-gray line-through">{formatPrice(product.original_price_cents)}</span>
                  <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-sm font-black text-white">-{discount}%</span>
                </>
              )}
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-sport-border bg-sport-card p-4 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-3">{t('detail.included')}</p>
              <ul className="space-y-2">
                {product.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white">
                    <Check size={14} className="shrink-0 text-sport-lime" />{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              {product.isAffiliate && product.amazon ? (
                <a
                  href={product.amazon.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sport-orange px-6 py-3.5 font-bold text-white hover:bg-orange-600 transition-all shadow-[0_0_20px_rgba(255,69,0,0.3)]"
                >
                  <ExternalLink size={16} /> {t('detail.buyAmazon')}
                </a>
              ) : (
                <button
                  onClick={handleAdd}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-white transition-all ${
                    added ? 'bg-emerald-600' : 'bg-sport-orange hover:bg-orange-600 shadow-[0_0_20px_rgba(255,69,0,0.3)]'
                  }`}
                >
                  {added
                    ? <><Check size={16} />{t('detail.addedToCart')}</>
                    : product.type === 'digital'
                      ? <><Download size={16} />{t('detail.buyDigital')}</>
                      : <><ShoppingCart size={16} />{t('detail.addToCart')}</>
                  }
                </button>
              )}
            </div>

            {/* Réassurance (paiement, livraison, accès) — chips visibles sous le CTA */}
            <div className="mt-6 flex flex-wrap gap-2">
              {(t.raw(
                product.isAffiliate ? 'detail.shippingAffiliate'
                  : product.type === 'physical' ? 'detail.shippingPhysical'
                  : 'detail.shippingDigital',
              ) as string[]).map((line) => (
                <span key={line} className="inline-flex items-center rounded-full border border-sport-border bg-sport-card px-3 py-1.5 text-xs font-semibold text-sport-gray">
                  {line}
                </span>
              ))}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="rounded-full border border-sport-border px-2.5 py-1 text-[10px] font-semibold text-sport-gray">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Avis clients — uniquement sur nos produits digitaux (achat vérifiable).
            La section porte elle-même son séparateur et disparaît s'il n'y a pas d'avis. */}
        {product.type === 'digital' && (
          <CustomerReviews kind="product" productId={product.id} />
        )}

        {/* Produits similaires (même catégorie) */}
        {related.length > 0 && (
          <section className="pt-12 border-t border-sport-border">
            <h2 className="text-2xl font-black text-white mb-8">{t('detail.related')}</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map(p => <ProductCard key={p.id} product={p} source="product_related" />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
