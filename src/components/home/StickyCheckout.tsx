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
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-3">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Accroche + réassurance essai gratuit — même contenu (logo, accroche,
              "Sans engagement") sur mobile et desktop, juste réduit sur mobile
              (logo 20px, textes 9-10px, gaps serrés) pour tenir à côté du bouton
              Pro + croix sur un écran de 375px de large. */}
          <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0 mr-0 md:mr-1">
            <span className="md:hidden">
              <XenotifMark size={20} />
            </span>
            <span className="hidden md:block">
              <XenotifMark size={28} />
            </span>
            <div className="leading-tight">
              <p className="font-black text-sport-fg text-[10px] md:text-xs whitespace-nowrap">{t('lead')}</p>
              <p className="flex items-center gap-1 text-[9px] md:text-[10px] text-[#1E7F5A] font-bold whitespace-nowrap">
                <Zap size={8} aria-hidden="true" /> {t('trial')}
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-1 gap-2 min-w-0">
            <Link
              href="/auth/signup?plan=pro"
              aria-label={t('proAria')}
              className="flex-none inline-flex items-center justify-center gap-1 md:gap-1.5 bg-sport-orange text-white px-3 md:px-4 py-2 md:py-2.5 rounded-full font-bold text-[11px] md:text-xs hover:bg-orange-600 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-sport-orange/20"
            >
              {t('pro')} <ArrowRight size={11} aria-hidden="true" />
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
