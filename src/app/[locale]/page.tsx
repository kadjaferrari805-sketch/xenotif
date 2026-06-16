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
import { setRequestLocale } from 'next-intl/server'

// setRequestLocale → autorise le rendu statique (sinon next-intl bascule en
// dynamique via headers()). L'accueil devient prérendu/CDN (TTFB ~50ms).
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <FaqSchema />
      <Hero />
      <TrustRow />
      <MarqueeStrip />
      <ProofBar />
      {/* Bandeau pub — Transforme ton corps (+ CTA) */}
      <AdBanner
        id="transform"
        image="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1920&q=80"
        ctaHref="/auth/signup"
      />
      <Features />
      <HowItWorks />
      <CoachAd />
      <IntensityLevels />
      {/* Bandeau pub — Entraîne-toi comme jamais */}
      <AdBanner
        id="train"
        image="https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />
      <Pricing />
      <Reviews />
      <CustomerReviews kind="platform" />
      {/* Bandeau pub — Rejoins le mouvement (+ CTA) */}
      <AdBanner
        id="movement"
        image="https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg?auto=compress&cs=tinysrgb&w=1920"
        ctaHref="/auth/signup"
      />
      <TransformationsGallery />
      <FAQ />
      <Newsletter />
      <StickyCheckout />
    </>
  )
}
