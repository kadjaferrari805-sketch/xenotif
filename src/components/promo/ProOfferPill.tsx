'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, Clock } from 'lucide-react'

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
    <div className="relative overflow-hidden rounded-2xl border border-emerald-400/50 bg-gradient-to-r from-emerald-500/20 via-lime-400/10 to-sport-orange/15 p-4 shadow-[0_0_34px_rgba(16,185,129,0.22)]">
      <span aria-hidden="true" className="pointer-events-none absolute -left-10 -top-12 h-36 w-36 rounded-full bg-emerald-400/20 blur-2xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-sport-orange/15 blur-2xl" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[2px] text-emerald-300">{badge}</span>
              <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-black text-emerald-950">{save}</span>
            </div>
            <p className="mt-0.5 text-[15px] font-black leading-tight text-white">
              {headline}{' '}
              <span className="text-sm font-bold text-sport-gray line-through decoration-emerald-300/60">{price}</span>{' '}
              <span className="text-sm font-black text-emerald-300">{free}</span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center sm:justify-end">
          <span className="flex items-center gap-2 rounded-full border border-amber-300/50 bg-black/40 px-3 py-1.5">
            <span className="xeno-blink h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
            <Clock size={13} aria-hidden="true" className="text-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-sport-gray">{countdownLabel}</span>
            <span className="xeno-blink font-mono text-base font-black tabular-nums text-amber-300">{time}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
