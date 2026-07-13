'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, X, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { XenotifMark } from '@/components/ui/Logo'

export function StickyCheckout() {
  const t = useTranslations('home.sticky')
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
      aria-label={t('ariaRegion')}
      className="fixed bottom-0 left-0 right-0 z-40 bg-sport-card/96 backdrop-blur-md border-t border-sport-border shadow-2xl pb-safe"
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Accroche + réassurance essai gratuit — sur mobile, logo + accroche
              masqués (pas la place à côté du bouton Pro + dismiss), seule la
              réassurance "Sans engagement" reste visible. */}
          <div className="flex items-center gap-2.5 shrink-0 mr-1">
            <span className="hidden md:block">
              <XenotifMark size={28} />
            </span>
            <div className="leading-tight">
              <p className="hidden md:block font-black text-sport-fg text-xs">{t('lead')}</p>
              <p className="flex items-center gap-1 text-[10px] text-[#1E7F5A] font-bold whitespace-nowrap">
                <Zap size={9} aria-hidden="true" /> {t('trial')}
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-1 gap-2 min-w-0">
            <Link
              href="/auth/signup?plan=pro"
              aria-label={t('proAria')}
              className="flex-none inline-flex items-center justify-center gap-1.5 bg-sport-orange text-white px-4 py-2.5 rounded-full font-bold text-xs hover:bg-orange-600 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-sport-orange/20"
            >
              {t('pro')} <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            aria-label={t('dismiss')}
            className="shrink-0 text-sport-gray hover:text-sport-fg transition-colors p-1 ml-1"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
