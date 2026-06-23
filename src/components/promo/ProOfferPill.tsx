'use client'

import { useEffect, useRef, useState } from 'react'
import { Flame, Clock } from 'lucide-react'

function endOfDayMs(): number {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

// Bloc promo premium pour la carte « Gratuit » : label flash, titre accrocheur,
// bénéfice, et gros compteur d'urgence du jour. Reflet qui balaye + clignotement.
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
    <div className="relative overflow-hidden rounded-xl border border-sport-orange/50 bg-gradient-to-br from-[#2c1500] via-[#3d1e00] to-[#160a00] p-3.5 shadow-[0_0_26px_rgba(255,69,0,0.25)]">
      <span aria-hidden="true" className="xeno-shimmer pointer-events-none absolute inset-0" />
      <div className="relative">
        <div className="mb-1.5 flex items-center gap-1.5">
          <span className="xeno-blink flex h-4 w-4 items-center justify-center rounded-full bg-sport-orange text-white">
            <Flame size={10} aria-hidden="true" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[2px] text-sport-orange">{flash}</span>
        </div>
        <p className="text-[15px] font-black leading-tight text-white">{title}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-sport-gray">{benefit}</p>
        <div className="mt-2.5 flex items-center gap-2 border-t border-sport-orange/20 pt-2.5">
          <Clock size={14} aria-hidden="true" className="shrink-0 text-sport-orange" />
          <span className="text-[11px] font-bold text-sport-gray">{urgency}</span>
          <span className="xeno-blink ml-auto font-mono text-xl font-black tabular-nums tracking-tight text-sport-orange">
            {time}
          </span>
        </div>
      </div>
    </div>
  )
}
