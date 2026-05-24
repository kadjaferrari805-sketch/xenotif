'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SectionHeader } from '@/components/ui/SectionHeader'

const LEVELS = [
  {
    id: 'debutant',
    label: 'Débutant',
    emoji: '🌱',
    desc: 'Pour ceux qui commencent ou reprennent le sport. Séances courtes, progressives, jamais décourageantes.',
    border: 'border-emerald-500/40',
    text: 'text-emerald-400',
    bar: 'bg-emerald-500',
    width: '25%',
  },
  {
    id: 'intermediaire',
    label: 'Intermédiaire',
    emoji: '⚡',
    desc: '6 mois de pratique régulière. Montée en charge progressive, nouveaux records personnels chaque mois.',
    border: 'border-sport-blue/40',
    text: 'text-sport-blue',
    bar: 'bg-sport-blue',
    width: '55%',
  },
  {
    id: 'avance',
    label: 'Avancé',
    emoji: '🔥',
    desc: 'Athlètes confirmés. Programmes périodisés, haute intensité, récupération optimisée.',
    border: 'border-sport-orange/40',
    text: 'text-sport-orange',
    bar: 'bg-sport-orange',
    width: '80%',
  },
  {
    id: 'elite',
    label: 'Élite',
    emoji: '🏆',
    desc: 'Compétiteurs et semi-pros. Planification annuelle, coaching individuel, suivi biomécanique complet.',
    border: 'border-sport-lime/40',
    text: 'text-sport-lime',
    bar: 'bg-sport-lime',
    width: '100%',
  },
]

export function IntensityLevels() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-20 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Niveaux"
          title="Un programme pour chaque athlète"
          subtitle="De débutant à élite — Xenotif s'adapte à toi, pas l'inverse"
        />
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
        >
          {LEVELS.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`bg-sport-card border rounded-2xl p-6 ${level.border}`}
            >
              <div className="text-3xl mb-3">{level.emoji}</div>
              <h3 className={`font-black text-base mb-2 ${level.text}`}>{level.label}</h3>
              <p className="text-xs text-sport-gray leading-relaxed mb-4">{level.desc}</p>
              <div className="h-1.5 bg-sport-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: level.width } : {}}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${level.bar}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
