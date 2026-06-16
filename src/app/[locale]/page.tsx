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
      <Features />
      <HowItWorks />
      <CoachAd />
      <IntensityLevels />
      <Pricing />
      <Reviews />
      <CustomerReviews kind="platform" />
      <TransformationsGallery />
      <FAQ />
      <Newsletter />
      <StickyCheckout />
    </>
  )
}
