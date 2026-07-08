'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const INPUT = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-white focus:border-sport-orange outline-none transition-colors'
const ACT_FACTORS = [1.2, 1.375, 1.55, 1.725, 1.9]

// Calculateur de besoin calorique (TDEE) — formule Mifflin-St Jeor, calcul live.
export function CaloriesCalc() {
  const t = useTranslations('outils')
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState(30)
  const [weight, setWeight] = useState(75)
  const [height, setHeight] = useState(178)
  const [act, setAct] = useState(2)

  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161)
  const tdee = bmr * ACT_FACTORS[act]
  const r = (n: number) => (Number.isFinite(n) && n > 0 ? Math.round(n) : 0)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-sport-gray mb-2">{t('calories.sex')}</label>
          <div className="grid grid-cols-2 gap-2">
            {(['male', 'female'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSex(s)}
                className={`rounded-xl py-3 text-sm font-bold border transition-colors ${sex === s ? 'bg-sport-orange text-white border-sport-orange' : 'bg-sport-dark text-sport-gray border-sport-border hover:border-white/30'}`}
              >
                {t(`calories.${s}`)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="cal-age" className="block text-xs font-bold text-sport-gray mb-2">{t('calories.age')}</label>
          <input id="cal-age" type="number" min={10} max={100} value={age} onChange={(e) => setAge(+e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="cal-weight" className="block text-xs font-bold text-sport-gray mb-2">{t('calories.weight')}</label>
          <input id="cal-weight" type="number" min={30} max={250} value={weight} onChange={(e) => setWeight(+e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="cal-height" className="block text-xs font-bold text-sport-gray mb-2">{t('calories.height')}</label>
          <input id="cal-height" type="number" min={120} max={230} value={height} onChange={(e) => setHeight(+e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="cal-act" className="block text-xs font-bold text-sport-gray mb-2">{t('calories.activity')}</label>
          <select id="cal-act" value={act} onChange={(e) => setAct(+e.target.value)} className={INPUT}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n - 1}>{t(`calories.act${n}`)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/15 via-sport-card to-sport-card p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-1">{t('calories.tdee')}</p>
          <p className="text-4xl font-black text-white">{r(tdee)}</p>
          <p className="text-xs text-sport-gray mt-1">{t('calories.unit')}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-sport-card border border-sport-border p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-sport-gray">{t('calories.bmr')}</p>
            <p className="text-base font-black text-white mt-1">{r(bmr)}</p>
          </div>
          <div className="rounded-xl bg-sport-card border border-sport-border p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-sport-lime">{t('calories.cut')}</p>
            <p className="text-base font-black text-white mt-1">{r(tdee * 0.8)}</p>
          </div>
          <div className="rounded-xl bg-sport-card border border-sport-border p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-sport-orange">{t('calories.bulk')}</p>
            <p className="text-base font-black text-white mt-1">{r(tdee * 1.15)}</p>
          </div>
        </div>
        <p className="text-[11px] text-sport-gray leading-relaxed pt-1">{t('disclaimer')}</p>
      </div>
    </div>
  )
}
