'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Lock, ArrowRight } from 'lucide-react'

// Soft-paywall : le contenu reste dans le DOM (indexable pour le SEO) mais est
// tronqué + estompé pour les non-abonnés, avec un appel à l'abonnement.
// Le contenu `min_plan === 'free'` n'est jamais verrouillé ; sinon, réservé aux
// abonnés actifs/en essai (PRO).
export function SubscriberGate({ minPlan, children }: { minPlan?: string; children: React.ReactNode }) {
  const t = useTranslations('disciplines.gate')
  const isFree = minPlan === 'free'
  const [locked, setLocked] = useState(!isFree)

  useEffect(() => {
    if (isFree) return
    let alive = true
    fetch('/api/subscription')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (alive) setLocked(!(d && (d.status === 'active' || d.status === 'trialing'))) })
      .catch(() => { if (alive) setLocked(true) })
    return () => { alive = false }
  }, [isFree])

  if (!locked) return <>{children}</>

  return (
    <div className="relative">
      <div className="relative max-h-[440px] overflow-hidden">
        {children}
        {/* Fondu vers le fond pour masquer la suite */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/80 to-transparent" />
      </div>

      {/* Paywall */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center px-4 pb-1">
        <div className="w-14 h-14 rounded-2xl bg-sport-orange/15 border border-sport-orange/30 flex items-center justify-center mb-4">
          <Lock size={24} className="text-sport-orange" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">{t('title')}</h3>
        <p className="text-sport-gray text-sm max-w-sm mx-auto mb-5">{t('subtitle')}</p>
        <Link
          href="/#tarifs"
          className="inline-flex items-center justify-center gap-2 bg-sport-orange text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-sport-orange/25"
        >
          {t('cta')} <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <p className="text-[11px] text-sport-gray mt-3">{t('note')}</p>
      </div>
    </div>
  )
}
