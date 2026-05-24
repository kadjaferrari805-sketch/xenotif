'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Activity, Dumbbell, Zap, Bike, Waves, Flame } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FEATURES } from '@/lib/constants'

const ICON_MAP: Record<string, React.ReactNode> = {
  running: <Activity size={22} />,
  dumbbell: <Dumbbell size={22} />,
  zap: <Zap size={22} />,
  bike: <Bike size={22} />,
  waves: <Waves size={22} />,
  flame: <Flame size={22} />,
}

const COLOR_MAP: Record<string, string> = {
  orange: 'text-sport-orange bg-sport-orange/10 border-sport-orange/20',
  blue: 'text-sport-blue bg-sport-blue/10 border-sport-blue/20',
  lime: 'text-sport-lime bg-sport-lime/10 border-sport-lime/20',
}

const TAG_MAP: Record<string, string> = {
  orange: 'bg-sport-orange/10 text-sport-orange',
  blue: 'bg-sport-blue/10 text-sport-blue',
  lime: 'bg-sport-lime/10 text-sport-lime',
}

export function Features() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="disciplines" className="py-20 px-6 bg-sport-dark">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Disciplines"
          title="8 disciplines. 1 plateforme."
          subtitle="Du cardio à la force — chaque sport, chaque niveau, chaque objectif"
        />
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-sport-card border border-sport-border rounded-2xl p-6 hover:border-sport-orange/40 hover:-translate-y-1 transition-all duration-200"
            >
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${COLOR_MAP[feat.color]}`}
              >
                {ICON_MAP[feat.icon]}
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-sport-gray leading-relaxed mb-4">{feat.description}</p>
              <span
                className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full ${TAG_MAP[feat.color]}`}
              >
                {feat.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
