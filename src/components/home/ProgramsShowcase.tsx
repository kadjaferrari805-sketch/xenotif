'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowRight, Star, Download, Signal, Clock } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Carousel } from '@/components/ui/Carousel'
import { Tilt3D } from '@/components/premium/Tilt3D'
import { formatPrice, type Product } from '@/lib/boutique/products'

// Carrousel « Nos programmes populaires » : met en avant les programmes digitaux
// XENOTIF® (PDF premium) déjà vendus en boutique. Chaque carte → fiche produit
// /boutique/[slug]. Réutilise Carousel (3D + swipe + flèches) et Tilt3D pour la
// cohérence avec le reste de l'accueil. Données 100 % localisées (products.en/.de).
export function ProgramsShowcase({ programs }: { programs: Product[] }) {
  const t = useTranslations('home.programs')
  const locale = useLocale()
  if (programs.length === 0) return null

  return (
    <section aria-labelledby="home-programs" className="px-6 py-20 bg-sport-card border-y border-sport-border">
      <div className="max-w-6xl mx-auto">
        <SectionHeader id="home-programs" label={t('label')} title={t('title')} subtitle={t('subtitle')} />

        <Carousel className="mt-12">
          {programs.map((p) => {
            const discount = p.original_price_cents
              ? Math.round((1 - p.price_cents / p.original_price_cents) * 100)
              : null
            return (
              <div key={p.id} className="mr-5 w-[270px] shrink-0 sm:w-[290px]">
                <Tilt3D max={13} className="relative rounded-2xl h-full">
                  <Link
                    href={`/boutique/${p.slug}`}
                    aria-label={t('discoverAria', { name: p.name })}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sport-border bg-sport-dark transition-all duration-300 hover:border-sport-orange/40 hover:shadow-2xl hover:shadow-sport-orange/10"
                  >
                    {/* Couverture */}
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={p.images[0] ?? ''}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 80vw, 290px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sport-dark via-sport-dark/20 to-transparent" />
                      {p.badge && (
                        <span className="absolute top-3 left-3 rounded-full bg-sport-orange px-2.5 py-1 text-[11px] font-black text-white shadow-lg">
                          {p.badge}
                        </span>
                      )}
                      {discount && (
                        <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-black text-white">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-sport-orange mb-1.5">
                        {t('eyebrow')}
                      </p>
                      <h3 className="text-sm font-black text-white leading-snug line-clamp-2 mb-3 group-hover:text-sport-orange transition-colors">
                        {p.name}
                      </h3>

                      {/* Badges niveau + durée (repli sur les features si absents) */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.level && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-sport-card border border-sport-border px-2.5 py-1 rounded-full">
                            <Signal size={11} className="text-sport-orange" aria-hidden="true" /> {p.level}
                          </span>
                        )}
                        {p.duration && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-sport-card border border-sport-border px-2.5 py-1 rounded-full">
                            <Clock size={11} className="text-sport-orange" aria-hidden="true" /> {p.duration}
                          </span>
                        )}
                        {!p.level && !p.duration && p.features.slice(0, 2).map((f) => (
                          <span key={f} className="text-[10px] text-sport-gray bg-sport-card border border-sport-border px-2.5 py-1 rounded-full line-clamp-1">
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* Note */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex" aria-hidden="true">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} className={i < Math.round(p.rating) ? 'fill-sport-orange text-sport-orange' : 'fill-sport-border text-sport-border'} />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-sport-orange">{p.rating}</span>
                        <span className="text-[10px] text-sport-gray">({p.reviews.toLocaleString(locale)})</span>
                      </div>

                      {/* Prix + CTA */}
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <div>
                          <span className="text-lg font-black text-white">{formatPrice(p.price_cents)}</span>
                          {p.original_price_cents && (
                            <span className="ml-1.5 text-xs text-sport-gray line-through">{formatPrice(p.original_price_cents)}</span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-sport-orange/15 border border-sport-orange/30 px-3 py-1.5 text-xs font-bold text-sport-orange group-hover:bg-sport-orange group-hover:text-white transition-all">
                          <Download size={12} aria-hidden="true" /> {t('discover')}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Tilt3D>
              </div>
            )
          })}
        </Carousel>

        <div className="mt-10 text-center">
          <Link href="/boutique/catalogue" className="btn-primary inline-flex items-center gap-2">
            {t('viewAll')} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
