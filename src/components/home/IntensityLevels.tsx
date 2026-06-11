'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tilt3D } from '@/components/premium/Tilt3D'

// Style structurel par niveau (emoji, couleurs, largeur de barre). Les textes
// (label, desc, detail) viennent de messages → home.intensity.levels.
const LEVEL_STYLE = [
  { id: 'debutant',      emoji: '🌱', border: 'border-emerald-500/30',  text: 'text-emerald-400', bar: 'bg-emerald-500',  width: '25%' },
  { id: 'intermediaire', emoji: '⚡', border: 'border-sport-blue/30',   text: 'text-sport-blue',  bar: 'bg-sport-blue',   width: '55%' },
  { id: 'avance',        emoji: '🔥', border: 'border-sport-orange/30', text: 'text-sport-orange', bar: 'bg-sport-orange', width: '80%' },
  { id: 'elite',         emoji: '🏆', border: 'border-sport-lime/30',   text: 'text-sport-lime',  bar: 'bg-sport-lime',   width: '100%' },
]

type LevelText = { label: string; desc: string; detail: string }

export function IntensityLevels() {
  const t = useTranslations('home.intensity')
  const levels = t.raw('levels') as LevelText[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section aria-labelledby="niveaux-title" className="py-24 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="niveaux-title"
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {LEVEL_STYLE.map((level, i) => (
            <Tilt3D key={level.id} max={12} className="relative h-full rounded-2xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`bg-sport-card border rounded-2xl p-6 h-full flex flex-col gap-4 ${level.border}`}
            >
              <div className="text-3xl" aria-hidden="true">{level.emoji}</div>
              <div>
                <h3 className={`font-black text-base mb-1.5 ${level.text}`}>{levels[i].label}</h3>
                <p className="text-xs text-sport-gray leading-relaxed">{levels[i].desc}</p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-sport-gray uppercase tracking-wider">{t('intensityLabel')}</span>
                  <span className={`text-[10px] font-bold ${level.text}`}>{level.width}</span>
                </div>
                <div
                  className="h-1.5 bg-sport-border rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label={`${t('intensityLabel')} ${levels[i].label}`}
                  aria-valuenow={parseInt(level.width.replace('%', ''), 10)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: level.width } : {}}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${level.bar}`}
                  />
                </div>
              </div>

              <p className={`text-[11px] font-bold ${level.text}`}>{levels[i].detail}</p>
            </motion.div>
            </Tilt3D>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-10"
        >
          <Link href="/#tarifs" className="text-sm text-sport-orange hover:underline inline-flex items-center gap-1 font-bold">
            {t('seePricing')} <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
