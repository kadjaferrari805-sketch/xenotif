'use client'

import { useEffect } from 'react'

// Enregistre le service worker (PWA installable). Rendu nul - monté dans le layout.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* best-effort */ })
    }
  }, [])
  return null
}
