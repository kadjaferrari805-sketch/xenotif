'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Dumbbell, ShieldCheck, Sparkles } from 'lucide-react'

// Section « Pourquoi Xenotif » — 3 piliers à voix de marque tranchée (inspiré du
// « no BS network » de Strava). Positionne Xenotif contre les apps de comptage.
// Structure (icône) constante ; textes → home.whyXenotif.pillars.
const PILLAR_STYLE = [
  { Icon: Dumbbell,    tint: 'text-sport-orange', ring: 'border-sport-orange/25 bg-sport-orange/10' },
  { Icon: ShieldCheck, tint: 'text-sport-lime',   ring: 'border-sport-lime/25 bg-sport-lime/10' },
  { Icon: Sparkles,    tint: 'text-sport-blue',   ring: 'border-sport-blue/25 bg-sport-blue/10' },
]

type Pillar = { title: string; desc: string }

export function WhyXenotif() {
  const t = useTranslations('home.whyXenotif')
  const pillars = t.raw('pillars') as Pillar[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section aria-labelledby="why-title" className="py-24 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-black tracking-[3px] uppercase text-sport-orange mb-3">{t('eyebrow')}</p>
          <h2 id="why-title" className="text-3xl md:text-5xl font-black text-white">{t('title')}</h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLAR_STYLE.map(({ Icon, tint, ring }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-sport-card border border-sport-border rounded-2xl p-7 flex flex-col gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${ring}`}>
                <Icon size={22} aria-hidden="true" className={tint} />
              </div>
              <h3 className="text-xl font-black text-white">{pillars[i].title}</h3>
              <p className="text-sm text-sport-gray leading-relaxed">{pillars[i].desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
