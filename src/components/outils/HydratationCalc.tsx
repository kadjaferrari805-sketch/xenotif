'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const INPUT = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg focus:border-sport-orange outline-none transition-colors'

// Facteur d'activité : base 33 ml/kg (repère courant), ajustée à la hausse
// selon le niveau d'activité (transpiration à l'effort).
const ACTIVITY_FACTOR: Record<string, number> = { act1: 1, act2: 1.15, act3: 1.3 }

// Calculateur d'hydratation - besoin en eau/jour selon poids + activité.
export function HydratationCalc() {
  const t = useTranslations('outils')
  const [weight, setWeight] = useState(75)
  const [activity, setActivity] = useState<'act1' | 'act2' | 'act3'>('act2')

  const liters = weight > 0 ? (weight * 0.033 * ACTIVITY_FACTOR[activity]) : 0

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="hydratation-weight" className="block text-xs font-bold text-sport-gray mb-2">{t('hydratation.weight')}</label>
          <input id="hydratation-weight" type="number" min={30} max={250} value={weight} onChange={(e) => setWeight(+e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="hydratation-activity" className="block text-xs font-bold text-sport-gray mb-2">{t('hydratation.activity')}</label>
          <select
            id="hydratation-activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value as 'act1' | 'act2' | 'act3')}
            className={INPUT}
          >
            <option value="act1">{t('hydratation.act1')}</option>
            <option value="act2">{t('hydratation.act2')}</option>
            <option value="act3">{t('hydratation.act3')}</option>
          </select>
        </div>
        <p className="text-[11px] text-sport-gray leading-relaxed pt-1">{t('disclaimer')}</p>
      </div>

      <div className="rounded-2xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/15 via-sport-card to-sport-card p-8 flex flex-col items-center justify-center text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-1">{t('hydratation.result')}</p>
        <p className="text-5xl font-black text-sport-fg">{liters > 0 ? liters.toFixed(1) : '-'}</p>
        <p className="mt-2 text-sm text-sport-gray">{t('hydratation.unit')}</p>
      </div>
    </div>
  )
}
