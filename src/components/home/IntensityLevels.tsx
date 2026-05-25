'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const LEVELS = [
  {
    id: 'debutant',
    label: 'Débutant',
    emoji: '🌱',
    desc: 'Pour ceux qui commencent ou reprennent le sport. Séances courtes, progressives, jamais décourageantes.',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bar: 'bg-emerald-500',
    width: '25%',
    detail: 'Dès 20 min / séance',
  },
  {
    id: 'intermediaire',
    label: 'Intermédiaire',
    emoji: '⚡',
    desc: '6 mois de pratique régulière. Montée en charge progressive, nouveaux records personnels chaque mois.',
    border: 'border-sport-blue/30',
    text: 'text-sport-blue',
    bar: 'bg-sport-blue',
    width: '55%',
    detail: '3 à 4× / semaine',
  },
  {
    id: 'avance',
    label: 'Avancé',
    emoji: '🔥',
    desc: 'Athlètes confirmés. Programmes périodisés, haute intensité, récupération optimisée.',
    border: 'border-sport-orange/30',
    text: 'text-sport-orange',
    bar: 'bg-sport-orange',
    width: '80%',
    detail: '5× / semaine',
  },
  {
    id: 'elite',
    label: 'Élite',
    emoji: '🏆',
    desc: 'Compétiteurs et semi-pros. Planification annuelle, coaching individuel, suivi biomécanique complet.',
    border: 'border-sport-lime/30',
    text: 'text-sport-lime',
    bar: 'bg-sport-lime',
    width: '100%',
    detail: '6 à 7× / semaine',
  },
]

export function IntensityLevels() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section aria-labelledby="niveaux-title" className="py-24 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="niveaux-title"
          label="Niveaux"
          title="Un programme pour chaque athlète"
          subtitle="De débutant à élite — Xenotif® s'adapte à toi, pas l'inverse"
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {LEVELS.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`bg-sport-card border rounded-2xl p-6 flex flex-col gap-4 ${level.border}`}
            >
              <div className="text-3xl" aria-hidden="true">{level.emoji}</div>
              <div>
                <h3 className={`font-black text-base mb-1.5 ${level.text}`}>{level.label}</h3>
                <p className="text-xs text-sport-gray leading-relaxed">{level.desc}</p>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-sport-gray uppercase tracking-wider">Intensité</span>
                  <span className={`text-[10px] font-bold ${level.text}`}>{level.width}</span>
                </div>
                <div
                  className="h-1.5 bg-sport-border rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label={`Intensité ${level.label}`}
                  aria-valuenow={parseInt(level.width)}
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

              <p className={`text-[11px] font-bold ${level.text}`}>{level.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-10"
        >
          <Link href="/#tarifs" className="text-sm text-sport-orange hover:underline inline-flex items-center gap-1 font-bold">
            Voir les tarifs <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
