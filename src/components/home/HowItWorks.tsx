'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'
import { ArrowRight, UserPlus, Target, Dumbbell, BarChart3 } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tilt3D } from '@/components/premium/Tilt3D'
import { STEPS } from '@/lib/constants'

type StepText = { title: string; description: string }

const STEP_ICONS = [UserPlus, Target, Dumbbell, BarChart3]
const STEP_COLORS = [
  { num: 'text-sport-orange', ring: 'ring-sport-orange/30', bg: 'bg-sport-orange', icon: 'text-sport-orange bg-sport-orange/10' },
  { num: 'text-sport-blue',   ring: 'ring-sport-blue/30',   bg: 'bg-sport-blue',   icon: 'text-sport-blue bg-sport-blue/10' },
  { num: 'text-sport-lime',   ring: 'ring-sport-lime/30',   bg: 'bg-sport-lime',   icon: 'text-sport-lime bg-sport-lime/10' },
  { num: 'text-sport-orange', ring: 'ring-sport-orange/30', bg: 'bg-sport-orange', icon: 'text-sport-orange bg-sport-orange/10' },
]

export function HowItWorks() {
  const t = useTranslations('home.howItWorks')
  const steps = t.raw('steps') as StepText[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="programmes" aria-labelledby="programmes-title" className="py-24 px-6 bg-sport-card border-y border-sport-border relative overflow-hidden">
      {/* Background pattern */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.025]" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px'}} />

      <div className="max-w-6xl mx-auto relative">
        <SectionHeader
          id="programmes-title"
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {STEPS.map((step, i) => {
            const color = STEP_COLORS[i]
            const StepIcon = STEP_ICONS[i]
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col"
              >
                {/* Connector line (desktop only) */}
                {i < STEPS.length - 1 && (
                  <motion.div
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ delay: i * 0.12 + 0.4, duration: 0.6 }}
                    className="hidden lg:block absolute top-6 left-[calc(100%-0px)] w-full h-px bg-gradient-to-r from-white/15 to-transparent origin-left z-0"
                    style={{ width: 'calc(100% + 24px)', left: '50px' }}
                  />
                )}

                {/* Card */}
                <Tilt3D max={12} className="relative h-full rounded-2xl">
                <div className="bg-sport-dark border border-sport-border rounded-2xl p-6 h-full hover:border-sport-border/80 transition-all group">
                  {/* Step number + icon */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`relative w-12 h-12 rounded-full ${color.bg} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg ring-4 ${color.ring}`}>
                      {step.num}
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.icon}`}>
                      <StepIcon size={18} aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{steps[i].title}</h3>
                  <p className="text-xs text-sport-gray leading-relaxed">{steps[i].description}</p>
                </div>
                </Tilt3D>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/auth/signup" className="btn-primary shadow-xl shadow-sport-orange/25 hover:shadow-sport-orange/40 hover:scale-[1.02] active:scale-95">
            {t('cta')} <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <p className="text-[11px] text-sport-gray mt-3">{t('ctaNote')}</p>
        </motion.div>
      </div>
    </section>
  )
}
