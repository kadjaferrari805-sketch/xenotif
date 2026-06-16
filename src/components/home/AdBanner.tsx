'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { XenotifMark, XenotifWordmark } from '@/components/ui/Logo'

// Bandeau publicitaire plein écran : photographie sportive pro + dégradé cinéma
// (noir + lueur orange) + logo XENOTIF® + accroche + CTA. Responsive.
export function AdBanner({
  image,
  title,
  accent,
  cta,
  logo = 'visible',
  priority = false,
  ariaLabel,
}: {
  image: string
  title: string
  accent?: string
  cta?: { label: string; href: string }
  logo?: 'visible' | 'discreet'
  priority?: boolean
  ariaLabel: string
}) {
  return (
    <section aria-label={ariaLabel} className="relative w-full overflow-hidden bg-black">
      <div className="relative flex min-h-[62vh] items-center md:min-h-[74vh]">
        <Image
          src={image}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority={priority}
          // Mobile : focal un peu plus haut ; desktop : centré.
          className="object-cover object-[center_32%] md:object-center"
        />

        {/* Dégradés cinéma : noir à gauche + base sombre + lueur orange premium */}
        <div aria-hidden="true" className="absolute inset-0 z-[1] bg-gradient-to-r from-black/88 via-black/45 to-black/15" />
        <div aria-hidden="true" className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-transparent to-black/25" />
        <div aria-hidden="true" className="absolute -left-1/4 bottom-0 z-[1] h-[70%] w-[55%] rounded-full bg-sport-orange/15 blur-[120px]" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <div className="max-w-2xl [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]">
            {logo === 'visible' ? (
              <span className="mb-6 inline-flex items-center gap-2.5">
                <XenotifMark size={34} />
                <XenotifWordmark className="text-xl" />
              </span>
            ) : (
              <span className="mb-6 inline-flex opacity-90">
                <XenotifMark size={30} />
              </span>
            )}

            <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl">
              {title}
              {accent && (
                <>
                  {' '}
                  <span className="text-sport-orange">{accent}</span>
                </>
              )}
            </h2>

            {cta && (
              <div className="mt-8">
                <Link href={cta.href} className="btn-primary inline-flex items-center gap-2 text-base">
                  {cta.label} <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
