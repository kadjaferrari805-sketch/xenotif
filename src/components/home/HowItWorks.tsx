'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { STEPS } from '@/lib/constants'

export function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="programmes" aria-labelledby="programmes-title" className="py-24 px-6 bg-sport-card border-y border-sport-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="programmes-title"
          label="Comment ça marche"
          title="Commence en 4 étapes"
          subtitle="De l'inscription à tes premiers résultats — simple, rapide, efficace"
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative flex flex-col"
            >
              {/* Step number + connector line */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-sport-orange flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-sport-orange/30">
                  {step.num}
                </div>
                {i < STEPS.length - 1 && (
                  <div aria-hidden="true" className="hidden lg:block flex-1 h-px bg-gradient-to-r from-sport-orange/30 to-sport-border" />
                )}
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-sport-gray leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/#newsletter" className="btn-primary shadow-lg shadow-sport-orange/20">
            Commencer maintenant <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <p className="text-[11px] text-sport-gray mt-3">Gratuit · Sans engagement · Sans carte bancaire</p>
        </motion.div>
      </div>
    </section>
  )
}
