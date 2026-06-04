import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const SITE = 'https://xenotif.com'
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const LOCALE_OG: Record<string, string> = {
  fr: 'fr_FR',
  en: 'en_US',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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
      // L'image OG est fournie par src/app/opengraph-image.tsx (générée à la volée).
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
      // Pas de twitter:image explicite → X se rabat sur l'image og:image générée.
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
    <html lang={locale} className={inter.variable}>
      <head>
        {/* Preconnect aux origines tierces chargées après hydratation (analytics)
            → ouvre DNS/TCP/TLS en amont, ~300ms gagnés (audit Lighthouse). */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://region1.google-analytics.com" />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <ConditionalChrome>{children}</ConditionalChrome>
          </Providers>
        </NextIntlClientProvider>
        <OrganizationSchema />
        <WebsiteSchema />

        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3H3JTM404V"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3H3JTM404V');
          `}
        </Script>

        {/* Meta Pixel (Facebook/Instagram Ads) — actif si NEXT_PUBLIC_META_PIXEL_ID est défini.
            Script d'init dans le layout (server) pour un chargement fiable, comme GA. */}
        {META_PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
            </Script>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <noscript><img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} alt="" /></noscript>
          </>
        )}
        <MetaPixelRouteTracker />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
