'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Users, BookOpen, Layers, Star } from 'lucide-react'

const STATS = [
  { Icon: Users, value: '12 000+', label: 'Athlètes actifs', sublabel: 'dans le monde entier' },
  { Icon: BookOpen, value: '50+', label: 'Programmes', sublabel: 'tous niveaux' },
  { Icon: Layers, value: '6', label: 'Disciplines', sublabel: 'sport complet' },
  { Icon: Star, value: '4.9 / 5', label: 'Satisfaction', sublabel: '3 200+ avis vérifiés' },
]

export function ProofBar() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section aria-label="Chiffres clés" className="bg-sport-card border-y border-sport-border py-14 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center gap-1.5"
            >
              <div
                aria-hidden="true"
                className="w-11 h-11 rounded-xl bg-sport-orange/10 border border-sport-orange/20 flex items-center justify-center mb-2"
              >
                <stat.Icon size={18} className="text-sport-orange" />
              </div>
              <dt className="text-3xl font-black text-white">{stat.value}</dt>
              <dd className="text-xs font-bold text-white uppercase tracking-widest">{stat.label}</dd>
              <span className="text-[11px] text-sport-gray">{stat.sublabel}</span>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  )
}
