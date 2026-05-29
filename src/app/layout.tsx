import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/providers/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'Xenotif® — Forge ton corps. Dépasse tes limites.', template: '%s | Xenotif®' },
  description: 'La plateforme fitness premium — 10 disciplines, coaching IA personnalisé, 300+ séances. Rejoins 12 000+ athlètes qui transforment leur corps avec Xenotif®.',
  keywords: ['fitness', 'sport', 'coaching IA', 'running', 'musculation', 'HIIT', 'CrossFit', 'natation', 'cyclisme', 'programme sportif', 'abonnement fitness', 'application sport'],
  authors: [{ name: 'Xenotif®', url: 'https://xenotif.vercel.app' }],
  creator: 'Xenotif®',
  publisher: 'Xenotif®',
  openGraph: {
    title: 'Xenotif® — Forge ton corps. Dépasse tes limites.',
    description: 'La plateforme fitness premium — 10 disciplines, coaching IA, 12 000+ athlètes.',
    type: 'website',
    url: 'https://xenotif.vercel.app',
    siteName: 'Xenotif®',
    locale: 'fr_FR',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Xenotif® — Plateforme Fitness Premium' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xenotif® — Forge ton corps. Dépasse tes limites.',
    description: 'La plateforme fitness premium — coaching IA, 10 disciplines, 12 000+ athlètes.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  metadataBase: new URL('https://xenotif.vercel.app'),
  alternates: { canonical: 'https://xenotif.vercel.app' },
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
      </body>
    </html>
  )
}
