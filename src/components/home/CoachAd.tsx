'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'

// Visuel publicitaire « Ton coach dans ta poche » + CTA. Remplace la démo Coach IA sur l'accueil.
export function CoachAd() {
  const t = useTranslations('coachAd')

  return (
    <section className="px-6 py-20 bg-sport-dark" aria-label={t('title')}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* Image pub — cadre premium (glow orange + ring + ombre) */}
        <div className="relative mx-auto w-full max-w-sm">
          <div
            className="absolute -inset-4 bg-sport-orange/20 blur-3xl rounded-[2rem]"
            aria-hidden="true"
          />
          <Image
            src="/pub/coach-poche.webp"
            alt={t('imageAlt')}
            width={1080}
            height={1080}
            sizes="(max-width: 768px) 90vw, 420px"
            className="relative w-full h-auto rounded-2xl ring-1 ring-white/10 shadow-2xl"
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
