import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/providers/Providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Xenotif — neckZen Massage Pro | Masseur cervical intelligent',
  description: "Le neckZen massage combine chaleur thérapeutique, impulsions basse fréquence et 16 niveaux d'intensité pour soulager vos tensions cervicales.",
  keywords: ['masseur cervical', 'douleur cou', 'neckzen', 'massage cervical', 'bien-être'],
  openGraph: {
    title: 'Xenotif — neckZen Massage Pro',
    description: 'Dites adieu aux douleurs cervicales avec le neckZen',
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
