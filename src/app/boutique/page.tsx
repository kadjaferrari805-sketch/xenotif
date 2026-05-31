'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, ArrowRight, Zap, ShoppingBag, Star, TrendingUp, X } from 'lucide-react'
import { ProductCard } from '@/components/boutique/ProductCard'
import { PRODUCTS, getCategories, CATEGORY_ICONS, formatPrice } from '@/lib/boutique/products'

const DISCIPLINES = [
  { id: 'musculation', label: '💪 Musculation' },
  { id: 'running-cardio', label: '🏃 Running' },
  { id: 'hiit', label: '⚡ HIIT' },
  { id: 'yoga', label: '🧘 Yoga' },
  { id: 'crossfit', label: '🔥 CrossFit' },
  { id: 'boxing', label: '🥊 Boxe' },
]

const SORT_OPTIONS = [
  { value: 'popular', label: 'Plus populaires' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Meilleures notes' },
  { value: 'new', label: 'Nouveautés' },
]

export default function BoutiquePage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all')
  const [sort, setSort] = useState('popular')
  const [priceRange] = useState<[number, number]>([0, 50000])
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['all', ...getCategories()]

  const filtered = useMemo(() => {
    let list = PRODUCTS
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    if (selectedCategory !== 'all') list = list.filter(p => p.category === selectedCategory)
    if (selectedDiscipline !== 'all') list = list.filter(p => p.disciplines?.includes(selectedDiscipline))
    list = list.filter(p => p.price_cents >= priceRange[0] && p.price_cents <= priceRange[1])
    switch (sort) {
      case 'price_asc':  return [...list].sort((a, b) => a.price_cents - b.price_cents)
      case 'price_desc': return [...list].sort((a, b) => b.price_cents - a.price_cents)
      case 'rating':     return [...list].sort((a, b) => b.rating - a.rating)
      default:           return [...list].sort((a, b) => b.reviews - a.reviews)
    }
  }, [search, selectedCategory, selectedDiscipline, sort, priceRange])

  const stats = [
    { icon: ShoppingBag, label: 'Produits premium', value: `${PRODUCTS.length}+` },
    { icon: Star, label: 'Note moyenne', value: '4.8/5' },
    { icon: TrendingUp, label: 'Clients satisfaits', value: '12 000+' },
    { icon: Zap, label: 'Livraison express', value: '24-48h' },
  ]

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,69,0,0.15),transparent)]" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-sport-orange/5 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-sport-lime/5 blur-2xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-sport-orange/30 bg-sport-orange/10 px-4 py-1.5 text-xs font-black text-sport-orange uppercase tracking-wider mb-6">
              🛒 Boutique Officielle XENOTIF®
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl mb-4">
              Équipements <span className="text-sport-orange">&</span><br />
              <span className="text-sport-orange">Programmes</span> Premium
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-sport-gray max-w-2xl mx-auto mb-10">
              Des équipements pro, des suppléments éprouvés et des programmes créés par nos coachs certifiés — tout pour atteindre tes objectifs.
            </motion.p>

            {/* Search bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mx-auto max-w-2xl">
              <div className="relative flex items-center gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sport-gray" />
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher kettlebell, whey, programme HIIT..."
                    className="w-full rounded-2xl border border-sport-border bg-sport-card pl-12 pr-4 py-4 text-white placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors text-sm"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-sport-gray hover:text-white">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button onClick={() => setShowFilters(f => !f)}
                  className={`flex items-center gap-2 rounded-2xl border px-5 py-4 text-sm font-bold transition-all ${showFilters ? 'border-sport-orange bg-sport-orange/15 text-sport-orange' : 'border-sport-border bg-sport-card text-sport-gray hover:text-white'}`}>
                  <SlidersHorizontal size={16} />
                  Filtres
                </button>
              </div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-sport-border bg-sport-card/50 px-4 py-3">
                <Icon size={16} className="text-sport-orange shrink-0" />
                <div>
                  <p className="text-sm font-black text-white">{value}</p>
                  <p className="text-[10px] text-sport-gray">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-sport-border bg-sport-card/30 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-sport-gray">
            {['🔒 Paiement 100% sécurisé SSL', '🚚 Livraison offerte dès 50€', '📥 Téléchargement instantané', '↩️ Retours 30 jours', '✓ Produits testés & approuvés'].map(b => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-sport-border bg-sport-card/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Catégories */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-3">Catégorie</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-sport-orange text-white' : 'border border-sport-border text-sport-gray hover:text-white'}`}>
                        {cat === 'all' ? '🌟 Tous' : `${CATEGORY_ICONS[cat] ?? ''} ${cat}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discipline */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-3">Discipline</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedDiscipline('all')}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${selectedDiscipline === 'all' ? 'bg-sport-orange text-white' : 'border border-sport-border text-sport-gray hover:text-white'}`}>
                      Toutes
                    </button>
                    {DISCIPLINES.map(d => (
                      <button key={d.id} onClick={() => setSelectedDiscipline(d.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${selectedDiscipline === d.id ? 'bg-sport-orange text-white' : 'border border-sport-border text-sport-gray hover:text-white'}`}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tri */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-3">Trier par</p>
                  <select value={sort} onChange={e => setSort(e.target.value)}
                    className="w-full rounded-xl border border-sport-border bg-sport-card px-3 py-2 text-sm text-white focus:outline-none focus:border-sport-orange">
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* Résumé */}
                <div className="flex flex-col justify-end">
                  <button onClick={() => { setSelectedCategory('all'); setSelectedDiscipline('all'); setSearch(''); setSort('popular') }}
                    className="rounded-xl border border-sport-border px-4 py-2 text-xs font-bold text-sport-gray hover:text-white transition-colors">
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        {/* Count + sort mobile */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-semibold text-sport-gray">
            <span className="font-black text-white">{filtered.length}</span> produit{filtered.length !== 1 ? 's' : ''}
            {search && <span> pour &quot;{search}&quot;</span>}
          </p>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="rounded-xl border border-sport-border bg-sport-card px-3 py-2 text-xs text-white focus:outline-none sm:hidden">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-black text-white mb-2">Aucun produit trouvé</h2>
            <p className="text-sport-gray">Essaie avec d&apos;autres termes ou réinitialise les filtres.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}

        {/* Amazon disclaimer */}
        {filtered.some(p => p.isAffiliate) && (
          <div className="mt-12 rounded-2xl border border-sport-border bg-sport-card/30 p-4 text-center">
            <p className="text-xs text-sport-gray">
              🔗 Certains produits sont des liens affiliés Amazon. En achetant via ces liens, tu soutiens Xenotif® sans coût supplémentaire pour toi.
              Les prix et disponibilités peuvent varier selon Amazon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
