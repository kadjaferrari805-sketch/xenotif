'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { applyConsent, getStoredConsent, storeConsent } from '@/lib/consent'

// Textes du bandeau (auto-contenus, fr/en/de). La page de confidentialité existe
// déjà : /confidentialite.
const T: Record<string, { msg: string; accept: string; refuse: string; more: string }> = {
  fr: {
    msg: 'Nous utilisons des cookies de mesure d’audience et publicitaires pour améliorer Xenotif®. Tu peux accepter ou refuser.',
    accept: 'Tout accepter',
    refuse: 'Refuser',
    more: 'En savoir plus',
  },
  en: {
    msg: 'We use analytics and advertising cookies to improve Xenotif®. You can accept or decline.',
    accept: 'Accept all',
    refuse: 'Decline',
    more: 'Learn more',
  },
  de: {
    msg: 'Wir verwenden Analyse- und Werbe-Cookies, um Xenotif® zu verbessern. Du kannst zustimmen oder ablehnen.',
    accept: 'Alle akzeptieren',
    refuse: 'Ablehnen',
    more: 'Mehr erfahren',
  },
}

export function ConsentBanner() {
  const locale = useLocale()
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Choix déjà fait → rien (le défaut au chargement l'a déjà appliqué).
    if (getStoredConsent()) return
    let cancelled = false
    fetch('/api/geo')
      .then((r) => r.json())
      .then((d: { eu?: boolean }) => {
        if (cancelled) return
        if (d?.eu) {
          setShow(true) // UE/UK/CH → demander le consentement
        } else {
          // Hors UE : consentement implicite, on libère le tracking (Meta retenu).
          applyConsent('granted')
          storeConsent('granted')
        }
      })
      .catch(() => {
        // Géo indisponible → on demande par sécurité (le plus conforme).
        if (!cancelled) setShow(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const choose = (c: 'granted' | 'denied') => {
    applyConsent(c)
    storeConsent(c)
    setShow(false)
  }

  if (!show) return null
  const t = T[locale] ?? T.fr

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-sport-orange/30 bg-sport-card/95 p-4 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <p className="flex-1 text-xs leading-relaxed text-sport-gray sm:text-sm">
        {t.msg}{' '}
        <Link href="/confidentialite" className="font-semibold text-sport-orange hover:underline">
          {t.more}
        </Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="rounded-xl border border-sport-border px-4 py-2.5 text-xs font-bold text-white transition-colors hover:border-sport-gray sm:text-sm"
        >
          {t.refuse}
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="rounded-xl bg-sport-orange px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-600 sm:text-sm"
        >
          {t.accept}
        </button>
      </div>
      </div>
    </div>
  )
}
