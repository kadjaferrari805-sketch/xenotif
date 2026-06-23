'use client'

import { useEffect, useRef, useState } from 'react'
import { Zap, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

function endOfDayMs(): number {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

// Bannière promo « 7 jours Pro offert » avec compteur en temps réel clignotant.
// - daily : décompte d'urgence jusqu'à minuit (se réinitialise chaque jour).
// - targetMs : décompte vers une date précise (ex. fin réelle de l'essai).
export function OfferBanner({
  title,
  subtitle,
  daily = false,
  targetMs,
  withDays = false,
  cta,
}: {
  title: string
  subtitle?: string
  daily?: boolean
  targetMs?: number
  withDays?: boolean
  cta?: { href: string; label: string }
}) {
  const [remaining, setRemaining] = useState<number | null>(null)
  const targetRef = useRef<number>(targetMs ?? 0)

  useEffect(() => {
    // Calculs impurs (Date) côté effet uniquement, pas pendant le rendu.
    targetRef.current = targetMs ?? (daily ? endOfDayMs() : Date.now())
    const tick = () => {
      let r = targetRef.current - Date.now()
      if (r <= 0 && daily) {
        targetRef.current = endOfDayMs()
        r = targetRef.current - Date.now()
      }
      setRemaining(Math.max(0, r))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [daily, targetMs])

  // Rendu serveur / avant montage : placeholder neutre (évite le mismatch d'hydratation).
  let time = '··:··:··'
  if (remaining !== null) {
    const s = Math.floor(remaining / 1000)
    const d = Math.floor(s / 86400)
    const h = Math.floor((s % 86400) / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    const p = (n: number) => String(n).padStart(2, '0')
    time = withDays && d > 0 ? `${d}j ${p(h)}:${p(m)}:${p(sec)}` : `${p(h)}:${p(m)}:${p(sec)}`
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sport-orange/40 bg-gradient-to-r from-sport-orange/20 via-sport-card to-sport-card p-4 shadow-[0_0_30px_rgba(255,69,0,0.12)]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="xeno-blink flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sport-orange text-white shadow-[0_0_18px_rgba(255,69,0,0.6)]">
          <Zap size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black leading-tight text-white">{title}</p>
          {subtitle && <p className="text-[11px] leading-tight text-sport-gray">{subtitle}</p>}
        </div>
        <span
          className="xeno-blink shrink-0 rounded-xl border border-sport-orange/50 bg-black/40 px-3 py-1.5 font-mono text-lg font-black tabular-nums text-sport-orange"
          aria-live="off"
        >
          {time}
        </span>
        {cta && (
          <Link
            href={cta.href}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-sport-orange px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-600"
          >
            {cta.label} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  )
}
