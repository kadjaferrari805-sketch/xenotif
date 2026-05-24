'use client'

import { motion, type Variants } from 'framer-motion'
import { Zap, Users, Trophy, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TRUST_ITEMS } from '@/lib/constants'

const FLOAT_BADGES = [
  { Icon: Zap, label: 'HIIT Pro', colorClass: 'text-sport-orange', pos: 'top-4 -right-6 md:-right-14' },
  { Icon: Users, label: '+12K membres', colorClass: 'text-sport-blue', pos: 'bottom-12 -right-4 md:-right-12' },
  { Icon: Trophy, label: 'Coaching IA', colorClass: 'text-sport-lime', pos: 'bottom-2 -left-4 md:-left-14' },
]

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export function Hero() {
  return (
    <section className="relative bg-sport-dark min-h-[90vh] flex items-center overflow-hidden py-20 px-6">
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-sport-orange/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sport-blue/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={itemVariant}
            className="inline-flex items-center gap-2 border border-sport-orange/30 bg-sport-orange/10 text-sport-orange text-[11px] font-bold tracking-[2px] uppercase px-4 py-2 rounded-full mb-6"
          >
            <Zap size={11} />
            Performance · Endurance · Dépassement
          </motion.span>

          <motion.h1
            variants={itemVariant}
            className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-6 tracking-tight"
          >
            FORGE TON{' '}
            <span className="text-sport-orange">CORPS.</span>
            <br />
            DÉPASSE TES{' '}
            <span className="text-sport-lime">LIMITES.</span>
          </motion.h1>

          <motion.p variants={itemVariant} className="text-sport-gray text-base leading-relaxed mb-8 max-w-md">
            Xenotif est la plateforme sport ultime — 50+ programmes sur mesure, coaching IA, 8
            disciplines. Rejoins 12 000+ athlètes qui transforment leur corps chaque jour.
          </motion.p>

          <motion.div variants={itemVariant} className="flex flex-wrap gap-3 mb-8">
            <Button variant="primary">
              Rejoindre maintenant <ArrowRight size={15} className="inline ml-1.5" />
            </Button>
            <Button variant="secondary">Voir les programmes</Button>
          </motion.div>

          <motion.div variants={itemVariant} className="flex flex-wrap gap-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-sport-gray">
                <span className="w-1.5 h-1.5 rounded-full bg-sport-orange shrink-0" />
                <strong className="text-white">{item.label}</strong>
                <span>{item.sublabel}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative w-72 h-72"
          >
            <div className="absolute inset-0 rounded-full border border-sport-border flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-sport-orange/20 to-sport-blue/20 border border-sport-border flex items-center justify-center">
                <span className="text-7xl font-black text-white/10 select-none">X</span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 rounded-full border border-dashed border-sport-orange/20"
            />
            {FLOAT_BADGES.map(({ Icon, label, colorClass, pos }) => (
              <div
                key={label}
                className={`absolute ${pos} flex items-center gap-2 bg-sport-card border border-sport-border rounded-xl px-3 py-2 shadow-xl text-xs font-bold whitespace-nowrap ${colorClass}`}
              >
                <Icon size={13} />
                <span className="text-white">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
