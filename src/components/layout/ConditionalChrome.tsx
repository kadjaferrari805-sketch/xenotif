'use client'

import type { ReactNode } from 'react'
import { usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { FreeProgramPopup } from '@/components/home/FreeProgramPopup'

/**
 * Routes applicatives : celles qui rendent leur propre coque (barre latérale,
 * navigation interne) et ne doivent donc pas recevoir le chrome marketing.
 *
 * Prédicat repris À L'IDENTIQUE de la garde de `src/proxy.ts` : comparaison par
 * PRÉFIXE EXACT. Ni `includes('/dashboard')` ni `startsWith('/dashboard')` ne
 * conviennent - les deux classent `/dashboard-preview` comme applicative.
 * Or cet aperçu est PUBLIC (le proxy le laisse passer, `proxy.test.ts` le
 * verrouille, `sitemap.ts` le publie) : le ranger ici lui ferait perdre Nav,
 * Footer, skip-link et son repère `<main>`.
 */
export function estRouteApplicative(chemin: string): boolean {
  return (
    chemin === '/dashboard' ||
    chemin.startsWith('/dashboard/') ||
    chemin === '/admin' ||
    chemin.startsWith('/admin/')
  )
}

// Décide d'afficher (ou non) le chrome marketing (Nav/Footer) selon la route.
// Côté CLIENT via usePathname() - contrairement à headers() côté serveur, ce
// hook ne force PAS le rendu dynamique, ce qui laisse les pages publiques se
// prérendre en statique. Celui de `@/i18n/navigation` (déjà utilisé par
// Nav.tsx) renvoie en outre le chemin SANS préfixe de locale : le prédicat
// ci-dessus est donc exactement celui du proxy, qui raisonne lui aussi sur un
// chemin dépouillé, au lieu de devoir composer avec /en, /de…
export function ConditionalChrome({ children }: { children: ReactNode }) {
  const t = useTranslations('common')
  const pathname = usePathname()

  if (estRouteApplicative(pathname)) return <>{children}</>

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
      {/* Pop-up lead magnet (timing/exit-intent, 1×/visiteur, exclut auth/checkout) */}
      <FreeProgramPopup />
    </>
  )
}
