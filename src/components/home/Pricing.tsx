'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CheckCircle, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SectionHeader } from '@/components/ui/SectionHeader'

type PlanId = 'gratuit' | 'pro' | 'elite'
type Period = 'monthly' | 'annual'

const PLANS = [
  {
    id: 'gratuit' as PlanId,
    name: 'Gratuit',
    priceMonthly: '0 €',
    priceAnnual: '0 €',
    period: 'pour toujours',
    badge: null,
    description: 'Découvre Xenotif® et commence ta transformation sans risque.',
    features: [
      '3 programmes d\'accès',
      'Suivi de séances basique',
      'Accès à la communauté',
      'WOD hebdomadaire gratuit',
    ],
    cta: 'Commencer gratuitement',
    highlight: false,
  },
  {
    id: 'pro' as PlanId,
    name: 'Pro',
    priceMonthly: '9,99 €',
    priceAnnual: '7,99 €',
    totalAnnual: '95,88 €',
    period: 'par mois',
    badge: 'Le plus populaire',
    description: 'Accès illimité à tous les programmes et au coaching IA personnalisé.',
    features: [
      'Tous les programmes illimités',
      'Coaching IA personnalisé',
      'Statistiques & suivi avancé',
      'Vidéos HD haute qualité',
      'Support prioritaire 7j/7',
      'Challenges communautaires',
    ],
    cta: 'Essai gratuit 30 jours',
    highlight: true,
  },
  {
    id: 'elite' as PlanId,
    name: 'Élite',
    priceMonthly: '24,99 €',
    priceAnnual: '19,99 €',
    totalAnnual: '239,88 €',
    period: 'par mois',
    badge: null,
    description: 'Coaching individuel et suivi personnalisé par un expert certifié.',
    features: [
      'Tout le plan Pro inclus',
      'Coach personnel dédié',
      'Bilan mensuel visio 1-1',
      'Plan nutritionnel sur mesure',
      'Analyse biomécanique vidéo',
      'Accès anticipé aux nouveautés',
    ],
    cta: 'Parler à un coach',
    highlight: false,
  },
]

function PlanButton({
  plan,
  highlight,
}: {
  plan: (typeof PLANS)[number]
  highlight: boolean
}) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(`/auth/signup?plan=${plan.id}`)}
      aria-label={`S'abonner au plan ${plan.name}`}
      className={`w-full py-3.5 px-6 rounded-full font-bold text-sm transition-all inline-flex items-center justify-center gap-2 active:scale-95 ${
        highlight
          ? 'bg-sport-orange text-white hover:bg-orange-600 shadow-lg shadow-sport-orange/25'
          : 'border border-sport-border text-white hover:border-sport-gray hover:bg-white/5'
      }`}
    >
      {plan.cta} <ArrowRight size={14} aria-hidden="true" />
    </button>
  )
}

export function Pricing() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [period, setPeriod] = useState<Period>('monthly')

  return (
    <section id="tarifs" aria-labelledby="tarifs-title" className="py-24 px-6 bg-sport-card border-y border-sport-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="tarifs-title"
          label="Tarifs"
          title="Simple. Transparent. Sans surprise."
          subtitle="Essai gratuit 30 jours sur tous les plans payants — aucune carte bancaire requise"
        />

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${period === 'monthly' ? 'bg-sport-orange text-white' : 'text-sport-gray hover:text-white'}`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setPeriod('annual')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${period === 'annual' ? 'bg-sport-orange text-white' : 'text-sport-gray hover:text-white'}`}
          >
            Annuel
            <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">-20%</span>
          </button>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                plan.highlight
                  ? 'bg-sport-dark border-sport-orange shadow-2xl shadow-sport-orange/15 ring-1 ring-sport-orange/40'
                  : 'bg-sport-dark border-sport-border'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sport-orange text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-sport-orange/30">
                  <Zap size={10} aria-hidden="true" /> {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-black text-white mb-2">{plan.name}</h3>
                <p className="text-sport-gray text-xs leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8 pb-8 border-b border-sport-border">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">
                    {period === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-sport-gray text-xs">{plan.period}</span>
                </div>
                {period === 'annual' && 'totalAnnual' in plan && (
                  <p className="text-[10px] text-sport-gray mt-1">
                    Facturé <strong className="text-white">{plan.totalAnnual}/an</strong>
                  </p>
                )}
                {plan.id !== 'gratuit' && (
                  <p className="text-[10px] text-emerald-400 mt-1.5 font-semibold">
                    ✓ 30 jours gratuits · Sans engagement
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1" aria-label={`Fonctionnalités plan ${plan.name}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs text-sport-gray">
                    <CheckCircle size={14} aria-hidden="true" className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-sport-orange' : 'text-emerald-500'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <PlanButton plan={plan} highlight={plan.highlight} />
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sport-gray text-xs mt-12 pt-8 border-t border-sport-border">
          Sans engagement · Annulation à tout moment en 1 clic
        </p>
      </div>
    </section>
  )
}
