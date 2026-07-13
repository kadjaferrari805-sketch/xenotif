'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, Clock } from 'lucide-react'

export type ProOfferText = {
  badge: string
  headline: string
  price: string
  free: string
  save: string
  countdownLabel: string
}

// Textes partagés de la bannière upsell (home + inscription), par langue.
export const PRO_OFFER_TXT: Record<string, ProOfferText> = {
  fr: { badge: 'Essai Pro', headline: '7 jours de Pro, offerts', price: '9,99 €/mois', free: 'inclus', save: 'Économise 9,99 €', countdownLabel: 'se termine dans' },
  en: { badge: 'Pro trial', headline: '7 days of Pro, free', price: '€9.99/mo', free: 'included', save: 'Save €9.99', countdownLabel: 'ends in' },
  de: { badge: 'Pro-Test', headline: '7 Tage Pro, gratis', price: '9,99 €/Monat', free: 'inklusive', save: 'Spare 9,99 €', countdownLabel: 'endet in' },
}

function endOfDayMs(): number {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

// Bannière upsell « essai Pro » au-dessus du toggle de période. Palette vibrante
// (vert → orange), prix barré → inclus (style Higgsfield), badge d'économie, et
// compteur d'urgence ambre qui clignote.
export function ProOfferPill({
  badge,
  headline,
  price,
  free,
  save,
  countdownLabel,
}: {
  badge: string
  headline: string
  price: string
  free: string
  save: string
  countdownLabel: string
}) {
  const [remaining, setRemaining] = useState<number | null>(null)
  const targetRef = useRef<number>(0)

  useEffect(() => {
    targetRef.current = endOfDayMs()
    const tick = () => {
      let r = targetRef.current - Date.now()
      if (r <= 0) {
        targetRef.current = endOfDayMs()
        r = targetRef.current - Date.now()
      }
      setRemaining(Math.max(0, r))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  let time = '··:··:··'
  if (remaining !== null) {
    const s = Math.floor(remaining / 1000)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    const p = (n: number) => String(n).padStart(2, '0')
    time = `${p(h)}:${p(m)}:${p(sec)}`
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-400/50 bg-gradient-to-r from-emerald-500/20 via-lime-400/10 to-sport-orange/15 p-3 shadow-[0_0_34px_rgba(16,185,129,0.22)] sm:p-4">
      <span aria-hidden="true" className="pointer-events-none absolute -left-10 -top-12 h-36 w-36 rounded-full bg-emerald-400/20 blur-2xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-sport-orange/15 blur-2xl" />
      {/* Une seule rangée à toutes les tailles. Sur mobile, les éléments
          secondaires (pill, prix barré, « inclus », label du compteur) sont
          masqués pour que l'accroche + le compteur tiennent sur une ligne. */}
      <div className="relative flex items-center gap-2.5 sm:gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-300 sm:h-10 sm:w-10 sm:rounded-xl">
          <Sparkles size={16} aria-hidden="true" className="sm:hidden" />
          <Sparkles size={18} aria-hidden="true" className="hidden sm:block" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[10px] font-black uppercase tracking-[2px] text-emerald-300">{badge}</span>
            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-black text-emerald-950">{save}</span>
          </div>
          <p className="mt-0.5 text-xs font-black leading-snug text-sport-fg sm:text-[15px]">
            {headline}
            <span className="text-[11px] font-bold text-sport-gray line-through decoration-emerald-300/60 sm:text-sm"> {price}</span>
            <span className="text-[11px] font-black text-emerald-300 sm:text-sm"> {free}</span>
          </p>
        </div>
        {/* Compteur compact : vertical (label au-dessus de l'heure) sur mobile,
            en ligne sur desktop. Reste étroit pour tenir sur la même rangée. */}
        <span className="flex shrink-0 flex-col items-center gap-0 rounded-xl border border-amber-300/50 bg-black/40 px-2.5 py-1 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:py-1.5">
          <span className="flex items-center gap-1">
            <span className="xeno-blink h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] sm:h-2 sm:w-2" />
            <Clock size={11} aria-hidden="true" className="text-amber-300 sm:hidden" />
            <Clock size={13} aria-hidden="true" className="hidden text-amber-300 sm:block" />
            <span className="text-[8px] font-bold uppercase tracking-wide text-sport-gray sm:text-[10px]">{countdownLabel}</span>
          </span>
          <span className="xeno-blink font-mono text-[13px] font-black tabular-nums text-amber-300 sm:text-base">{time}</span>
        </span>
      </div>
    </div>
  )
}
