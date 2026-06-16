'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Flame, Star, Crown } from 'lucide-react'
import { trackProductClick } from '@/lib/analytics'
import { formatPrice, type Product } from '@/lib/boutique/products'

const ICON = { promo: Flame, popular: Star, premium: Crown }

// Bannière promo produit (cross-sell affilié) : image produit + offre + prix/-% + CTA.
export function PromoBanner({
  variant,
  product,
}: {
  variant: 'promo' | 'popular' | 'premium'
  product?: Product
}) {
  const t = useTranslations('home.promoBanners')
  if (!product) return null

  const Icon = ICON[variant]
  const discount = product.original_price_cents
    ? Math.round((1 - product.price_cents / product.original_price_cents) * 100)
    : null
  const href = product.isAffiliate && product.amazon ? product.amazon.affiliateUrl : undefined

  const ctaInner = (
    <>
      {t(`${variant}.cta`)} <ArrowRight size={16} aria-hidden="true" />
    </>
  )
  const cta = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackProductClick(product, `promo_${variant}`)}
      className="btn-primary inline-flex w-fit items-center gap-2"
    >
      {ctaInner}
    </a>
  ) : (
    <Link
      href={`/boutique/${product.slug}`}
      onClick={() => trackProductClick(product, `promo_${variant}`)}
      className="btn-primary inline-flex w-fit items-center gap-2"
    >
      {ctaInner}
    </Link>
  )

  return (
    <section aria-label={t(`${variant}.title`)} className="bg-sport-dark px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="relative grid overflow-hidden rounded-3xl border border-sport-border bg-sport-card md:grid-cols-2">
          <div className="relative z-10 flex flex-col justify-center gap-3 p-8 md:p-10">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-sport-orange/30 bg-sport-orange/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-sport-orange">
              <Icon size={12} aria-hidden="true" /> {t(`${variant}.label`)}
            </span>
            <h3 className="text-2xl font-black leading-tight text-white md:text-3xl">{t(`${variant}.title`)}</h3>
            <p className="line-clamp-2 text-sm text-sport-gray">{product.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">{formatPrice(product.price_cents)}</span>
              {product.original_price_cents && (
                <span className="text-sm text-sport-gray line-through">{formatPrice(product.original_price_cents)}</span>
              )}
              {discount && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">-{discount}%</span>}
            </div>
            <div className="mt-2">{cta}</div>
          </div>
          <div className="relative min-h-[220px] md:min-h-[260px]">
            <Image
              src={product.images[0] ?? ''}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={product.imageFit === 'contain' ? 'object-contain p-4' : 'object-cover'}
            />
            <div aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-16 bg-gradient-to-r from-sport-card to-transparent md:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
