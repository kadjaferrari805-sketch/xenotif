'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Search, X, ArrowLeft } from 'lucide-react'
import { ProductCard } from '@/components/boutique/ProductCard'
import { getProductsLocalized } from '@/lib/boutique/products.en'
import type { Product } from '@/lib/boutique/products'

// Ordre d'affichage des sections par discipline (sport).
const DISCIPLINE_ORDER = [
  'musculation', 'running-cardio', 'cyclisme', 'natation',
  'hiit', 'crossfit', 'yoga', 'boxing', 'stretching',
] as const

// Page « Catalogue » : TOUS les produits classés par discipline (sport).
// Chaque produit apparaît sous sa discipline principale (la 1re de sa liste).
export function Catalogue() {
  const t = useTranslations('boutique')
  const locale = useLocale()
  const products = getProductsLocalized(locale)

  const [search, setSearch] = useState('')

  const sections = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = q
      ? products.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(tag => tag.toLowerCase().includes(q)))
      : products

    const byDiscipline = new Map<string, Product[]>()
    for (const p of filtered) {
      const d = p.disciplines?.[0] ?? 'autres'
      const arr = byDiscipline.get(d) ?? []
      arr.push(p)
      byDiscipline.set(d, arr)
    }

    const ordered: { id: string; items: Product[] }[] = []
    for (const id of DISCIPLINE_ORDER) {
      const items = byDiscipline.get(id)
      if (items && items.length) {
        ordered.push({ id, items: [...items].sort((a, b) => b.reviews - a.reviews) })
      }
    }
    return ordered
  }, [products, search])

  const total = useMemo(() => sections.reduce((n, s) => n + s.items.length, 0), [sections])

  return (
    <div className="min-h-screen bg-sport-dark">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,69,0,0.15),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-sport-gray hover:text-white transition-colors mb-8">
            <ArrowLeft size={14} /> {t('catalogue.back')}
          </Link>

          <div className="text-center mb-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-sport-orange/30 bg-sport-orange/10 px-4 py-1.5 text-xs font-black text-sport-orange uppercase tracking-wider mb-6">
              {t('catalogue.badge')}
            </span>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
              {t.rich('catalogue.title', { o: (c) => <span className="text-sport-orange">{c}</span> })}
            </h1>
            <p className="text-lg text-sport-gray max-w-2xl mx-auto">{t('catalogue.subtitle')}</p>
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

      {/* Sections par discipline */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        {total === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-black text-white mb-2">{t('emptyTitle')}</h2>
            <p className="text-sport-gray">{t('emptyDesc')}</p>
          </div>
        ) : (
          <div className="space-y-14">
            {sections.map(({ id, items }) => (
              <section key={id} aria-labelledby={`disc-${id}`} className="scroll-mt-24">
                <div className="flex items-baseline gap-3 mb-6 border-b border-sport-border pb-3">
                  <h2 id={`disc-${id}`} className="text-2xl font-black text-white">
                    {t(`disciplinesFilter.${id}`)}
                  </h2>
                  <span className="text-sm font-semibold text-sport-gray">{t('count', { count: items.length })}</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Amazon disclaimer */}
        {total > 0 && (
          <div className="mt-14 rounded-2xl border border-sport-border bg-sport-card/30 p-4 text-center">
            <p className="text-xs text-sport-gray">{t('amazonDisclaimer')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
