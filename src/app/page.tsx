import { Hero } from '@/components/home/Hero'
import { ProofBar } from '@/components/home/ProofBar'
import { Features } from '@/components/home/Features'
import { HowItWorks } from '@/components/home/HowItWorks'
import { IntensityLevels } from '@/components/home/IntensityLevels'
import { Reviews } from '@/components/home/Reviews'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofBar />
      <Features />
      <HowItWorks />
      <IntensityLevels />
      <Reviews />
      <Newsletter />
    </>
  )
}
