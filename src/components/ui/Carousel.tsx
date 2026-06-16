'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Carrousel MANUEL : défilement horizontal par flèches (desktop) ou swipe (mobile).
// Pas d'auto-scroll. Les cartes enfants doivent être shrink-0 + largeur fixe + marge
// droite (mr-*) pour l'espacement.
export function Carousel({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const t = useTranslations('common')
  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 330, behavior: 'smooth' })

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={t('scrollPrev')}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-sport-card border border-sport-border text-white shadow-lg transition-all hover:border-sport-orange/60 hover:text-sport-orange active:scale-95"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label={t('scrollNext')}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-sport-card border border-sport-border text-white shadow-lg transition-all hover:border-sport-orange/60 hover:text-sport-orange active:scale-95"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
      <div ref={ref} className="disc-scroll flex overflow-x-auto scroll-smooth pb-4">
        {children}
      </div>
    </div>
  )
}
