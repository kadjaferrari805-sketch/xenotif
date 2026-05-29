import Link from 'next/link'
import { ArrowRight, Download } from 'lucide-react'
import { ProductCard } from '@/components/boutique/ProductCard'
import { PRODUCTS } from '@/lib/boutique/products'

export const metadata = { title: 'Boutique — Xenotif®' }

export default function BoutiquePage() {
  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,69,0,0.1),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <span className="mb-4 inline-block rounded-full border border-sport-orange/30 bg-sport-orange/10 px-4 py-1.5 text-xs font-black text-sport-orange uppercase tracking-wider">
            🛒 Boutique Officielle
          </span>
          <h1 className="mb-4 text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Équipements &<br /><span className="text-sport-orange">Programmes Premium</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-sport-gray">
            Tout ce dont tu as besoin pour progresser — équipements fitness pro, suppléments et programmes digitaux créés par nos coachs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#produits" className="inline-flex items-center gap-2 rounded-2xl bg-sport-orange px-8 py-4 font-bold text-white shadow-[0_0_30px_rgba(255,69,0,0.3)] hover:bg-orange-600 transition-all">
              Voir les produits <ArrowRight size={18} />
            </a>
            <a href="#produits" className="inline-flex items-center gap-2 rounded-2xl border border-sport-border bg-sport-card px-8 py-4 font-bold text-white hover:border-sport-orange/50 transition-all">
              <Download size={16} /> Programmes digitaux
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-sport-border bg-sport-card/50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-sport-gray">
            {[
              { icon: '🚚', text: 'Livraison gratuite dès 50€' },
              { icon: '🔒', text: 'Paiement 100% sécurisé' },
              { icon: '📥', text: 'Téléchargement instantané' },
              { icon: '↩️', text: 'Retours 30 jours' },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-2">{b.icon} {b.text}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Produits */}
      <section id="produits" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Tous les produits <span className="text-sport-gray text-base font-normal">({PRODUCTS.length})</span></h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="border-t border-sport-border py-16 bg-sport-card/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-8 text-2xl font-black text-white">Catégories</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Équipements', emoji: '🏋️', desc: 'Kettlebells, bandes, accessoires' },
              { label: 'Nutrition', emoji: '🥗', desc: 'Protéines, créatine, suppléments' },
              { label: 'Programmes', emoji: '📋', desc: 'PDF, e-books, plans digitaux' },
            ].map(cat => (
              <div key={cat.label} className="flex items-center gap-4 rounded-2xl border border-sport-border bg-sport-card p-6">
                <span className="text-4xl">{cat.emoji}</span>
                <div>
                  <p className="font-black text-white">{cat.label}</p>
                  <p className="text-xs text-sport-gray mt-1">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
