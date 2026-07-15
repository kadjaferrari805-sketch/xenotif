'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const INPUT = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg focus:border-sport-orange outline-none transition-colors'
// Protéines (g/kg) et part de lipides (% des calories) selon l'objectif.
const PROT_PER_KG = { cut: 2.2, maintain: 1.8, bulk: 2.0 } as const
const FAT_PCT = { cut: 0.25, maintain: 0.28, bulk: 0.25 } as const
type Goal = keyof typeof PROT_PER_KG

// Calculateur de macros : répartit les calories en protéines/glucides/lipides.
export function MacrosCalc() {
  const t = useTranslations('outils')
  const [weight, setWeight] = useState(75)
  const [calories, setCalories] = useState(2500)
  const [goal, setGoal] = useState<Goal>('maintain')

  const protein = Math.round(weight * PROT_PER_KG[goal])
  const fat = Math.round((calories * FAT_PCT[goal]) / 9)
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4))

  const cards: { key: 'protein' | 'carbs' | 'fat'; g: number; color: string }[] = [
    { key: 'protein', g: protein, color: 'text-sport-orange' },
    { key: 'carbs', g: carbs, color: 'text-sport-blue' },
    { key: 'fat', g: fat, color: 'text-sport-lime' },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="mac-weight" className="block text-xs font-bold text-sport-gray mb-2">{t('macros.weight')}</label>
          <input id="mac-weight" type="number" min={30} max={250} value={weight} onChange={(e) => setWeight(+e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="mac-cal" className="block text-xs font-bold text-sport-gray mb-2">{t('macros.calories')}</label>
          <input id="mac-cal" type="number" min={800} max={6000} step={50} value={calories} onChange={(e) => setCalories(+e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className="block text-xs font-bold text-sport-gray mb-2">{t('macros.goal')}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['cut', 'maintain', 'bulk'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`rounded-xl py-2.5 text-xs font-bold border transition-colors ${goal === g ? 'bg-sport-orange text-white border-sport-orange' : 'bg-sport-dark text-sport-gray border-sport-border hover:border-sport-fg/30'}`}
              >
                {t(`macros.${g}`)}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-sport-gray leading-relaxed pt-1">{t('disclaimer')}</p>
      </div>

      <div className="space-y-3">
        {cards.map(({ key, g, color }) => (
          <div key={key} className="rounded-2xl bg-sport-card border border-sport-border p-5 flex items-center justify-between">
            <span className="text-sm font-bold text-sport-fg">{t(`macros.${key}`)}</span>
            <span className={`text-2xl font-black ${color}`}>{g} <span className="text-sm text-sport-gray font-bold">g</span></span>
          </div>
        ))}
        <p className="text-[11px] text-sport-gray text-center">{calories} kcal · {t('macros.perDay')}</p>
      </div>
    </div>
  )
}
