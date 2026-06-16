'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProductCard } from '@/components/boutique/ProductCard'
import type { Product } from '@/lib/boutique/products'

// Vitrine produits affiliés sur l'accueil. Réutilise ProductCard (image, note ★,
// prix, promo, CTA Amazon). `section` = clé i18n (recommended | bestsellers | selections).
export function ProductShowcase({
  section,
  products,
  dark = false,
}: {
  section: 'recommended' | 'bestsellers' | 'selections'
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
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/boutique" className="btn-primary inline-flex items-center gap-2">
            {t('viewAll')} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
