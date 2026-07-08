'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { ClipboardList, Sparkles, TrendingUp } from 'lucide-react'

// Section « 3 cartes » façon Strava : ce que tu obtiens concrètement (programmes,
// coach IA, suivi). Structure (icône) constante ; textes → home.featureCards.cards.
const CARD_STYLE = [ClipboardList, Sparkles, TrendingUp]

type Card = { title: string; desc: string }

export function FeatureCards() {
  const t = useTranslations('home.featureCards')
  const cards = t.raw('cards') as Card[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section aria-labelledby="features-title" className="py-24 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-black tracking-[3px] uppercase text-sport-orange mb-3">{t('eyebrow')}</p>
          <h2 id="features-title" className="text-3xl md:text-5xl font-black text-white">{t('title')}</h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARD_STYLE.map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-sport-card border border-sport-border rounded-2xl p-7 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-2xl border border-sport-orange/25 bg-sport-orange/10 flex items-center justify-center">
                <Icon size={22} aria-hidden="true" className="text-sport-orange" />
              </div>
              <h3 className="text-xl font-black text-white">{cards[i].title}</h3>
              <p className="text-sm text-sport-gray leading-relaxed">{cards[i].desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
