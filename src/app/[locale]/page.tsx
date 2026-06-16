import { Hero } from '@/components/home/Hero'
import { TrustRow } from '@/components/home/TrustRow'
import { MarqueeStrip } from '@/components/home/MarqueeStrip'
import { ProofBar } from '@/components/home/ProofBar'
import { Features } from '@/components/home/Features'
import { HowItWorks } from '@/components/home/HowItWorks'
import { CoachAd } from '@/components/home/CoachAd'
import { IntensityLevels } from '@/components/home/IntensityLevels'
import { Pricing } from '@/components/home/Pricing'
import { Reviews } from '@/components/home/Reviews'
import { FAQ } from '@/components/home/FAQ'
import { Newsletter } from '@/components/home/Newsletter'
import { StickyCheckout } from '@/components/home/StickyCheckout'
import { CustomerReviews } from '@/components/reviews/CustomerReviews'
import { TransformationsGallery } from '@/components/transformations/TransformationsGallery'
import { FaqSchema } from '@/components/FaqSchema'
import { AdBanner } from '@/components/home/AdBanner'
import { ProductShowcase } from '@/components/home/ProductShowcase'
import { PromoBanner } from '@/components/home/PromoBanner'
import { getProductsLocalized } from '@/lib/boutique/products.en'
import type { Product } from '@/lib/boutique/products'
import { setRequestLocale } from 'next-intl/server'

// setRequestLocale → autorise le rendu statique (sinon next-intl bascule en
// dynamique via headers()). L'accueil devient prérendu/CDN (TTFB ~50ms).
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  // Vitrine produits affiliés (liens Amazon localisés par langue).
  const affiliate = getProductsLocalized(locale).filter((p) => p.isAffiliate)
  // Recommandés : promos d'abord, puis meilleures notes.
  const recommended = [...affiliate]
    .sort((a, b) => (b.original_price_cents ? 1 : 0) - (a.original_price_cents ? 1 : 0) || b.rating - a.rating)
    .slice(0, 8)
  // Best sellers : plus d'avis.
  const bestsellers = [...affiliate].sort((a, b) => b.reviews - a.reviews).slice(0, 8)
  // Sélections : un produit par catégorie (diversité).
  const byCat = new Map<string, Product>()
  for (const p of affiliate) if (!byCat.has(p.category)) byCat.set(p.category, p)
  const selections = [...byCat.values()].slice(0, 8)

  // Bannières promo : meilleure promo, plus populaire, plus premium (prix élevé).
  const disc = (p: Product) => (p.original_price_cents ? 1 - p.price_cents / p.original_price_cents : 0)
  const promoProduct = [...affiliate].filter((p) => p.original_price_cents).sort((a, b) => disc(b) - disc(a))[0]
  const popularProduct = bestsellers[0]
  const premiumProduct = [...affiliate].sort((a, b) => b.price_cents - a.price_cents)[0]

  return (
    <>
      <FaqSchema />
      <Hero />
      <TrustRow />
      <MarqueeStrip />
      <ProofBar />
      {/* Vitrine produits affiliés — visible dès le haut de page */}
      <ProductShowcase section="recommended" products={recommended} dark />
      {/* Bandeau pub — Transforme ton corps (+ CTA) */}
      <AdBanner
        id="transform"
        image="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1920&q=80"
        ctaHref="/auth/signup"
      />
      <Features />
      <ProductShowcase section="bestsellers" products={bestsellers} />
      <HowItWorks />
      {/* Bannière promo — Promotions du moment */}
      <PromoBanner variant="promo" product={promoProduct} />
      <CoachAd />
      <IntensityLevels />
      {/* Bandeau pub — Entraîne-toi comme jamais */}
      <AdBanner
        id="train"
        image="https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />
      {/* Bannière promo — Best-seller populaire */}
      <PromoBanner variant="popular" product={popularProduct} />
      <Pricing />
      <ProductShowcase section="selections" products={selections} dark />
      <Reviews />
      <CustomerReviews kind="platform" />
      {/* Bandeau pub — Rejoins le mouvement (+ CTA) */}
      <AdBanner
        id="movement"
        image="https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&w=1920"
        ctaHref="/auth/signup"
      />
      <TransformationsGallery />
      {/* Bannière promo — Équipement premium */}
      <PromoBanner variant="premium" product={premiumProduct} />
      <FAQ />
      <Newsletter />
      <StickyCheckout />
    </>
  )
}
