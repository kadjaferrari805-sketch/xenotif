import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'

/**
 * Phase 09.8.4 — chrome public conditionnel.
 *
 * MOCK LOCAL DE `next/navigation` : `jest.setup.ts` en pose déjà un global qui
 * renvoie TOUJOURS '/'. Sans surcharge locale, chaque cas ci-dessous testerait
 * en réalité la même route et la suite serait verte pour de mauvaises raisons.
 * `mockPath` est donc piloté par test — convention déjà employée par
 * `src/components/home/FreeProgramPopup.test.tsx`.
 *
 * `@/i18n/navigation` n'est délibérément PAS mocké : c'est justement le
 * dépouillage du préfixe de locale par next-intl que l'on veut exercer pour de
 * vrai (`useBasePathname` combine `usePathname()` et `useLocale()`). La locale
 * est fournie par le provider de `renderWithIntl(ui, locale)`.
 */
let mockPath = '/'
jest.mock('next/navigation', () => ({ usePathname: () => mockPath }))

/**
 * Les trois enfants ne sont pas l'unité sous test : ils sont remplacés par des
 * marqueurs inertes. CHEMINS RELATIFS obligatoires — l'alias `@/` est réécrit
 * par SWC à la transformation et n'est jamais résolu par le resolver de Jest.
 *
 * Les assertions portent malgré tout D'ABORD sur le DOM que ConditionalChrome
 * produit LUI-MÊME (le skip-link et `<main id="contenu-principal">`), afin
 * qu'un marqueur mal câblé ne puisse pas fabriquer un faux vert.
 */
jest.mock('./Nav', () => ({ Nav: () => <nav data-testid="nav-stub" /> }))
jest.mock('./Footer', () => ({ Footer: () => <footer data-testid="footer-stub" /> }))
jest.mock('../home/FreeProgramPopup', () => ({
  FreeProgramPopup: () => <div data-testid="popup-stub" />,
}))

import { ConditionalChrome, estRouteApplicative } from './ConditionalChrome'

function rendre(chemin: string, locale = 'fr') {
  mockPath = chemin
  renderWithIntl(
    <ConditionalChrome>
      <p>contenu de page</p>
    </ConditionalChrome>,
    locale,
  )
}

/** Le chrome public, tel que ConditionalChrome seul peut le produire. */
function chromeAffiche(): boolean {
  return (
    screen.queryByRole('link', { name: /aller au contenu principal/i }) !== null &&
    screen.queryByRole('main') !== null &&
    screen.queryByTestId('nav-stub') !== null &&
    screen.queryByTestId('footer-stub') !== null
  )
}

afterEach(() => {
  mockPath = '/'
})

// ─── 1. Routes publiques : le chrome doit être présent ────────────────────

describe('ConditionalChrome — routes publiques', () => {
  it.each(['/', '/blog', '/boutique', '/coaching'])('%s affiche le chrome public', (chemin) => {
    rendre(chemin)
    expect(chromeAffiche()).toBe(true)
  })

  it('le contenu est enveloppé dans le repère <main>, pas seulement rendu à côté', () => {
    rendre('/')
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'contenu-principal')
    expect(main).toContainElement(screen.getByText('contenu de page'))
  })
})

// ─── 2. Routes applicatives : le chrome doit être absent ──────────────────

describe('ConditionalChrome — routes applicatives', () => {
  it.each(['/dashboard', '/dashboard/progression', '/admin', '/admin/content'])(
    '%s masque le chrome public',
    (chemin) => {
      rendre(chemin)
      expect(chromeAffiche()).toBe(false)
      // Le contenu reste rendu : seul le chrome disparaît.
      expect(screen.getByText('contenu de page')).toBeInTheDocument()
    },
  )

  it.each([
    ['/en/dashboard', 'en'],
    ['/de/admin/content', 'de'],
  ])('%s (locale %s) masque aussi le chrome', (chemin, locale) => {
    rendre(chemin, locale)
    expect(chromeAffiche()).toBe(false)
  })
})

// ─── 3. LE CŒUR DE LA PHASE : /dashboard-preview est PUBLIQUE ─────────────
//
// `src/proxy.ts` la laisse publique, `src/proxy.test.ts` le verrouille et
// `src/app/sitemap.ts` la publie. Elle doit donc recevoir le chrome marketing.

describe('ConditionalChrome — /dashboard-preview est une route PUBLIQUE', () => {
  it('/dashboard-preview affiche le chrome public', () => {
    rendre('/dashboard-preview')
    expect(chromeAffiche()).toBe(true)
  })

  it('/en/dashboard-preview affiche le chrome public', () => {
    rendre('/en/dashboard-preview', 'en')
    expect(chromeAffiche()).toBe(true)
  })

  it('/dashboard-preview fournit bien un repère <main>', () => {
    rendre('/dashboard-preview')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'contenu-principal')
  })
})

// ─── 4. Contrôle négatif : les prédicats qui reproduisent le bug ──────────
//
// Une suite verte ne prouve rien tant qu'on n'a pas montré qu'elle sait
// distinguer le bon prédicat du mauvais. Mêmes pièges que ceux documentés
// dans `src/proxy.test.ts` pour la garde d'authentification.

describe('ConditionalChrome — contrôle négatif des prédicats', () => {
  const parIncludes = (p: string) => p.includes('/dashboard') || p.includes('/admin')
  const parStartsWith = (p: string) => p.startsWith('/dashboard') || p.startsWith('/admin')

  it('includes("/dashboard") — le prédicat historique — classe /dashboard-preview comme applicative', () => {
    expect(parIncludes('/dashboard-preview')).toBe(true) // piège
    expect(estRouteApplicative('/dashboard-preview')).toBe(false) // comportement attendu
  })

  it('startsWith("/dashboard") reproduirait exactement le même bug', () => {
    expect(parStartsWith('/dashboard-preview')).toBe(true) // piège
    expect(estRouteApplicative('/dashboard-preview')).toBe(false) // comportement attendu
  })

  it('aucun des deux pièges ne se contente d’être faux partout', () => {
    // Contrôle du contrôle : les prédicats fautifs restent corrects sur les
    // vraies routes applicatives — leur seul défaut est le faux positif.
    expect(parIncludes('/dashboard')).toBe(true)
    expect(parStartsWith('/admin/content')).toBe(true)
  })
})

// ─── 5. Anti-régression : routes voisines par le nom ──────────────────────

describe('ConditionalChrome — anti-régression sur les routes voisines', () => {
  it.each(['/dashboard-preview', '/dashboard-preview/foo', '/admin-preview', '/dashboarder'])(
    '%s n’est PAS une route applicative',
    (chemin) => {
      expect(estRouteApplicative(chemin)).toBe(false)
    },
  )

  it.each([
    '/dashboard',
    '/dashboard/',
    '/dashboard/progression',
    '/admin',
    '/admin/content',
    '/admin/content/un-slug',
  ])('%s EST une route applicative', (chemin) => {
    expect(estRouteApplicative(chemin)).toBe(true)
  })

  it.each(['/dashboard-preview/foo', '/admin-preview', '/dashboarder'])(
    '%s reçoit le chrome public au rendu',
    (chemin) => {
      rendre(chemin)
      expect(chromeAffiche()).toBe(true)
    },
  )
})
