'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const INPUT = 'w-full bg-sport-dark border border-sport-border rounded-xl px-4 py-3 text-sport-fg focus:border-sport-orange outline-none transition-colors'

// Calculateur d'IMC (indice de masse corporelle) — calcul + catégorie live.
export function ImcCalc() {
  const t = useTranslations('outils')
  const [weight, setWeight] = useState(75)
  const [height, setHeight] = useState(178)

  const m = height / 100
  const imc = m > 0 ? weight / (m * m) : 0
  const cat =
    imc < 18.5 ? { key: 'cat_under', color: 'text-sport-blue' }
    : imc < 25 ? { key: 'cat_normal', color: 'text-sport-lime' }
    : imc < 30 ? { key: 'cat_over', color: 'text-sport-orange' }
    : { key: 'cat_obese', color: 'text-rose-400' }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="imc-weight" className="block text-xs font-bold text-sport-gray mb-2">{t('imc.weight')}</label>
          <input id="imc-weight" type="number" min={30} max={250} value={weight} onChange={(e) => setWeight(+e.target.value)} className={INPUT} />
        </div>
        <div>
          <label htmlFor="imc-height" className="block text-xs font-bold text-sport-gray mb-2">{t('imc.height')}</label>
          <input id="imc-height" type="number" min={120} max={230} value={height} onChange={(e) => setHeight(+e.target.value)} className={INPUT} />
        </div>
        <p className="text-[11px] text-sport-gray leading-relaxed pt-1">{t('disclaimer')}</p>
      </div>

      <div className="rounded-2xl border border-sport-orange/30 bg-gradient-to-br from-sport-orange/15 via-sport-card to-sport-card p-8 flex flex-col items-center justify-center text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-sport-gray mb-1">{t('imc.result')}</p>
        <p className="text-5xl font-black text-sport-fg">{imc > 0 ? imc.toFixed(1) : '—'}</p>
        <p className={`mt-3 text-lg font-black ${cat.color}`}>{imc > 0 ? t(`imc.${cat.key}`) : ''}</p>
      </div>
    </div>
  )
}
