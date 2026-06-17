'use client'

import { useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Carrousel MANUEL : défilement horizontal par flèches (desktop) ou swipe (mobile).
// Pas d'auto-scroll. Les cartes enfants doivent être shrink-0 + largeur fixe + marge
// droite (mr-*) pour l'espacement.
//
// Profondeur 3D au défilement : chaque carte s'incline/réduit légèrement selon sa
// distance au centre du carrousel (effet de perspective premium). 100% transform
// GPU, throttlé en requestAnimationFrame, désactivé si prefers-reduced-motion.
export function Carousel({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const t = useTranslations('common')
  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 330, behavior: 'smooth' })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    try {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return
    } catch {
      return
    }

    let raf = 0
    const apply = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return
      const center = rect.left + rect.width / 2
      for (const child of Array.from(el.children) as HTMLElement[]) {
        const cr = child.getBoundingClientRect()
        const childCenter = cr.left + cr.width / 2
        // distance normalisée au centre (≈ -1 .. 1)
        const d = Math.max(-1, Math.min(1, ((childCenter - center) / rect.width) * 1.8))
        const a = Math.abs(d)
        const scale = 1 - a * 0.08 // jusqu'à -8 %
        const rotateY = -d * 6 // jusqu'à 6° vers le centre
        const opacity = 1 - a * 0.18 // léger fondu sur les bords
        child.style.transform = `perspective(1200px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`
        child.style.opacity = opacity.toFixed(3)
        child.style.willChange = 'transform'
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    apply()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
    // Carrousels à enfants statiques : on calcule une fois au montage puis au scroll/resize.
  }, [])

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
      <div ref={ref} className="disc-scroll flex overflow-x-auto scroll-smooth pb-4 [perspective:1200px]">
        {children}
      </div>
    </div>
  )
}
