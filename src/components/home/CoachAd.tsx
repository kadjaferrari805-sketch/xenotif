'use client'

import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'

const AD_LOCALES = ['fr', 'en', 'de']

// Visuel publicitaire « Ton coach dans ta poche » + CTA. Remplace la démo Coach IA sur l'accueil.
// L'affiche existe par langue (texte localisé) → on sélectionne selon la locale active.
export function CoachAd() {
  const t = useTranslations('coachAd')
  const locale = useLocale()
  const adSrc = `/pub/coach-poche-${AD_LOCALES.includes(locale) ? locale : 'fr'}.webp`

  return (
    <section className="px-6 py-20 bg-sport-dark" aria-label={t('title')}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-14 items-center">
        {/* Image pub — rendu 3D (perspective + profondeur) + glow orange */}
        <div className="coach-3d-wrap relative mx-auto w-full max-w-lg">
          <div
            className="absolute -inset-4 bg-sport-orange/20 blur-3xl rounded-[2rem]"
            aria-hidden="true"
          />
          <Image
            src={adSrc}
            alt={t('imageAlt')}
            width={1080}
            height={1080}
            sizes="(max-width: 768px) 90vw, 520px"
            className="coach-3d relative w-full h-auto rounded-2xl ring-1 ring-white/10"
          />
        </div>

        {/* Texte + CTA à côté */}
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-sport-orange bg-sport-orange/10 border border-sport-orange/20 rounded-full px-3 py-1">
            <Sparkles size={12} aria-hidden="true" /> {t('badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-4">{t('title')}</h2>
          <p className="text-sport-gray mt-3 max-w-md mx-auto md:mx-0">{t('subtitle')}</p>
          <div className="mt-7 flex justify-center md:justify-start">
            <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2">
              {t('cta')} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <p className="text-xs text-sport-gray mt-3">{t('note')}</p>
        </div>
      </div>
    </section>
  )
}
