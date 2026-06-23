'use client'

import { useEffect, useRef, useState } from 'react'

function endOfDayMs(): number {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

// Petite pub premium pour la carte « Gratuit » : pill avec reflet qui balaye,
// point clignotant et mini-compteur d'urgence (décompte du jour).
export function ProOfferPill({ label }: { label: string }) {
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
    <div className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-sport-orange/60 bg-gradient-to-r from-[#2a1400] via-[#3d1e00] to-[#2a1400] px-3 py-1.5 shadow-[0_0_18px_rgba(255,69,0,0.3)]">
      <span aria-hidden="true" className="xeno-shimmer pointer-events-none absolute inset-0" />
      <span className="xeno-blink relative h-1.5 w-1.5 shrink-0 rounded-full bg-sport-orange shadow-[0_0_8px_rgba(255,69,0,0.9)]" />
      <span className="relative text-[10px] font-black uppercase tracking-wider text-sport-orange">{label}</span>
      <span className="xeno-blink relative font-mono text-[12px] font-black tabular-nums text-white">{time}</span>
    </div>
  )
}
