'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Lock, Truck, RotateCcw } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Carousel } from '@/components/ui/Carousel'
import { ProductCard } from '@/components/boutique/ProductCard'
import type { Product } from '@/lib/boutique/products'

// Vitrine produits affiliés sur l'accueil. Réutilise ProductCard (image, note ★,
// prix, promo, CTA Amazon). `section` = clé i18n (recommended | bestsellers | selections).
export function ProductShowcase({
  section,
  products,
  dark = false,
}: {
  section: 'recommended'
  products: Product[]
  dark?: boolean
}) {
  const t = useTranslations('home.productShowcase')
  if (products.length === 0) return null

  return (
    <section
      aria-labelledby={`shop-${section}`}
      className={`px-6 py-20 ${dark ? 'bg-sport-dark' : 'bg-sport-card border-y border-sport-border'}`}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          id={`shop-${section}`}
          label={t(`${section}.label`)}
          title={t(`${section}.title`)}
          subtitle={t(`${section}.subtitle`)}
        />
        <Carousel className="mt-12">
          {products.map((p, i) => (
            <div key={p.id} className="mr-4 w-[260px] shrink-0 sm:w-[280px]">
              <ProductCard product={p} index={i} source={`home_${section}`} />
            </div>
          ))}
        </Carousel>

        {/* Badges de confiance (achat via Amazon) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-sport-gray">
          <span className="inline-flex items-center gap-1.5"><Lock size={13} aria-hidden="true" className="text-sport-orange" /> {t('trust.secure')}</span>
          <span className="inline-flex items-center gap-1.5"><Truck size={13} aria-hidden="true" className="text-sport-orange" /> {t('trust.delivery')}</span>
          <span className="inline-flex items-center gap-1.5"><RotateCcw size={13} aria-hidden="true" className="text-sport-orange" /> {t('trust.returns')}</span>
        </div>

        <div className="mt-8 text-center">
          <Link href="/boutique" className="btn-primary inline-flex items-center gap-2">
            {t('viewAll')} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
