'use client'

import { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { Zap, ShoppingBag, Star, TrendingUp, ArrowRight, LayoutGrid } from 'lucide-react'
import { ProductCard } from '@/components/boutique/ProductCard'
import { getProductsLocalized } from '@/lib/boutique/products.en'

export default function BoutiquePage() {
  const t = useTranslations('boutique')
  const locale = useLocale()
  const products = getProductsLocalized(locale)

  // Best-sellers : les 8 produits les plus notés/populaires (pas tout le catalogue).
  const bestsellers = useMemo(
    () => [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8),
    [products],
  )

  const stats = [
    { icon: ShoppingBag, label: t('stats.products'), value: `${products.length}+` },
    { icon: Star, label: t('stats.rating'), value: '4.8/5' },
    { icon: TrendingUp, label: t('stats.customers'), value: t('stats.customersValue') },
    { icon: Zap, label: t('stats.delivery'), value: '24–48h' },
  ]

  return (
    <div className="min-h-screen bg-sport-dark overflow-x-hidden">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-24 pb-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,69,0,0.15),transparent)]" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-sport-orange/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-sport-orange/30 bg-sport-orange/10 px-4 py-1.5 text-xs font-black text-sport-orange uppercase tracking-wider mb-6">
              {t('badge')}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl mb-4 px-2">
              {t.rich('heroTitle', { o: (c) => <span className="text-sport-orange">{c}</span>, br: () => <br /> })}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-sport-gray max-w-2xl mx-auto mb-9">
              {t('heroSubtitle')}
            </motion.p>

            {/* CTA principal → catalogue complet */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/boutique/catalogue"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-sport-orange px-7 py-3.5 text-sm font-bold text-white hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/25">
                <LayoutGrid size={16} /> {t('catalogue.link')} <ArrowRight size={15} />
              </Link>
              <a href="#bestsellers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-sport-border bg-sport-card px-7 py-3.5 text-sm font-bold text-white hover:border-white/20 transition-all">
                {t('landing.bestsellersTitle')}
              </a>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-sport-border bg-sport-card/50 px-4 py-3">
                <Icon size={16} className="text-sport-orange shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-black text-white">{value}</p>
                  <p className="text-[10px] text-sport-gray truncate">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-sport-border bg-sport-card/30 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-sport-gray">
            {(t.raw('trust') as string[]).map(b => <span key={b}>{b}</span>)}
          </div>
        </div>
      </div>

      {/* ─── Best-sellers ─── */}
      <section id="bestsellers" className="mx-auto max-w-7xl px-4 sm:px-6 py-14 scroll-mt-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{t('landing.bestsellersTitle')}</h2>
            <p className="text-sport-gray text-sm">{t('landing.bestsellersSubtitle')}</p>
          </div>
          <Link href="/boutique/catalogue" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-sport-orange hover:underline whitespace-nowrap">
            {t('catalogue.seeAll')}
          </Link>
        </div>
        {/* Mobile : carrousel horizontal full-bleed (swipe fluide, snap, défilement
            rapide — pas de scroll-snap-stop pour laisser filer les flicks).
            sm+ : grille e-commerce classique. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 disc-scroll scroll-smooth sm:mx-0 sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bestsellers.map((p, i) => (
            <div key={p.id} className="w-[78%] min-[440px]:w-[300px] shrink-0 snap-start sm:w-auto">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA final → catalogue ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/20 via-sport-card to-sport-card p-8 sm:p-12 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sport-orange/10 blur-3xl" />
          <h2 className="relative text-2xl sm:text-3xl font-black text-white mb-3">{t('landing.ctaTitle')}</h2>
          <p className="relative text-sport-gray text-sm sm:text-base max-w-xl mx-auto mb-7">{t('landing.ctaText')}</p>
          <Link href="/boutique/catalogue"
            className="relative inline-flex items-center justify-center gap-2 rounded-full bg-sport-orange px-8 py-4 text-sm font-bold text-white hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/30">
            <LayoutGrid size={16} /> {t('catalogue.link')} <ArrowRight size={15} />
          </Link>
        </div>

        {/* Amazon disclaimer */}
        <div className="mt-10 rounded-2xl border border-sport-border bg-sport-card/30 p-4 text-center">
          <p className="text-xs text-sport-gray">{t('amazonDisclaimer')}</p>
        </div>
      </section>
    </div>
  )
}
