'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { STEPS } from '@/lib/constants'

export function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="programmes" className="py-20 px-6 bg-sport-card border-y border-sport-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Processus"
          title="Comment rejoindre Xenotif"
          subtitle="4 étapes pour transformer ton entraînement pour toujours"
        />
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-sport-orange flex items-center justify-center text-white font-black text-sm shrink-0">
                  {step.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block flex-1 h-px bg-sport-border" />
                )}
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-sport-gray leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
