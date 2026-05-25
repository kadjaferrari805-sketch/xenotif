'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CheckCircle, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { SectionHeader } from '@/components/ui/SectionHeader'

type PlanId = 'gratuit' | 'pro' | 'elite'

const PLANS = [
  {
    id: 'gratuit' as PlanId,
    name: 'Gratuit',
    price: '0 €',
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
    price: '9,99 €',
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
    price: '24,99 €',
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Free plan → newsletter
  if (plan.id === 'gratuit') {
    return (
      <Link
        href="/#newsletter"
        className="w-full text-center py-3.5 px-6 rounded-full font-bold text-sm transition-all inline-flex items-center justify-center gap-2 border border-sport-border text-white hover:border-sport-gray hover:bg-white/5 active:scale-95"
      >
        {plan.cta} <ArrowRight size={14} aria-hidden="true" />
      </Link>
    )
  }

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.id }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Erreur. Réessaie.')
      }
    } catch {
      setError('Connexion impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        aria-label={`S'abonner au plan ${plan.name} — ${plan.price} ${plan.period}`}
        className={`w-full py-3.5 px-6 rounded-full font-bold text-sm transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 ${
          highlight
            ? 'bg-sport-orange text-white hover:bg-orange-600 shadow-lg shadow-sport-orange/25'
            : 'border border-sport-border text-white hover:border-sport-gray hover:bg-white/5'
        }`}
      >
        {loading
          ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Chargement…</>
          : <>{plan.cta} <ArrowRight size={14} aria-hidden="true" /></>
        }
      </button>
      {error && <p role="alert" className="text-red-400 text-[10px] mt-2 text-center">{error}</p>}
    </div>
  )
}

export function Pricing() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="tarifs" aria-labelledby="tarifs-title" className="py-24 px-6 bg-sport-card border-y border-sport-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id="tarifs-title"
          label="Tarifs"
          title="Simple. Transparent. Sans surprise."
          subtitle="Essai gratuit 30 jours sur tous les plans payants — aucune carte bancaire requise"
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
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
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-sport-gray text-xs">{plan.period}</span>
                </div>
                {plan.id !== 'gratuit' && (
                  <p className="text-[10px] text-emerald-400 mt-1.5 font-semibold">
                    ✓ 30 jours gratuits · Sans engagement
                  </p>
                )}
              </div>

              <ul
                className="space-y-3 mb-8 flex-1"
                aria-label={`Fonctionnalités incluses dans le plan ${plan.name}`}
              >
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs text-sport-gray">
                    <CheckCircle
                      size={14}
                      aria-hidden="true"
                      className={`shrink-0 mt-0.5 ${plan.highlight ? 'text-sport-orange' : 'text-emerald-500'}`}
                    />
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
