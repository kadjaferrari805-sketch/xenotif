import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import Script from 'next/script'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'
import { ConditionalChrome } from '@/components/layout/ConditionalChrome'
import { Providers } from '@/providers/Providers'
import { OrganizationSchema, WebsiteSchema } from '@/components/SchemaOrg'
import { MetaPixelRouteTracker } from '@/components/analytics/MetaPixel'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'
import { SmoothScroll } from '@/components/premium/SmoothScroll'
import { ScrollReveal } from '@/components/premium/ScrollReveal'
import { Preloader } from '@/components/premium/Preloader'
import { ConsentBanner } from '@/components/consent/ConsentBanner'
import { EU_COUNTRIES } from '@/lib/consent'

// Liste des codes pays UE/EEE/UK/CH pour le paramètre `region` du Consent Mode v2.
const EU_REGION = EU_COUNTRIES.map((c) => `'${c}'`).join(',')

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
// Orbitron = wordmark/identité de marque uniquement (police variable → pas de `weight`).
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' })

const SITE = 'https://xenotif.com'
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
// Google Ads : tag de conversion (AW-XXXXXXXXX). Activé uniquement si l'ID est
// défini en env (comme le Meta Pixel) → aucun identifiant en dur.
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
const LOCALE_OG: Record<string, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  de: 'de_DE',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// viewport-fit=cover : PWA edge-to-edge ; les barres fixes gèrent les safe-areas via env().
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  const languages: Record<string, string> = { 'x-default': SITE }
  for (const l of routing.locales) {
    languages[l] = l === routing.defaultLocale ? SITE : `${SITE}/${l}`
  }

  return {
    metadataBase: new URL(SITE),
    title: { default: t('metaTitle'), template: '%s | Xenotif®' },
    description: t('metaDescription'),
    // PWA : manifest + support iOS « Ajouter à l'écran d'accueil » (mode standalone).
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, title: 'Xenotif', statusBarStyle: 'black-translucent' },
    keywords: [
      'fitness', 'sport', 'coaching IA', 'running', 'musculation',
      'HIIT', 'CrossFit', 'natation', 'cyclisme', 'programme sportif',
      'abonnement fitness', 'application sport',
    ],
    authors: [{ name: 'Xenotif®', url: SITE }],
    creator: 'Xenotif®',
    publisher: 'Xenotif®',
    alternates: { canonical: languages[locale] ?? SITE, languages },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: languages[locale] ?? SITE,
      siteName: 'Xenotif®',
      type: 'website',
      locale: LOCALE_OG[locale] ?? 'fr_FR',
      // Image OG servie sous /api/og (hors proxy i18n → URL absolue stable, sans redirection).
      images: [
        {
          url: `${SITE}/api/og`,
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: 'XENOTIF® — Coaching fitness premium',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
      images: [`${SITE}/api/og`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    verification: {
      google: '2kJvq3omakuRUmacSG5OcvKqNZCNofHayAK7f-vVA-c',
      other: { 'facebook-domain-verification': 'y0g2u1svmulsb3zliptibgaw8gjyj3' },
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        {/* Avant le paint : (1) `html.js-reveal` → reveal des titres actif seulement
            si JS (sans flash) ; (2) `html.preloaded` si le préchargeur a déjà été vu
            cette session → on ne le rejoue pas (affiché une seule fois / session). */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){var d=document.documentElement;d.classList.add('js-reveal');try{if(sessionStorage.getItem('xeno_pl'))d.classList.add('preloaded');else sessionStorage.setItem('xeno_pl','1');}catch(e){}})()" }} />
        {/* Google Consent Mode v2 — DOIT être posé avant gtag/fbq. Défaut : accordé
            partout, SAUF UE/EEE/UK/CH (region) où c'est refusé tant que l'utilisateur
            n'a pas accepté. Un choix déjà stocké est ré-appliqué immédiatement, et
            window.__xenoMeta indique au Pixel Meta s'il doit retenir le PageView. */}
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',functionality_storage:'granted',security_storage:'granted'});gtag('consent','default',{region:[${EU_REGION}],ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});try{var c=localStorage.getItem('xeno_consent');if(c==='granted'){gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});window.__xenoMeta='grant';}else if(c==='denied'){gtag('consent','update',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});window.__xenoMeta='revoke';}else{window.__xenoMeta='pending';}}catch(e){window.__xenoMeta='pending';}` }} />
        {/* Preconnect aux origines tierces chargées après hydratation (analytics)
            → ouvre DNS/TCP/TLS en amont, ~300ms gagnés (audit Lighthouse). */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://region1.google-analytics.com" />
      </head>
      <body>
        <Preloader />
        <NextIntlClientProvider>
          <Providers>
            <ConditionalChrome>{children}</ConditionalChrome>
          </Providers>
          <ConsentBanner />
        </NextIntlClientProvider>
        <OrganizationSchema />
        <WebsiteSchema />

        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3H3JTM404V"
          strategy="lazyOnload"
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3H3JTM404V');${GOOGLE_ADS_ID ? `\n            gtag('config', '${GOOGLE_ADS_ID}');` : ''}
          `}
        </Script>

        {/* Meta Pixel (Facebook/Instagram Ads) — actif si NEXT_PUBLIC_META_PIXEL_ID est défini.
            Script d'init dans le layout (server) pour un chargement fiable, comme GA. */}
        {META_PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="lazyOnload">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');if(window.__xenoMeta==='grant'){fbq('consent','grant');fbq('track','PageView');}else{fbq('consent','revoke');}`}
            </Script>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <noscript><img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} alt="" /></noscript>
          </>
        )}
        <MetaPixelRouteTracker />
        <ServiceWorkerRegister />
        <SmoothScroll />
        <ScrollReveal />
      </body>
    </html>
  )
}
