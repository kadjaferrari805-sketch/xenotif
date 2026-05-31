import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import Script from 'next/script'
import '../globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/providers/Providers'
import { OrganizationSchema, WebsiteSchema } from '@/components/SchemaOrg'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'Xenotif® — Forge ton corps. Dépasse tes limites.', template: '%s | Xenotif®' },
  description: 'La plateforme fitness premium — 10 disciplines, coaching IA personnalisé, 300+ séances. Rejoins 12 000+ athlètes qui transforment leur corps avec Xenotif®.',
  keywords: ['fitness', 'sport', 'coaching IA', 'running', 'musculation', 'HIIT', 'CrossFit', 'natation', 'cyclisme', 'programme sportif', 'abonnement fitness', 'application sport'],
  authors: [{ name: 'Xenotif®', url: 'https://xenotif.com' }],
  creator: 'Xenotif®',
  publisher: 'Xenotif®',
  openGraph: {
    title: 'Xenotif® — Forge ton corps. Dépasse tes limites.',
    description: 'La plateforme fitness premium — 10 disciplines, coaching IA, 12 000+ athlètes.',
    type: 'website',
    url: 'https://xenotif.com',
    siteName: 'Xenotif®',
    locale: 'fr_FR',
    // L'image OG est fournie par src/app/opengraph-image.tsx (générée à la volée).
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xenotif® — Forge ton corps. Dépasse tes limites.',
    description: 'La plateforme fitness premium — coaching IA, 10 disciplines, 12 000+ athlètes.',
    // Pas de twitter:image explicite → X se rabat sur l'image og:image générée.
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  metadataBase: new URL('https://xenotif.com'),
  alternates: { canonical: 'https://xenotif.com' },
  verification: { google: '2kJvq3omakuRUmacSG5OcvKqNZCNofHayAK7f-vVA-c' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const currentPath = headersList.get('x-current-path') ?? ''
  const isAppRoute = currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin')

  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <a href="#contenu-principal" className="skip-link">
          Aller au contenu principal
        </a>
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
