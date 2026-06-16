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
      <Features />
      {/* Bandeau pub #1 — Hero performance + CTA */}
      <AdBanner
        ariaLabel="Transform Your Body. Unlock Your Potential."
        image="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1920&q=80"
        title="Transform Your Body."
        accent="Unlock Your Potential."
        cta={{ label: 'Start Free Today', href: '/auth/signup' }}
        logo="visible"
      />
      <HowItWorks />
      <CoachAd />
      <IntensityLevels />
      {/* Bandeau pub #2 — Performance & discipline */}
      <AdBanner
        ariaLabel="Train Like Never Before"
        image="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80"
        title="Train Like"
        accent="Never Before."
        logo="visible"
      />
      <Pricing />
      <Reviews />
      <CustomerReviews kind="platform" />
      {/* Bandeau pub #3 — Communauté & résultats */}
      <AdBanner
        ariaLabel="Join The XENOTIF Movement"
        image="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920"
        title="Join The"
        accent="XENOTIF Movement."
        cta={{ label: 'Start Free Today', href: '/auth/signup' }}
        logo="discreet"
      />
      <TransformationsGallery />
      <FAQ />
      <Newsletter />
      <StickyCheckout />
    </>
  )
}
