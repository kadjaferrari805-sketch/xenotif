'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, X } from 'lucide-react'

type Plan = 'pro' | 'elite'

export function StickyCheckout() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState<Plan | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 700)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function checkout(plan: Plan) {
    setLoading(plan)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Erreur. Réessaie.')
        setLoading(null)
      }
    } catch {
      setError('Connexion impossible.')
      setLoading(null)
    }
  }

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
            <span aria-hidden="true" className="w-7 h-7 bg-sport-orange rounded-md flex items-center justify-center font-black text-white text-xs">
              X
            </span>
            <span className="font-black text-white text-xs tracking-wider hidden xl:block">XENOTIF®</span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-1 gap-2 min-w-0">
            <button
              onClick={() => checkout('pro')}
              disabled={loading !== null}
              aria-label="S'abonner au plan Pro — 9,99 euros par mois"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-sport-orange text-white px-4 py-2.5 rounded-full font-bold text-xs hover:bg-orange-600 active:scale-95 transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sport-orange/20"
            >
              {loading === 'pro'
                ? <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />Chargement…</span>
                : <>Pro — 9,99 €/mois <ArrowRight size={12} aria-hidden="true" /></>
              }
            </button>

            <button
              onClick={() => checkout('elite')}
              disabled={loading !== null}
              aria-label="S'abonner au plan Élite — 24,99 euros par mois"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 border border-sport-border text-white px-4 py-2.5 rounded-full font-bold text-xs hover:border-sport-gray hover:bg-white/5 active:scale-95 transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading === 'elite'
                ? <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />Chargement…</span>
                : <>Élite — 24,99 €/mois <ArrowRight size={12} aria-hidden="true" /></>
              }
            </button>
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

        {/* Inline error */}
        {error && (
          <p role="alert" className="text-red-400 text-[10px] mt-1.5 pl-1">{error}</p>
        )}
      </div>
    </div>
  )
}
