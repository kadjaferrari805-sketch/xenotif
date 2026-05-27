'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, X } from 'lucide-react'
import Link from 'next/link'

export function StickyCheckout() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 700) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (dismissed || !visible) return null

  return (
    <div
      role="region"
      aria-label="Abonnement rapide"
      className="fixed bottom-0 left-0 right-0 z-40 bg-sport-card/96 backdrop-blur-md border-t border-sport-border shadow-2xl"
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 shrink-0 mr-2">
            <span aria-hidden="true" className="w-7 h-7 bg-sport-orange rounded-md flex items-center justify-center font-black text-white text-xs">X</span>
            <span className="font-black text-white text-xs tracking-wider hidden xl:block">XENOTIF®</span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-1 gap-2 min-w-0">
            <Link
              href="/auth/signup?plan=pro"
              aria-label="S'abonner au plan Pro — 9,99 euros par mois"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-sport-orange text-white px-4 py-2.5 rounded-full font-bold text-xs hover:bg-orange-600 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-sport-orange/20"
            >
              Pro — 9,99 €/mois <ArrowRight size={12} aria-hidden="true" />
            </Link>

            <Link
              href="/auth/signup?plan=elite"
              aria-label="S'abonner au plan Élite — 24,99 euros par mois"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 border border-sport-border text-white px-4 py-2.5 rounded-full font-bold text-xs hover:border-sport-gray hover:bg-white/5 active:scale-95 transition-all whitespace-nowrap"
            >
              Élite — 24,99 €/mois <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fermer la barre d'abonnement"
            className="shrink-0 text-sport-gray hover:text-white transition-colors p-1 ml-1"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
