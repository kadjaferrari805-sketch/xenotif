import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/providers/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Xenotif® — Forge ton corps. Dépasse tes limites.',
  description:
    'La plateforme sport ultime — 50+ programmes, coaching IA, 8 disciplines. Rejoins 12 000+ athlètes qui transforment leur corps avec Xenotif®.',
  keywords: ['sport', 'fitness', 'coaching', 'running', 'musculation', 'HIIT', 'CrossFit', 'programme sportif'],
  openGraph: {
    title: 'Xenotif® — Forge ton corps. Dépasse tes limites.',
    description: 'La plateforme sport ultime pour athlètes de tous niveaux.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
