import { Hero } from '@/components/home/Hero'
import { TrustRow } from '@/components/home/TrustRow'
import { MarqueeStrip } from '@/components/home/MarqueeStrip'
import { ProofBar } from '@/components/home/ProofBar'
import { Features } from '@/components/home/Features'
import { HowItWorks } from '@/components/home/HowItWorks'
import { CoachDemo } from '@/components/home/CoachDemo'
import { IntensityLevels } from '@/components/home/IntensityLevels'
import { Pricing } from '@/components/home/Pricing'
import { Reviews } from '@/components/home/Reviews'
import { FAQ } from '@/components/home/FAQ'
import { Newsletter } from '@/components/home/Newsletter'
import { StickyCheckout } from '@/components/home/StickyCheckout'
import { CustomerReviews } from '@/components/reviews/CustomerReviews'
import { TransformationsGallery } from '@/components/transformations/TransformationsGallery'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustRow />
      <MarqueeStrip />
      <ProofBar />
      <Features />
      <HowItWorks />
      <CoachDemo />
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
