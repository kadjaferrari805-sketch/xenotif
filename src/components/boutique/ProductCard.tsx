'use client'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { ShoppingCart, Download, Star, Heart, ExternalLink, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tilt3D } from '@/components/premium/Tilt3D'
import { formatPrice, type Product } from '@/lib/boutique/products'
import { useCart } from '@/lib/boutique/cart'
import { useWishlist } from '@/lib/boutique/wishlist'
import { trackProductClick } from '@/lib/analytics'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  index?: number
  source?: string
}

export function ProductCard({ product, index = 0, source = 'shop' }: ProductCardProps) {
  const t = useTranslations('boutique')
  const locale = useLocale()
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [added, setAdded] = useState(false)
  const wishlisted = isWishlisted(product.id)

  const discount = product.original_price_cents
    ? Math.round((1 - product.price_cents / product.original_price_cents) * 100)
    : null

  // Photos produit (fond blanc studio) → tuile blanche + object-contain :
  // le produit est ENTIÈREMENT visible (pas rogné) et le blanc de la photo
  // se fond dans la tuile → rendu plein cadre. Les visuels lifestyle
  // (produits digitaux) restent en object-cover plein bord.
  const lightTile = product.type !== 'digital'

  function handleAdd() {
    addItem(product)
    setAdded(true)
    // On n'ouvre PAS le panier automatiquement : le compteur du panier
    // flottant se met à jour et le bouton affiche « Ajouté ! » comme retour visuel.
    setTimeout(() => setAdded(false), 2000)
  }

  // Produit affiliation Amazon → redirection directe
  if (product.isAffiliate && product.amazon) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
        <Tilt3D max={14} className="relative rounded-2xl">
        <a href={product.amazon.affiliateUrl} target="_blank" rel="noopener noreferrer"
          onClick={() => trackProductClick(product, source)}
          className="group block overflow-hidden rounded-2xl border border-sport-border bg-sport-card transition-all duration-300">
          <div className={`relative isolate h-52 overflow-hidden ${lightTile ? 'bg-product-tile' : 'bg-sport-border/20'}`}>
            <Image src={product.images[0] ?? ''} alt={product.name} fill
              className={`${lightTile ? 'object-contain p-3' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`}
              style={product.imagePosition ? { objectPosition: product.imagePosition } : undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
            {product.badge && <span className="absolute top-3 left-3 rounded-full bg-sport-orange px-2.5 py-1 text-xs font-black text-white shadow-lg">{product.badge}</span>}
            {discount && <span className="absolute top-3 right-10 rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">-{discount}%</span>}
            <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-sport-dark/80 text-xs">🔗</span>
            <div className="absolute inset-0 bg-gradient-to-t from-sport-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <span className="flex items-center gap-1.5 rounded-full bg-sport-orange px-4 py-2 text-xs font-bold text-white">
                <ExternalLink size={12} /> {t('card.amazonView')}
              </span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sport-gray mb-1">{product.brand} · Amazon</p>
            <h3 className="text-sm font-black text-sport-fg group-hover:text-sport-orange transition-colors line-clamp-2 mb-2">{product.name}</h3>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} className={i < Math.round(product.rating) ? 'fill-sport-orange text-sport-orange' : 'fill-sport-border text-sport-border'} />)}</div>
              <span className="text-[11px] font-bold text-sport-orange">{product.rating}</span>
              <span className="text-[10px] text-sport-gray">({product.reviews.toLocaleString(locale)})</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-black text-sport-fg">{formatPrice(product.price_cents)}</span>
                {product.original_price_cents && <span className="ml-1.5 text-xs text-sport-gray line-through">{formatPrice(product.original_price_cents)}</span>}
              </div>
              <span className="flex items-center gap-1 rounded-xl bg-sport-orange/15 px-3 py-1.5 text-xs font-bold text-sport-orange border border-sport-orange/30">
                <ExternalLink size={10} /> Amazon
              </span>
            </div>
          </div>
        </a>
        </Tilt3D>
      </motion.div>
    )
  }

  // Produit propre XENOTIF
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
      <Tilt3D max={14} className="relative rounded-2xl">
      <div className="group overflow-hidden rounded-2xl border border-sport-border bg-sport-card transition-all duration-300 flex flex-col">
        <Link href={`/boutique/${product.slug}`} onClick={() => trackProductClick(product, source)} className={`relative block h-52 overflow-hidden ${lightTile ? 'bg-product-tile' : 'bg-sport-border/20'}`}>
          <Image src={product.images[0] ?? ''} alt={product.name} fill className={`${lightTile ? 'object-contain p-3' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
          {product.badge && <span className="absolute top-3 left-3 rounded-full bg-sport-orange px-2.5 py-1 text-xs font-black text-white shadow-lg">{product.badge}</span>}
          {discount && <span className="absolute top-3 right-10 rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">-{discount}%</span>}
          {/* Wishlist */}
          <button onClick={e => { e.preventDefault(); toggle(product.id) }}
            className={`absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full transition-all ${wishlisted ? 'bg-red-500 text-sport-fg' : 'bg-sport-dark/80 text-sport-gray hover:text-red-400'}`}>
            <Heart size={12} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          {/* Quick view overlay — span (pas de <a> imbriqué dans le <Link> image) */}
          <div className="absolute inset-0 bg-gradient-to-t from-sport-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
            <span className="flex items-center gap-1.5 rounded-full bg-sport-fg/20 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-sport-fg">
              <Eye size={11} /> {t('card.detailsView')}
            </span>
          </div>
        </Link>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-sport-gray mb-0.5">{product.brand} · {t(`categories.${product.category}`)}</p>
          <Link href={`/boutique/${product.slug}`}>
            <h3 className="text-sm font-black text-sport-fg group-hover:text-sport-orange transition-colors line-clamp-2 mb-2">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} className={i < Math.round(product.rating) ? 'fill-sport-orange text-sport-orange' : 'fill-sport-border text-sport-border'} />)}</div>
            <span className="text-[11px] font-bold text-sport-orange">{product.rating}</span>
            <span className="text-[10px] text-sport-gray">({product.reviews.toLocaleString(locale)})</span>
          </div>
          <div className="mt-auto flex items-center justify-between gap-2">
            <div>
              <span className="text-base font-black text-sport-fg">{formatPrice(product.price_cents)}</span>
              {product.original_price_cents && <span className="ml-1.5 text-xs text-sport-gray line-through">{formatPrice(product.original_price_cents)}</span>}
            </div>
            <button onClick={handleAdd}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-sport-fg transition-all whitespace-nowrap ${added ? 'bg-emerald-600' : 'bg-sport-orange hover:bg-orange-600 hover:shadow-[0_0_16px_rgba(255,69,0,0.4)]'}`}>
              {added ? '✓' : product.type === 'digital' ? <Download size={12} /> : <ShoppingCart size={12} />}
              {added ? t('card.added') : t('card.add')}
            </button>
          </div>
        </div>
      </div>
      </Tilt3D>
    </motion.div>
  )
}
