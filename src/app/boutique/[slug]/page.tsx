'use client'
import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Download, Check } from 'lucide-react'
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
  const features = product.type === 'digital'
    ? ['Téléchargement instantané', 'Format PDF tous appareils', 'Accès à vie', 'Mises à jour incluses']
    : ['Livraison offerte dès 50€', 'Retours gratuits 30 jours', 'Garantie qualité 2 ans', 'Emballage éco-responsable']

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
          </div>

          {/* Infos */}
          <div className="flex flex-col">
            <div className="flex gap-2 mb-3">
              <span className="rounded-full border border-sport-border px-3 py-1 text-xs font-semibold text-sport-gray">{product.category}</span>
              <span className="rounded-full border border-sport-border px-3 py-1 text-xs font-semibold text-sport-gray">
                {product.type === 'digital' ? '📥 Digital' : '📦 Livraison 2-5j'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-white mb-4">{product.name}</h1>
            <p className="text-sport-gray leading-relaxed mb-8">{product.description}</p>
            <div className="mb-8">
              <span className="text-4xl font-black text-white">{formatPrice(product.price_cents)}</span>
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-sport-border bg-sport-card p-4 mb-8">
              <ul className="space-y-2">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white">
                    <Check size={14} className="flex-shrink-0 text-sport-lime" />{f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-white transition-all ${
                  added ? 'bg-emerald-600' : 'bg-sport-orange hover:bg-orange-600 shadow-[0_0_20px_rgba(255,69,0,0.3)]'
                }`}
              >
                {added ? <><Check size={16} />Ajouté !</> : product.type === 'digital' ? <><Download size={16} />Ajouter au panier</> : <><ShoppingCart size={16} />Ajouter au panier</>}
              </button>
              <Link href="/boutique/panier" className="flex items-center gap-2 rounded-2xl border border-sport-border px-6 py-3.5 font-bold text-white hover:border-sport-orange/50 transition-all">
                Commander
              </Link>
            </div>
          </div>
        </div>

        {/* Produits liés */}
        {related.length > 0 && (
          <section className="pt-12 border-t border-sport-border">
            <h2 className="text-2xl font-black text-white mb-8">Vous aimerez aussi</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
