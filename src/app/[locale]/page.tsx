import { Hero } from '@/components/home/Hero'
import { FeatureCards } from '@/components/home/FeatureCards'
import { WhyXenotif } from '@/components/home/WhyXenotif'
import { Features } from '@/components/home/Features'
import { ExperiencePreview } from '@/components/home/ExperiencePreview'
import { Pricing } from '@/components/home/Pricing'
import { Reviews } from '@/components/home/Reviews'
import { FAQ } from '@/components/home/FAQ'
import { Newsletter } from '@/components/home/Newsletter'
import { StickyCheckout } from '@/components/home/StickyCheckout'
import { FaqSchema } from '@/components/FaqSchema'
import { AppRatingSchema } from '@/components/AppRatingSchema'
import { setRequestLocale } from 'next-intl/server'

// Accueil épuré façon Strava : hero → 3 cartes → piliers → disciplines →
// aperçu produit → abonnement → preuve → FAQ. Focalisé, sans vitrines/promos.
// setRequestLocale → rendu statique/CDN (sinon next-intl bascule en dynamique).
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <FaqSchema />
      <AppRatingSchema />
      <Hero />
      {/* Ce que tu obtiens — 3 cartes (façon Strava) */}
      <FeatureCards />
      {/* Pourquoi Xenotif — 3 piliers de différenciation */}
      <WhyXenotif />
      {/* Multi-disciplines */}
      <Features />
      {/* Aperçu de l'espace membre — « dive into details » */}
      <ExperiencePreview />
      {/* Abonnement */}
      <Pricing />
      {/* Preuve sociale */}
      <Reviews />
      <FAQ />
      <Newsletter />
      <StickyCheckout />
    </>
  )
}
