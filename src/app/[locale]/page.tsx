import { Hero } from '@/components/home/Hero'
import { MarqueeStrip } from '@/components/home/MarqueeStrip'
import { ProofBar } from '@/components/home/ProofBar'
import { Features } from '@/components/home/Features'
import { HowItWorks } from '@/components/home/HowItWorks'
import { IntensityLevels } from '@/components/home/IntensityLevels'
import { Pricing } from '@/components/home/Pricing'
import { Reviews } from '@/components/home/Reviews'
import { FAQ } from '@/components/home/FAQ'
import { Newsletter } from '@/components/home/Newsletter'
import { CustomerReviews } from '@/components/reviews/CustomerReviews'

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <ProofBar />
      <Features />
      <HowItWorks />
      <IntensityLevels />
      <Pricing />
      <Reviews />
      <CustomerReviews kind="platform" />
      <FAQ />
      <Newsletter />
    </>
  )
}
