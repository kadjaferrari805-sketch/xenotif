'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

function endOfDayMs(): number {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

// Upsell premium « essai Pro » pour la carte Gratuit : sobre, accent émeraude,
// compteur discret (pas de clignotement). Élégant plutôt qu'urgence « solde ».
export function ProOfferPill({
  flash,
  title,
  benefit,
  urgency,
}: {
  flash: string
  title: string
  benefit: string
  urgency: string
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

  let time = '··:··'
  if (remaining !== null) {
    const s = Math.floor(remaining / 1000)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    const p = (n: number) => String(n).padStart(2, '0')
    time = `${p(h)}:${p(m)}:${p(sec)}`
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-950/55 via-sport-card to-sport-card p-4 shadow-[0_0_28px_rgba(16,185,129,0.12)]">
      {/* halo doux statique (premium, pas d'animation) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-500/15 blur-2xl"
      />
      <div className="relative">
        <div className="mb-1.5 flex items-center gap-2">
          <Sparkles size={14} aria-hidden="true" className="text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-[2.5px] text-emerald-400">{flash}</span>
        </div>
        <p className="text-[17px] font-black leading-tight text-white">{title}</p>
        <p className="mt-1 text-[11px] leading-snug text-sport-gray">{benefit}</p>
        <div className="mt-3 flex items-center gap-2 border-t border-emerald-500/15 pt-2.5">
          <span className="text-[11px] text-sport-gray">{urgency}</span>
          <span className="ml-auto font-mono text-[13px] font-bold tabular-nums tracking-tight text-emerald-300">
            {time}
          </span>
        </div>
      </div>
    </div>
  )
}
