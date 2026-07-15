'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const INPUT = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg focus:border-sport-orange outline-none transition-colors'
const PCTS = [100, 95, 90, 85, 80, 75, 70, 65, 60]

// Calculateur de 1RM (charge max sur 1 rép) - formule Epley + table par %.
export function OneRmCalc() {
  const t = useTranslations('outils')
  const [weight, setWeight] = useState(80)
  const [reps, setReps] = useState(5)

  // Epley : 1RM = poids × (1 + reps/30). À 1 rép, 1RM = poids.
  const oneRm = reps <= 1 ? weight : weight * (1 + reps / 30)
  const r = (n: number) => (Number.isFinite(n) && n > 0 ? Math.round(n) : 0)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="orm-weight" className="block text-xs font-bold text-sport-gray mb-2">{t('oneRm.weight')}</label>
          <input id="orm-weight" type="number" min={1} max={500} value={weight} onChange={(e) => setWeight(+e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="orm-reps" className="block text-xs font-bold text-sport-gray mb-2">{t('oneRm.reps')}</label>
          <input id="orm-reps" type="number" min={1} max={20} value={reps} onChange={(e) => setReps(+e.target.value)} className={INPUT} />
        </div>
        <div className="rounded-2xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/15 via-sport-card to-sport-card p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-1">{t('oneRm.result')}</p>
          <p className="text-4xl font-black text-sport-fg">{r(oneRm)} <span className="text-lg text-sport-gray">kg</span></p>
        </div>
        <p className="text-[11px] text-sport-gray leading-relaxed">{t('disclaimer')}</p>
      </div>

      <div className="rounded-2xl bg-sport-card border border-sport-border p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-3">{t('oneRm.table')}</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sport-border text-[11px] uppercase tracking-wider text-sport-gray">
              <th className="text-left py-2 font-bold">{t('oneRm.pct')}</th>
              <th className="text-right py-2 font-bold">{t('oneRm.load')}</th>
            </tr>
          </thead>
          <tbody>
            {PCTS.map((p) => (
              <tr key={p} className="border-b border-sport-border/50">
                <td className="py-2 font-bold text-sport-fg">{p} %</td>
                <td className="py-2 text-right text-sport-gray">{r((oneRm * p) / 100)} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
