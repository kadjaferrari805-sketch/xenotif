'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Search, X, ArrowLeft, ArrowDownNarrowWide } from 'lucide-react'
import { ProductCard } from '@/components/boutique/ProductCard'
import { getProductsLocalized } from '@/lib/boutique/products.en'
import type { Product } from '@/lib/boutique/products'

// Ordre d'affichage des disciplines (sport).
const DISCIPLINE_ORDER = [
  'musculation', 'running-cardio', 'cyclisme', 'natation',
  'hiit', 'crossfit', 'yoga', 'boxing', 'stretching',
] as const

const SORT_VALUES = ['popular', 'price_asc', 'price_desc', 'rating'] as const

function sortProducts(list: Product[], sort: string): Product[] {
  switch (sort) {
    case 'price_asc':  return [...list].sort((a, b) => a.price_cents - b.price_cents)
    case 'price_desc': return [...list].sort((a, b) => b.price_cents - a.price_cents)
    case 'rating':     return [...list].sort((a, b) => b.rating - a.rating)
    default:           return [...list].sort((a, b) => b.reviews - a.reviews)
  }
}

const primaryOf = (p: Product) => p.disciplines?.[0] ?? 'autres'

// Catalogue premium (inspiration Zalando/Zara) : produits classés par discipline,
// barre d'outils collante (puces de sport + tri), recherche. « Tous » = sections
// par discipline ; un sport sélectionné = grille filtrée de ce sport.
export function Catalogue() {
  const t = useTranslations('boutique')
  const locale = useLocale()
  const products = getProductsLocalized(locale)

  const [search, setSearch] = useState('')
  const [discipline, setDiscipline] = useState('all')
  const [sort, setSort] = useState('popular')

  // 1. Recherche sur tout le catalogue.
  const searched = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(tag => tag.toLowerCase().includes(q)))
  }, [products, search])

  // 2. Map discipline principale → produits.
  const byDiscipline = useMemo(() => {
    const map = new Map<string, Product[]>()
    for (const p of searched) {
      const d = primaryOf(p)
      const arr = map.get(d)
      if (arr) arr.push(p)
      else map.set(d, [p])
    }
    return map
  }, [searched])

  // 3. Disciplines disponibles (pour les puces), dans l'ordre défini.
  const available = useMemo(
    () => DISCIPLINE_ORDER.filter(d => byDiscipline.has(d)),
    [byDiscipline],
  )

  // 4. Sections (mode « Tous ») triées en interne.
  const sections = useMemo(
    () => available.map(id => ({ id, items: sortProducts(byDiscipline.get(id)!, sort) })),
    [available, byDiscipline, sort],
  )

  // 5. Grille filtrée (un sport sélectionné).
  const flat = useMemo(
    () => (discipline === 'all' ? [] : sortProducts(byDiscipline.get(discipline) ?? [], sort)),
    [discipline, byDiscipline, sort],
  )

  const total = searched.length
  const shown = discipline === 'all' ? total : flat.length

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Hero éditorial */}
      <section className="relative overflow-hidden pt-24 pb-9">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,69,0,0.15),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-sport-gray hover:text-white transition-colors mb-8">
            <ArrowLeft size={14} /> {t('catalogue.back')}
          </Link>

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-sport-orange/30 bg-sport-orange/10 px-4 py-1.5 text-xs font-black text-sport-orange uppercase tracking-wider mb-6">
              {t('catalogue.badge')}
            </span>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
              {t.rich('catalogue.title', { o: (c) => <span className="text-sport-orange">{c}</span> })}
            </h1>
            <p className="text-base sm:text-lg text-sport-gray max-w-2xl mx-auto">{t('catalogue.subtitle')}</p>
          </div>

          {/* Recherche */}
          <div className="mx-auto max-w-2xl relative">
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
        </div>
      </section>

      {/* Barre d'outils collante : puces de discipline + tri (façon Zalando) */}
      <div className="sticky top-16 z-40 border-y border-sport-border bg-sport-dark/90 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-3 py-3">
            {/* Puces de sport */}
            <div className="min-w-0 flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide" role="tablist" aria-label={t('filterDiscipline')}>
              <button
                role="tab" aria-selected={discipline === 'all'} onClick={() => setDiscipline('all')}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-all ${discipline === 'all' ? 'bg-sport-orange text-white shadow-lg shadow-sport-orange/20' : 'border border-sport-border text-sport-gray hover:text-white hover:border-white/20'}`}
              >
                {t('allDisciplines')}
              </button>
              {available.map(id => (
                <button
                  key={id} role="tab" aria-selected={discipline === id} onClick={() => setDiscipline(id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-all ${discipline === id ? 'bg-sport-orange text-white shadow-lg shadow-sport-orange/20' : 'border border-sport-border text-sport-gray hover:text-white hover:border-white/20'}`}
                >
                  {t(`disciplinesFilter.${id}`)}
                </button>
              ))}
            </div>

            {/* Tri */}
            <div className="relative shrink-0">
              <ArrowDownNarrowWide size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sport-gray" />
              <select
                value={sort} onChange={e => setSort(e.target.value)} aria-label={t('filterSort')}
                className="appearance-none rounded-full border border-sport-border bg-sport-card pl-9 pr-8 py-2 text-sm font-semibold text-white focus:outline-none focus:border-sport-orange cursor-pointer"
              >
                {SORT_VALUES.map(v => <option key={v} value={v}>{t(`sort.${v}`)}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <p className="text-sm font-semibold text-sport-gray mb-8">
          <span className="font-black text-white">{t('count', { count: shown })}</span>
          {search && <span> {t('forSearch', { q: search })}</span>}
        </p>

        {shown === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-black text-white mb-2">{t('emptyTitle')}</h2>
            <p className="text-sport-gray">{t('emptyDesc')}</p>
          </div>
        ) : discipline === 'all' ? (
          // Mode « Tous » : sections par discipline
          <div className="space-y-14">
            {sections.map(({ id, items }) => (
              <section key={id} aria-labelledby={`disc-${id}`} className="scroll-mt-32">
                <div className="flex items-baseline gap-3 mb-6 border-b border-sport-border pb-3">
                  <h2 id={`disc-${id}`} className="text-2xl font-black text-white">{t(`disciplinesFilter.${id}`)}</h2>
                  <span className="text-sm font-semibold text-sport-gray">{t('count', { count: items.length })}</span>
                  <button onClick={() => setDiscipline(id)} className="ml-auto text-xs font-bold text-sport-orange hover:underline">
                    {t('catalogue.seeAll')}
                  </button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          // Mode « un sport » : grille filtrée
          <>
            <h2 className="text-2xl font-black text-white mb-6 border-b border-sport-border pb-3">{t(`disciplinesFilter.${discipline}`)}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {flat.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </>
        )}

        {/* Amazon disclaimer */}
        {shown > 0 && (
          <div className="mt-14 rounded-2xl border border-sport-border bg-sport-card/30 p-4 text-center">
            <p className="text-xs text-sport-gray">{t('amazonDisclaimer')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
