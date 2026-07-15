'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { ClipboardList, Sparkles, TrendingUp } from 'lucide-react'

// Section « 3 cartes » façon Strava : créative de marque en haut + icône
// superposée + texte. Les 3 images sont de vrais recadrages du mockup app
// (public/pub/coach-poche-<locale>.webp, source non recadrée) : écran
// d'accueil, programmes, objectifs/progression - voir public/home/feature-*.
const CARDS = [
  { Icon: ClipboardList, imgKey: 'programmes' },
  { Icon: Sparkles, imgKey: 'coach' },
  { Icon: TrendingUp, imgKey: 'progression' },
]

type Card = { title: string; desc: string }

export function FeatureCards() {
  const t = useTranslations('home.featureCards')
  const locale = useLocale()
  const cards = t.raw('cards') as Card[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section aria-labelledby="features-title" className="section-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-black tracking-[3px] uppercase text-sport-orange mb-3">{t('eyebrow')}</p>
          <h2 id="features-title" className="text-3xl md:text-5xl font-black text-sport-fg">{t('title')}</h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map(({ Icon, imgKey }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-sport-card border border-sport-border rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={`/home/feature-${imgKey}-${locale}.webp`}
                  alt={cards[i].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sport-card via-sport-card/15 to-transparent" />
                <div className="absolute bottom-3 left-3 w-11 h-11 rounded-2xl border border-sport-orange/30 bg-sport-dark/80 backdrop-blur flex items-center justify-center">
                  <Icon size={20} aria-hidden="true" className="text-sport-orange" />
                </div>
              </div>
              <div className="p-6 flex flex-col gap-3">
                <h3 className="text-xl font-black text-sport-fg">{cards[i].title}</h3>
                <p className="text-sm text-sport-gray leading-relaxed">{cards[i].desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
