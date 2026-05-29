'use client'
import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Download, Check, Star, ExternalLink } from 'lucide-react'
import { getProductBySlug, formatPrice, PRODUCTS } from '@/lib/boutique/products'
import { useCart } from '@/lib/boutique/cart'
import { ProductCard } from '@/components/boutique/ProductCard'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const found = getProductBySlug(slug)
  if (!found) return notFound()
  const product = found

  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)
  const discount = product.original_price_cents
    ? Math.round((1 - product.price_cents / product.original_price_cents) * 100)
    : null

  return (
    <div className="min-h-screen bg-sport-dark pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <Link href="/boutique" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-sport-gray hover:text-white transition-colors">
          <ArrowLeft size={14} /> Retour à la boutique
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 mb-16">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-sport-border bg-sport-card">
            <Image src={product.images[0] ?? ''} alt={product.name} fill className="object-cover" />
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
              <span className="rounded-full border border-sport-border bg-sport-card px-3 py-1 text-xs font-semibold text-sport-gray">{product.category}</span>
              <span className="rounded-full border border-sport-border bg-sport-card px-3 py-1 text-xs font-semibold text-sport-gray">
                {product.type === 'digital' ? '📥 Digital' : '📦 Physique'}
              </span>
              {product.isAffiliate && (
                <span className="rounded-full border border-sport-orange/40 bg-sport-orange/10 px-3 py-1 text-xs font-semibold text-sport-orange">
                  🔗 Amazon
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
              <span className="text-sm text-sport-gray">({product.reviews.toLocaleString('fr-FR')} avis)</span>
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
              <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-3">Ce qui est inclus</p>
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
                  <ExternalLink size={16} /> Acheter sur Amazon — {formatPrice(product.price_cents)}
                </a>
              ) : (
                <button
                  onClick={handleAdd}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-white transition-all ${
                    added ? 'bg-emerald-600' : 'bg-sport-orange hover:bg-orange-600 shadow-[0_0_20px_rgba(255,69,0,0.3)]'
                  }`}
                >
                  {added
                    ? <><Check size={16} />Ajouté au panier !</>
                    : product.type === 'digital'
                      ? <><Download size={16} />Acheter — {formatPrice(product.price_cents)}</>
                      : <><ShoppingCart size={16} />Ajouter au panier</>
                  }
                </button>
              )}
            </div>

            {/* Livraison info */}
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-sport-gray">
              {product.isAffiliate ? (
                <>
                  <span>🔗 Lien affilié Amazon</span>
                  <span>📦 Expédié par Amazon</span>
                  <span>🔒 Paiement sécurisé</span>
                </>
              ) : product.type === 'physical' ? (
                <>
                  <span>🚚 Livraison gratuite dès 50€</span>
                  <span>↩️ Retours 30 jours</span>
                  <span>🔒 Paiement sécurisé</span>
                </>
              ) : (
                <>
                  <span>⚡ Téléchargement immédiat</span>
                  <span>📱 Compatible tous appareils</span>
                  <span>♾️ Accès à vie</span>
                </>
              )}
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

        {/* Produits liés */}
        {related.length > 0 && (
          <section className="pt-12 border-t border-sport-border">
            <h2 className="text-2xl font-black text-white mb-8">Vous aimerez aussi</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
