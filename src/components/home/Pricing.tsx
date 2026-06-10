'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { CheckCircle, ArrowRight, Zap } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tilt3D } from '@/components/premium/Tilt3D'

type PlanId = 'gratuit' | 'pro' | 'elite'
type Period = 'monthly' | 'annual'

// Données structurelles (id, prix, mise en avant). Les textes (nom, période,
// badge, description, fonctionnalités, CTA) viennent de messages → home.pricing.plans.
const PLANS: { id: PlanId; priceMonthly: string; priceAnnual: string; totalAnnual?: string; highlight: boolean }[] = [
  { id: 'gratuit', priceMonthly: '0 €',     priceAnnual: '0 €',     highlight: false },
  { id: 'pro',     priceMonthly: '9,99 €',  priceAnnual: '7,99 €',  totalAnnual: '95,88 €',  highlight: true },
  { id: 'elite',   priceMonthly: '24,99 €', priceAnnual: '19,99 €', totalAnnual: '239,88 €', highlight: false },
]

type PlanText = { name: string; period: string; badge: string; description: string; cta: string; features: string[] }

function PlanButton({
  planId,
  name,
  cta,
  highlight,
  period,
}: {
  planId: PlanId
  name: string
  cta: string
  highlight: boolean
  period: Period
}) {
  const router = useRouter()
  const t = useTranslations('home.pricing')

  return (
    <button
      onClick={() => router.push(`/auth/signup?plan=${planId}${period === 'annual' ? '&period=annual' : ''}`)}
      aria-label={t('subscribeAria', { name })}
      className={`w-full py-3.5 px-6 rounded-full font-bold text-sm transition-all inline-flex items-center justify-center gap-2 active:scale-95 ${
        highlight
          ? 'bg-sport-orange text-white hover:bg-orange-600 shadow-lg shadow-sport-orange/25'
          : 'border border-sport-border text-white hover:border-sport-gray hover:bg-white/5'
      }`}
    >
      {cta} <ArrowRight size={14} aria-hidden="true" />
    </button>
  )
}

export function Pricing() {
  const t = useTranslations('home.pricing')
  const plans = t.raw('plans') as PlanText[]
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [period, setPeriod] = useState<Period>('monthly')

  return (
    <section id="tarifs" aria-labelledby="tarifs-title" className="py-24 px-6 bg-sport-card border-y border-sport-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="tarifs-title"
          label={t('label')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${period === 'monthly' ? 'bg-sport-orange text-white' : 'text-sport-gray hover:text-white'}`}
          >
            {t('monthly')}
          </button>
          <button
            onClick={() => setPeriod('annual')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${period === 'annual' ? 'bg-sport-orange text-white' : 'text-sport-gray hover:text-white'}`}
          >
            {t('annual')}
            <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">{t('save')}</span>
          </button>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {PLANS.map((plan, i) => {
            const tr = plans[i]
            return (
              <Tilt3D key={plan.id} max={plan.highlight ? 16 : 12} className="relative h-full rounded-2xl">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all ${
                  plan.highlight
                    ? 'bg-sport-dark border-sport-orange shadow-2xl shadow-sport-orange/15 ring-1 ring-sport-orange/40'
                    : 'bg-sport-dark border-sport-border'
                }`}
              >
                {tr.badge && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sport-orange text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-sport-orange/30">
                    <Zap size={10} aria-hidden="true" /> {tr.badge}
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-black text-white mb-2">{tr.name}</h3>
                  <p className="text-sport-gray text-xs leading-relaxed">{tr.description}</p>
                </div>

                <div className="mb-8 pb-8 border-b border-sport-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">
                      {period === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-sport-gray text-xs">{tr.period}</span>
                  </div>
                  {period === 'annual' && plan.totalAnnual && (
                    <p className="text-[10px] text-sport-gray mt-1">
                      {t.rich('billed', { total: plan.totalAnnual, b: (c) => <strong className="text-white">{c}</strong> })}
                    </p>
                  )}
                  {plan.id !== 'gratuit' && (
                    <p className="text-[10px] text-emerald-400 mt-1.5 font-semibold">
                      {t('freeTrialNote')}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1" aria-label={t('featuresAria', { name: tr.name })}>
                  {tr.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-sport-gray">
                      <CheckCircle size={14} aria-hidden="true" className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-sport-orange' : 'text-emerald-500'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <PlanButton planId={plan.id} name={tr.name} cta={tr.cta} highlight={plan.highlight} period={period} />
              </motion.div>
              </Tilt3D>
            )
          })}
        </div>

        <p className="text-center text-sport-gray text-xs mt-12 pt-8 border-t border-sport-border">
          {t('footnote')}
        </p>
      </div>
    </section>
  )
}
