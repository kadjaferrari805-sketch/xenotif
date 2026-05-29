'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Download } from 'lucide-react'
import { formatPrice, type Product } from '@/lib/boutique/products'
import { useCart } from '@/lib/boutique/cart'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart()

  return (
    <div className="group overflow-hidden rounded-2xl border border-sport-border bg-sport-card hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <Link href={`/boutique/${product.slug}`}>
        <div className="relative h-52 overflow-hidden bg-sport-border/30">
          <Image
            src={product.images[0] ?? ''}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-full bg-sport-orange px-2.5 py-1 text-xs font-black text-white">
              {product.badge}
            </span>
          )}
          <span className="absolute top-3 right-3 rounded-full border border-sport-border bg-sport-dark/80 px-2 py-1 text-xs font-semibold text-sport-gray backdrop-blur-sm">
            {product.type === 'digital' ? '📥 Digital' : '📦 Physique'}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-sport-gray">{product.category}</p>
        <Link href={`/boutique/${product.slug}`}>
          <h3 className="mb-2 font-black text-white group-hover:text-sport-orange transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <p className="mb-4 text-xs text-sport-gray line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-white">{formatPrice(product.price_cents)}</span>
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-2 rounded-xl bg-sport-orange px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-all hover:shadow-[0_0_16px_rgba(255,69,0,0.4)]"
          >
            {product.type === 'digital' ? <Download size={14} /> : <ShoppingCart size={14} />}
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
