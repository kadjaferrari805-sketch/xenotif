import { Hero } from '@/components/home/Hero'
import { TrustRow } from '@/components/home/TrustRow'
import { MarqueeStrip } from '@/components/home/MarqueeStrip'
import { ProofBar } from '@/components/home/ProofBar'
import { WhyXenotif } from '@/components/home/WhyXenotif'
import { Challenges } from '@/components/home/Challenges'
import { Features } from '@/components/home/Features'
import { HowItWorks } from '@/components/home/HowItWorks'
import { ExperiencePreview } from '@/components/home/ExperiencePreview'
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
import { AppRatingSchema } from '@/components/AppRatingSchema'
import { AdBanner } from '@/components/home/AdBanner'
import { ProductShowcase } from '@/components/home/ProductShowcase'
import { ProgramsShowcase } from '@/components/home/ProgramsShowcase'
import { BlogShowcase } from '@/components/home/BlogShowcase'
import { PromoBanner } from '@/components/home/PromoBanner'
import { getProductsLocalized } from '@/lib/boutique/products.en'
import type { Product } from '@/lib/boutique/products'
import { getAllPostsLocalized } from '@/lib/blog/posts.en'
import { setRequestLocale } from 'next-intl/server'

// setRequestLocale → autorise le rendu statique (sinon next-intl bascule en
// dynamique via headers()). L'accueil devient prérendu/CDN (TTFB ~50ms).
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const allProducts = getProductsLocalized(locale)
  // Vitrine produits affiliés (liens Amazon localisés par langue).
  const affiliate = allProducts.filter((p) => p.isAffiliate)
  // Programmes digitaux XENOTIF® (PDF premium), les plus populaires d'abord.
  const digitalPrograms = [...allProducts]
    .filter((p) => p.type === 'digital')
    .sort((a, b) => b.reviews - a.reviews)
  // Recommandés : promos d'abord, puis meilleures notes.
  const recommended = [...affiliate]
    .sort((a, b) => (b.original_price_cents ? 1 : 0) - (a.original_price_cents ? 1 : 0) || b.rating - a.rating)
    .slice(0, 8)
  // Bannières promo : meilleure remise + best-seller (le plus d'avis).
  const disc = (p: Product) => (p.original_price_cents ? 1 - p.price_cents / p.original_price_cents : 0)
  const promoProduct = [...affiliate].filter((p) => p.original_price_cents).sort((a, b) => disc(b) - disc(a))[0]
  const popularProduct = [...affiliate].sort((a, b) => b.reviews - a.reviews)[0]
  // Derniers articles du blog (déjà triés par date) pour le carrousel « Conseils Fitness ».
  const latestPosts = getAllPostsLocalized(locale).slice(0, 6)

  return (
    <>
      <FaqSchema />
      <AppRatingSchema />
      <Hero />
      <TrustRow />
      <MarqueeStrip />
      <ProofBar />
      {/* Positionnement / différenciation — 3 piliers, haut de page */}
      <WhyXenotif />
      {/* Vitrine produits affiliés — visible dès le haut de page */}
      <ProductShowcase section="recommended" products={recommended} dark />
      {/* Bandeau pub — Transforme ton corps (+ CTA) */}
      <AdBanner
        id="transform"
        image="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1920&q=80"
        ctaHref="/auth/signup"
      />
      <Features />
      {/* Carrousel « Nos programmes populaires » — juste après les disciplines */}
      <ProgramsShowcase programs={digitalPrograms} />
      <HowItWorks />
      {/* Aperçu de l'espace membre — confiance avant inscription (→ /dashboard-preview) */}
      <ExperiencePreview />
      {/* Bannière promo — Promotions du moment */}
      <PromoBanner variant="promo" product={promoProduct} />
      <CoachAd />
      <IntensityLevels />
      {/* Défis — engagement/rétention (objectifs guidés → /defis) */}
      <Challenges />
      {/* Bandeau pub — Entraîne-toi comme jamais */}
      <AdBanner
        id="train"
        image="https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />
      {/* Bannière promo — Best-seller populaire */}
      <PromoBanner variant="popular" product={popularProduct} />
      <Pricing />
      <Reviews />
      <CustomerReviews kind="platform" />
      <TransformationsGallery />
      {/* Carrousel « Conseils Fitness » — derniers articles du blog (SEO + temps passé) */}
      <BlogShowcase posts={latestPosts} />
      <FAQ />
      <Newsletter />
      <StickyCheckout />
    </>
  )
}
