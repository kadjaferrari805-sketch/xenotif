'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

// Suit les PageView sur les navigations SPA (App Router).
// Le script d'init du Pixel + le 1er PageView sont chargés dans le layout (server),
// pour un chargement fiable côté HTML (cf. layout.tsx). Ce composant ne fait que
// renvoyer un PageView à chaque changement d'URL après le premier.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export function MetaPixelRouteTracker() {
  const pathname = usePathname()
  const initialized = useRef(false)

  useEffect(() => {
    if (!PIXEL_ID) return
    if (!initialized.current) {
      initialized.current = true // le 1er PageView est déjà envoyé par le script d'init
      return
    }
    const w = window as unknown as { fbq?: (...args: unknown[]) => void }
    w.fbq?.('track', 'PageView')
  }, [pathname])

  return null
}
