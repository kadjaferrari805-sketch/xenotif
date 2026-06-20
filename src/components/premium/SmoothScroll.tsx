'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Smooth scroll premium (Lenis), monté globalement dans le layout.
 * Respecte `prefers-reduced-motion` (désactivé si l'utilisateur le demande) et
 * se nettoie au démontage. Ne rend aucun DOM (effet de bord uniquement).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Perf mobile : Lenis n'apporte rien sur tactile (smooth touch désactivé) mais
    // sa boucle requestAnimationFrame tourne en continu → coûteux pour le thread
    // principal et la batterie. On le réserve aux écrans desktop (pointeur fin).
    if (window.matchMedia('(pointer: coarse), (max-width: 1024px)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf = 0
    function loop(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return null
}
