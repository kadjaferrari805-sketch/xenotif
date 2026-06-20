'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Reveal au scroll des titres de section/page : tous les <h1>/<h2> dans <main>,
// sauf ceux dans un lien (titres de cartes) et ceux marqués [data-no-reveal]
// (titres déjà animés par framer-motion : Hero, hero boutique).
const SELECTOR = 'main :is(h1, h2):not(a h1):not(a h2):not([data-no-reveal])'

// Pose la classe `is-revealed` quand un titre entre dans le viewport (le masquage
// initial est géré en CSS, conditionné à `html.js-reveal` posé avant le paint →
// aucun titre caché sans JS, aucun flash). Réobserve à chaque navigation SPA.
export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    // rAF : laisse le contenu de la nouvelle page se monter avant d'observer.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (!el.classList.contains('is-revealed')) io.observe(el)
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [pathname])

  return null
}
