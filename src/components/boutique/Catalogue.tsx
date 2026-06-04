'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Search, X, ArrowLeft } from 'lucide-react'
import { ProductCard } from '@/components/boutique/ProductCard'
import { getProductsLocalized } from '@/lib/boutique/products.en'

const SORT_VALUES = ['popular', 'price_asc', 'price_desc', 'rating'] as const

// Page « Catalogue » : TOUS les produits en une seule liste (sans filtre par
// catégorie). Recherche + tri uniquement.
export function Catalogue() {
  const t = useTranslations('boutique')
  const locale = useLocale()
  const products = getProductsLocalized(locale)

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')

  const list = useMemo(() => {
    let l = products
    if (search) {
      const q = search.toLowerCase()
      l = l.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(tag => tag.toLowerCase().includes(q)))
    }
    switch (sort) {
      case 'price_asc':  return [...l].sort((a, b) => a.price_cents - b.price_cents)
      case 'price_desc': return [...l].sort((a, b) => b.price_cents - a.price_cents)
      case 'rating':     return [...l].sort((a, b) => b.rating - a.rating)
      default:           return [...l].sort((a, b) => b.reviews - a.reviews)
    }
  }, [products, search, sort])

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,69,0,0.15),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-sport-gray hover:text-white transition-colors mb-8">
            <ArrowLeft size={14} /> {t('catalogue.back')}
          </Link>

          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-sport-orange/30 bg-sport-orange/10 px-4 py-1.5 text-xs font-black text-sport-orange uppercase tracking-wider mb-6">
              {t('catalogue.badge')}
            </span>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
              {t.rich('catalogue.title', { o: (c) => <span className="text-sport-orange">{c}</span> })}
            </h1>
            <p className="text-lg text-sport-gray max-w-2xl mx-auto">{t('catalogue.subtitle')}</p>
          </div>

          {/* Search + sort */}
          <div className="mx-auto max-w-2xl flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sport-gray" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full rounded-2xl border border-sport-border bg-sport-card pl-12 pr-10 py-4 text-white placeholder:text-sport-gray focus:outline-none focus:border-sport-orange transition-colors text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} aria-label={t('reset')} className="absolute right-4 top-1/2 -translate-y-1/2 text-sport-gray hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>
            <select
              value={sort} onChange={e => setSort(e.target.value)}
              aria-label={t('filterSort')}
              className="rounded-2xl border border-sport-border bg-sport-card px-4 py-4 text-sm text-white focus:outline-none focus:border-sport-orange"
            >
              {SORT_VALUES.map(v => <option key={v} value={v}>{t(`sort.${v}`)}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Grille complète */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <p className="text-sm font-semibold text-sport-gray mb-8">
          <span className="font-black text-white">{t('count', { count: list.length })}</span>
          {search && <span> {t('forSearch', { q: search })}</span>}
        </p>

        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-black text-white mb-2">{t('emptyTitle')}</h2>
            <p className="text-sport-gray">{t('emptyDesc')}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}

        {/* Amazon disclaimer */}
        {list.some(p => p.isAffiliate) && (
          <div className="mt-12 rounded-2xl border border-sport-border bg-sport-card/30 p-4 text-center">
            <p className="text-xs text-sport-gray">{t('amazonDisclaimer')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
