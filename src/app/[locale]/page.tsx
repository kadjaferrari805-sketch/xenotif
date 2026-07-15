import { Hero } from '@/components/home/Hero'
import { FeatureCards } from '@/components/home/FeatureCards'
import { WhyXenotif } from '@/components/home/WhyXenotif'
import { VideoBand } from '@/components/home/VideoBand'
import { ExperiencePreview } from '@/components/home/ExperiencePreview'
import { Pricing } from '@/components/home/Pricing'
import { Reviews } from '@/components/home/Reviews'
import { FAQ } from '@/components/home/FAQ'
import { Newsletter } from '@/components/home/Newsletter'
import { StickyCheckout } from '@/components/home/StickyCheckout'
import { ProductShowcase } from '@/components/home/ProductShowcase'
import { FaqSchema } from '@/components/FaqSchema'
import { AppRatingSchema } from '@/components/AppRatingSchema'
import { getProductsLocalized } from '@/lib/boutique/products.en'
import { setRequestLocale } from 'next-intl/server'

// Accueil épuré façon Strava : hero → 3 cartes → piliers → disciplines →
// aperçu produit → abonnement → preuve → FAQ. Focalisé, sans vitrines/promos.
// setRequestLocale → rendu statique/CDN (sinon next-intl bascule en dynamique).
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  // Vitrine compacte en bas de home : 4 produits affiliés recommandés
  // (promos d'abord, puis meilleures notes).
  const recommended = getProductsLocalized(locale)
    .filter((p) => p.isAffiliate)
    .sort((a, b) => (b.original_price_cents ? 1 : 0) - (a.original_price_cents ? 1 : 0) || b.rating - a.rating)
    .slice(0, 4)

  return (
    <>
      <FaqSchema />
      <AppRatingSchema />
      <Hero />
      {/* Ce que tu obtiens - 3 cartes (façon Strava) */}
      <FeatureCards />
      {/* Pourquoi Xenotif - 3 piliers de différenciation */}
      <WhyXenotif />
      {/* Bande vidéo pleine largeur - créative de marque « coureur » */}
      <VideoBand />
      {/* Aperçu de l'espace membre - « dive into details » */}
      <ExperiencePreview />
      {/* Abonnement */}
      <Pricing />
      {/* Preuve sociale */}
      <Reviews />
      {/* Vitrine compacte - produits affiliés recommandés (bas de home) */}
      <ProductShowcase section="recommended" products={recommended} dark />
      <FAQ />
      <Newsletter />
      <StickyCheckout />
    </>
  )
}
