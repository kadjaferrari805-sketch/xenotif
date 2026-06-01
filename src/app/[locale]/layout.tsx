import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import Script from 'next/script'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/providers/Providers'
import { OrganizationSchema, WebsiteSchema } from '@/components/SchemaOrg'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const SITE = 'https://xenotif.com'
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
    verification: { google: '2kJvq3omakuRUmacSG5OcvKqNZCNofHayAK7f-vVA-c' },
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

  const headersList = await headers()
  const currentPath = headersList.get('x-current-path') ?? '' // déjà sans préfixe locale (proxy)
  const isAppRoute = currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin')

  const t = await getTranslations('common')

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <a href="#contenu-principal" className="skip-link">
          {t('skipLink')}
        </a>
        <NextIntlClientProvider>
          <Providers>
            {isAppRoute ? (
              children
            ) : (
              <>
                <Nav />
                <main id="contenu-principal" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
              </>
            )}
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
      </body>
    </html>
  )
}
