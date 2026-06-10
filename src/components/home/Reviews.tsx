'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Star, Quote, CheckCircle, TrendingUp } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tilt3D } from '@/components/premium/Tilt3D'
import { REVIEWS } from '@/lib/constants'

const AVATAR_BG: Record<string, string> = {
  orange: 'bg-gradient-to-br from-sport-orange to-orange-700',
  blue:   'bg-gradient-to-br from-sport-blue to-blue-700',
  lime:   'bg-gradient-to-br from-sport-lime to-lime-400 text-[#0A0B0F]',
}

const BORDER_HOVER: Record<string, string> = {
  orange: 'hover:border-sport-orange/40',
  blue:   'hover:border-sport-blue/40',
  lime:   'hover:border-sport-lime/30',
}

type ReviewText = { sport: string; date: string; text: string }
type SummaryStat = { value: string; label: string }

export function Reviews() {
  const t = useTranslations('home.reviews')
  const items = t.raw('items') as ReviewText[]
  const results = t.raw('results') as string[]
  const summaryStats = t.raw('summary.stats') as SummaryStat[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section aria-labelledby="avis-title" className="py-24 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="avis-title"
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          {REVIEWS.map((review, i) => (
            <Tilt3D key={review.name} max={11} className="relative h-full rounded-2xl">
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`card-base p-6 h-full flex flex-col transition-all duration-300 hover:shadow-2xl ${BORDER_HOVER[review.color] ?? ''}`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4" aria-label={t('ratingAria', { rating: review.rating })}>
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={13} aria-hidden="true" className="fill-sport-orange text-sport-orange" />
                ))}
              </div>

              {/* Result badge */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full mb-4 w-fit">
                <TrendingUp size={10} aria-hidden="true" />
                {results[i]}
              </div>

              {/* Quote */}
              <Quote size={22} aria-hidden="true" className="text-sport-orange/20 mb-3 shrink-0" />

              <blockquote className="text-sm text-sport-gray leading-relaxed flex-1 mb-6">
                {items[i].text}
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-3 pt-5 border-t border-sport-border">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm shrink-0 text-white shadow-md ${AVATAR_BG[review.color] ?? AVATAR_BG.orange}`}
                  aria-hidden="true"
                >
                  {review.initial}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white leading-tight">{review.name}</p>
                  <p className="text-[10px] text-sport-gray mt-0.5">{items[i].sport}</p>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold shrink-0">
                  <CheckCircle size={11} aria-hidden="true" />
                  {t('verified')}
                </div>
              </footer>
            </motion.article>
            </Tilt3D>
          ))}
        </div>

        {/* Global rating summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex gap-0.5 mb-1" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="fill-sport-orange text-sport-orange" />
              ))}
            </div>
            <p className="text-sm text-sport-gray">
              <strong className="text-white text-base">{t('summary.rating')}</strong>{' '}
              {t('summary.basedOn')} <strong className="text-white">{t('summary.count')}</strong> {t('summary.reviews')}
            </p>
          </div>

          <div className="hidden sm:block w-px h-10 bg-sport-border" aria-hidden="true" />

          <div className="flex gap-6 text-center">
            {summaryStats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-lg font-black text-white">{value}</p>
                <p className="text-[10px] text-sport-gray uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
