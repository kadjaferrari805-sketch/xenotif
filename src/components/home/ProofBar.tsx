'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { STATS } from '@/lib/constants'

export function ProofBar() {
  const { ref, inView } = useInView({ triggerOnce: true })

  return (
    <div ref={ref} className="bg-sport-card border-y border-sport-border py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-around gap-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <span className="text-3xl font-black text-sport-orange">{stat.value}</span>
            <span className="text-xs text-sport-gray font-medium uppercase tracking-wider">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
