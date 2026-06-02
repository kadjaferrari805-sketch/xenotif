'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

// Décide d'afficher (ou non) le chrome marketing (Nav/Footer) selon la route.
// Côté CLIENT via usePathname() — contrairement à headers() côté serveur, ce
// hook ne force PAS le rendu dynamique, ce qui laisse les pages publiques se
// prérendre en statique. Le pathname inclut le préfixe locale pour /en
// (ex. /en/dashboard) → on teste avec includes() pour couvrir fr + en.
export function ConditionalChrome({ children }: { children: ReactNode }) {
  const t = useTranslations('common')
  const pathname = usePathname()
  const isAppRoute = pathname.includes('/dashboard') || pathname.includes('/admin')

  if (isAppRoute) return <>{children}</>

  return (
    <>
      <a href="#contenu-principal" className="skip-link">
        {t('skipLink')}
      </a>
      <Nav />
      <main id="contenu-principal" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}
