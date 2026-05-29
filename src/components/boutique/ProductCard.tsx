'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Download, Star } from 'lucide-react'
import { formatPrice, type Product } from '@/lib/boutique/products'
import { useCart } from '@/lib/boutique/cart'

export function ProductCard({ product }: { product: Product; index?: number }) {
  const { addItem } = useCart()
  const discount = product.original_price_cents
    ? Math.round((1 - product.price_cents / product.original_price_cents) * 100)
    : null

  return (
    <div className="group overflow-hidden rounded-2xl border border-sport-border bg-sport-card hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link href={`/boutique/${product.slug}`} className="relative block h-52 overflow-hidden bg-sport-border/20">
        <Image src={product.images[0] ?? ''} alt={product.name} fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-sport-orange px-2.5 py-1 text-xs font-black text-white shadow-lg">{product.badge}</span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">-{discount}%</span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full border border-sport-border bg-sport-dark/80 px-2 py-0.5 text-[10px] font-semibold text-sport-gray backdrop-blur-sm">
          {product.type === 'digital' ? '📥 Digital' : '📦 Physique'}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-sport-gray">{product.brand} · {product.category}</p>
        <Link href={`/boutique/${product.slug}`}>
          <h3 className="mb-2 font-black text-white group-hover:text-sport-orange transition-colors line-clamp-2 text-sm leading-snug">{product.name}</h3>
        </Link>
        <div className="mb-3 flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} className={i < Math.round(product.rating) ? 'fill-sport-orange text-sport-orange' : 'fill-sport-border text-sport-border'} />
            ))}
          </div>
          <span className="text-[11px] font-bold text-sport-orange">{product.rating}</span>
          <span className="text-[10px] text-sport-gray">({product.reviews.toLocaleString('fr-FR')})</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-black text-white">{formatPrice(product.price_cents)}</span>
            {product.original_price_cents && (
              <span className="ml-1.5 text-xs text-sport-gray line-through">{formatPrice(product.original_price_cents)}</span>
            )}
          </div>
          <button onClick={() => addItem(product)}
            className="flex items-center gap-1.5 rounded-xl bg-sport-orange px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-all whitespace-nowrap">
            {product.type === 'digital' ? <Download size={12} /> : <ShoppingCart size={12} />}
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
