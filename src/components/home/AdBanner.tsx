'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Star } from 'lucide-react'

// Bandeau publicitaire plein écran : photographie sportive pro + dégradés cinéma
// (noir + lueur orange) + accroche localisée + CTA. PAS de logo.
// Mobile : texte en bas + dégradé bas → le haut de l'image reste bien visible.
export function AdBanner({
  id,
  image,
  ctaHref,
  priority = false,
  imgClass = 'object-center',
}: {
  id: string
  image: string
  ctaHref?: string
  priority?: boolean
  imgClass?: string
}) {
  const t = useTranslations('home.adBanners')
  const title = t(`${id}.title`)
  const accent = t(`${id}.accent`)

  return (
    <section aria-label={`${title} ${accent}`} className="relative w-full overflow-hidden bg-black">
      <div className="relative flex min-h-[60vh] items-end md:min-h-[74vh] md:items-center">
        <Image
          src={image}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          quality={90}
          priority={priority}
          className={`object-cover brightness-110 ${imgClass}`}
        />

        {/* Dégradé bas (texte lisible) - allégé pour une image nette et claire. */}
        <div aria-hidden="true" className="absolute inset-0 z-[1] bg-gradient-to-t from-black/60 via-black/12 to-transparent" />
        {/* Renfort léger à gauche (desktop, texte aligné à gauche) */}
        <div aria-hidden="true" className="absolute inset-0 z-[1] hidden md:block bg-gradient-to-r from-black/45 via-black/8 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-12 md:pb-0">
          <div className="max-w-2xl [text-shadow:0_2px_18px_rgba(0,0,0,0.65)]">
            <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
              {title} <span className="text-sport-orange">{accent}</span>
            </h2>

            {/* Crédibilité : note + nombre d'athlètes (preuve sociale) */}
            <div className="mt-5 flex items-center gap-2.5">
              <span className="flex gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} className="text-sport-orange" fill="currentColor" />
                ))}
              </span>
              <span className="text-sm font-semibold text-white/90">{t('proof')}</span>
            </div>

            {ctaHref && (
              <div className="mt-7">
                <Link href={ctaHref} className="btn-primary inline-flex items-center gap-2 text-base">
                  {t(`${id}.cta`)} <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
