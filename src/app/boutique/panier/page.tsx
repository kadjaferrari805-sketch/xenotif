'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/boutique/cart'
import { formatPrice } from '@/lib/boutique/products'
import { useState } from 'react'

export default function PanierPage() {
  const { items, count, total, removeItem, updateQty } = useCart()
  const [loading, setLoading] = useState(false)

  async function checkout() {
    setLoading(true)
    try {
      const res = await fetch('/api/boutique/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(i => ({ stripe_price_id: i.product.stripe_price_id, quantity: i.quantity })) }),
      })
      const data = await res.json() as { url?: string }
      if (data.url) window.location.href = data.url
    } finally { setLoading(false) }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sport-dark px-4 pt-20 text-center">
        <ShoppingBag size={64} className="text-sport-border" />
        <div>
          <h1 className="text-2xl font-black text-white">Ton panier est vide</h1>
          <p className="mt-2 text-sport-gray">Découvre nos produits premium</p>
        </div>
        <Link href="/boutique" className="inline-flex items-center gap-2 rounded-2xl bg-sport-orange px-6 py-3 font-bold text-white hover:bg-orange-600 transition-all">
          Voir la boutique <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sport-dark pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="mb-8 text-3xl font-black text-white">Panier ({count} article{count !== 1 ? 's' : ''})</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 rounded-2xl border border-sport-border bg-sport-card p-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-sport-border/30">
                  <Image src={product.images[0] ?? ''} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-white">{product.name}</p>
                      <p className="text-xs text-sport-gray mt-0.5">{product.category} · {product.type === 'digital' ? 'Digital' : 'Physique'}</p>
                    </div>
                    <button onClick={() => removeItem(product.id)} className="text-sport-gray hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    {product.type === 'physical' ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(product.id, quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-sport-border hover:border-sport-orange/50 text-sport-gray hover:text-white transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
                        <button onClick={() => updateQty(product.id, quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-sport-border hover:border-sport-orange/50 text-sport-gray hover:text-white transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : <span className="text-xs text-sport-lime font-semibold">📥 Téléchargement</span>}
                    <span className="font-black text-white">{formatPrice(product.price_cents * quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <div>
            <div className="rounded-2xl border border-sport-orange/30 bg-sport-card p-6 shadow-[0_0_30px_rgba(255,69,0,0.1)]">
              <h2 className="mb-4 font-black text-white">Récapitulatif</h2>
              <div className="space-y-3 text-sm">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sport-gray">
                    <span className="truncate flex-1 mr-2">{product.name} ×{quantity}</span>
                    <span className="font-semibold text-white">{formatPrice(product.price_cents * quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-sport-border pt-3 flex justify-between">
                  <span className="font-black text-white">Total</span>
                  <span className="text-xl font-black text-sport-orange">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={checkout}
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-sport-orange py-3.5 font-bold text-white hover:bg-orange-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Chargement...' : <>Payer <ArrowRight size={16} /></>}
              </button>
              <p className="mt-3 text-center text-xs text-sport-gray">Paiement sécurisé Stripe · SSL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
