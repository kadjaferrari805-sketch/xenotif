# i18n Phase 1 — Socle multilingue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Poser l'infrastructure i18n (`next-intl`) de xenotif.com : routing par langue, détection, sélecteur, repli FR, SEO `hreflang`, et localisation du chrome (nav/footer) + accueil + pages auth, sans casser l'existant.

**Architecture:** `next-intl` v4 sur Next.js 16 App Router. Toutes les routes de pages passent sous `src/app/[locale]/`. Le middleware `src/proxy.ts` compose la détection de locale (`next-intl`) avec l'auth Supabase existante. Les textes traduisibles vivent dans `messages/{locale}.json` ; les locales non-FR démarrent comme copie du FR (repli garanti, traduction en place ensuite). Les routes `app/api`, `sitemap.ts`, `robots.ts`, `opengraph-image.jpg`, `favicon.ico`, `apple-icon.png` restent à la racine de `app/`.

**Tech Stack:** Next.js 16.2.4, React 19, next-intl ^4, TypeScript, Jest + Testing Library, Tailwind.

**Périmètre Phase 1 :** infra + middleware + sélecteur + repli FR + SEO + extraction des chaînes : `common` (nav, footer, switcher), accueil (hero, sections, FAQ, tarifs, newsletter), pages `auth/*`.
**Hors Phase 1 (repli FR en attendant) :** contenu profond des disciplines, produits, blog, guides, dashboard, emails.

---

## Référence : décisions de la spec

Spec : `docs/superpowers/specs/2026-06-01-i18n-multilingue-design.md`.
- Locales : `fr` (défaut, **non préfixé**), `en`, `de`, `it`, `es` (préfixés).
- `localePrefix: 'as-needed'` → URLs FR inchangées.
- Détection `Accept-Language` + cookie `NEXT_LOCALE` + sélecteur.
- Repli FR pour toute clé non traduite.

---

## Structure des fichiers (Phase 1)

**Créés :**
- `src/i18n/routing.ts` — config des locales (`defineRouting`).
- `src/i18n/navigation.ts` — `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` locale-aware.
- `src/i18n/request.ts` — `getRequestConfig` (chargement messages + `getMessageFallback` → fr).
- `messages/fr.json` — source (rempli).
- `messages/en.json`, `messages/de.json`, `messages/it.json`, `messages/es.json` — copies initiales du FR (à traduire en place).
- `src/components/layout/LanguageSwitcher.tsx` — sélecteur de langue.
- `src/test/intl.tsx` — helper de test `renderWithIntl`.
- `src/i18n/messages.test.ts` — test d'intégrité des clés.

**Déplacés :** toutes les routes de pages `src/app/*` → `src/app/[locale]/*` (voir Task 4). `src/app/layout.tsx` → `src/app/[locale]/layout.tsx`.

**Modifiés :**
- `next.config.ts` — enrobage par le plugin next-intl.
- `src/proxy.ts` — composition middleware i18n + auth.
- `src/app/[locale]/layout.tsx` — locale-aware (`<html lang>`, provider, hreflang).
- `src/app/sitemap.ts` — variantes par langue + `alternates`.
- `src/components/layout/Nav.tsx`, `Footer.tsx` — `useTranslations` + `Link` locale-aware + switcher.
- Composants accueil (`Hero`, `ProofBar`, `Pricing`, `FAQ`, `Newsletter`, `Features`, `HowItWorks`, `Reviews`, `MarqueeStrip`) + pages `auth/*` — `useTranslations`.
- `src/components/layout/Nav.test.tsx`, `Footer.test.tsx`, et tout test rendant un composant i18n — wrapper `renderWithIntl`.

---

## Task 1: Installer et configurer next-intl

**Files:**
- Modify: `package.json` (dépendance)
- Modify: `next.config.ts`
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`

- [ ] **Step 1: Lire la doc next-intl App Router (Next 16)**

Avant de coder, vérifier l'API exacte pour Next 16 / next-intl v4 :
```bash
npm view next-intl version
```
Ouvrir https://next-intl.dev/docs/getting-started/app-router (routing i18n). Confirmer : `defineRouting`, `createNavigation`, `getRequestConfig`, plugin `createNextIntlPlugin`, et l'intégration middleware (`createMiddleware`). Next 16 utilise `src/proxy.ts` au lieu de `middleware.ts` — vérifier que `createMiddleware(routing)` s'appelle de la même façon (c'est une simple fonction `(request) => response`).

- [ ] **Step 2: Installer next-intl**

```bash
npm install next-intl@^4
```
Expected: ajout de `next-intl` dans `package.json`, pas d'erreur de peer-deps (compatible Next 16 / React 19).

- [ ] **Step 3: Créer `src/i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing'

export const locales = ['fr', 'en', 'de', 'it', 'es'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  // FR à la racine (pas de /fr), les autres préfixées (/en, /de, /it, /es)
  localePrefix: 'as-needed',
  // Mémorise le choix de langue (cookie géré par le middleware next-intl)
  localeCookie: { name: 'NEXT_LOCALE' },
})
```

- [ ] **Step 4: Créer `src/i18n/navigation.ts`**

```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Remplace next/link et next/navigation par des versions locale-aware.
// IMPORTANT : tous les liens internes du site doivent importer depuis ici.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

- [ ] **Step 5: Créer `src/i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const messages = (await import(`../../messages/${locale}.json`)).default

  return {
    locale,
    messages,
    // Repli FR : si une clé manque dans la langue active, on affiche le FR
    getMessageFallback: ({ namespace, key }) => {
      const path = [namespace, key].filter(Boolean).join('.')
      if (locale === 'fr') return path
      try {
        const fr = require('../../messages/fr.json')
        const value = path.split('.').reduce((o, k) => o?.[k], fr)
        return typeof value === 'string' ? value : path
      } catch {
        return path
      }
    },
  }
})
```

- [ ] **Step 6: Enrober `next.config.ts` avec le plugin next-intl**

Remplacer la dernière ligne `export default nextConfig` par :
```ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl(nextConfig)
```
(Ajouter l'import `createNextIntlPlugin` en haut du fichier, après `import type { NextConfig }`.)

- [ ] **Step 7: Vérifier la compilation TypeScript**

Run: `npx tsc --noEmit`
Expected: pas d'erreur (les fichiers `messages/*.json` n'existent pas encore → l'import dynamique ne casse pas le typecheck ; ils seront créés Task 3).

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json next.config.ts src/i18n/
git commit -m "feat(i18n): installer et configurer next-intl (routing, navigation, request)"
```

---

## Task 2: Catalogue source FR + helper de test + test d'intégrité

**Files:**
- Create: `messages/fr.json`
- Create: `src/test/intl.tsx`
- Create: `src/i18n/messages.test.ts`

- [ ] **Step 1: Créer `messages/fr.json` (clés Phase 1)**

Structure de namespaces. Remplir les valeurs FR depuis les composants existants. Squelette minimal à compléter au fil des Tasks 6-8 :
```json
{
  "common": {
    "nav": {
      "disciplines": "Disciplines",
      "programmes": "Programmes",
      "boutique": "🛒 Boutique",
      "blog": "📝 Blog",
      "tarifs": "Tarifs",
      "faq": "FAQ",
      "connexion": "Connexion",
      "rejoindre": "Rejoindre",
      "monEspace": "Mon espace",
      "ouvrirMenu": "Ouvrir le menu de navigation",
      "fermerMenu": "Fermer le menu"
    },
    "footer": {
      "tagline": "La plateforme sport ultime pour athlètes de tous niveaux. Performance, coaching IA et communauté au service de tes objectifs.",
      "disciplines": "Disciplines",
      "programmes": "Programmes",
      "informations": "Informations",
      "copyright": "© 2026 Xenotif® — Tous droits réservés",
      "baseline": "Conçu pour les athlètes · Propulsé par l'IA",
      "links": {
        "mentionsLegales": "Mentions légales",
        "confidentialite": "Confidentialité",
        "contact": "Contact",
        "debutant": "Débutant",
        "intermediaire": "Intermédiaire",
        "avance": "Avancé",
        "elite": "Élite",
        "coachingIA": "Coaching IA"
      }
    },
    "skipLink": "Aller au contenu principal"
  },
  "languages": {
    "fr": "Français",
    "en": "English",
    "de": "Deutsch",
    "it": "Italiano",
    "es": "Español",
    "switch": "Changer de langue"
  },
  "home": {},
  "faq": {},
  "auth": {}
}
```
> Les namespaces `home`, `faq`, `auth` seront remplis aux Tasks 6-8. Garder les clés stables (kebab/camelCase cohérent).

- [ ] **Step 2: Créer le helper de test `src/test/intl.tsx`**

```tsx
import { render } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import frMessages from '../../messages/fr.json'
import type { ReactElement } from 'react'

// Rend un composant client dans le provider next-intl avec les messages FR.
export function renderWithIntl(ui: ReactElement, locale = 'fr') {
  return render(
    <NextIntlClientProvider locale={locale} messages={frMessages}>
      {ui}
    </NextIntlClientProvider>,
  )
}
```

- [ ] **Step 3: Écrire le test d'intégrité des clés (échoue d'abord)**

`src/i18n/messages.test.ts` :
```ts
import fr from '../../messages/fr.json'
import en from '../../messages/en.json'
import de from '../../messages/de.json'
import it from '../../messages/it.json'
import es from '../../messages/es.json'
import { locales } from './routing'

function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k
    return v && typeof v === 'object' && !Array.isArray(v)
      ? keyPaths(v as Record<string, unknown>, path)
      : [path]
  })
}

const byLocale: Record<string, Record<string, unknown>> = { fr, en, de, it, es }

describe('messages key integrity', () => {
  const frKeys = new Set(keyPaths(fr))

  it('couvre exactement les 5 locales', () => {
    expect(Object.keys(byLocale).sort()).toEqual([...locales].sort())
  })

  for (const loc of ['en', 'de', 'it', 'es']) {
    it(`${loc}.json a exactement les mêmes clés que fr.json`, () => {
      const locKeys = new Set(keyPaths(byLocale[loc]))
      const missing = [...frKeys].filter(k => !locKeys.has(k))
      const orphan = [...locKeys].filter(k => !frKeys.has(k))
      expect({ missing, orphan }).toEqual({ missing: [], orphan: [] })
    })
  }
})
```

- [ ] **Step 4: Lancer le test → il échoue (fichiers en/de/it/es absents)**

Run: `npx jest src/i18n/messages.test.ts`
Expected: FAIL (impossible d'importer `messages/en.json`).

- [ ] **Step 5: Créer les copies de langue (repli FR garanti)**

```bash
cp messages/fr.json messages/en.json
cp messages/fr.json messages/de.json
cp messages/fr.json messages/it.json
cp messages/fr.json messages/es.json
```
> Choix assumé : les locales non-FR démarrent en français (traduction en place ensuite). Garantit zéro UI vide, et le test d'intégrité reste vert quand on ajoute des clés FR (il signalera alors les langues à compléter).

- [ ] **Step 6: Lancer le test → il passe**

Run: `npx jest src/i18n/messages.test.ts`
Expected: PASS (5 locales, clés identiques).

- [ ] **Step 7: Commit**

```bash
git add messages/ src/test/intl.tsx src/i18n/messages.test.ts
git commit -m "feat(i18n): catalogues messages (fr source + copies) + test d'intégrité des clés"
```

---

## Task 3: Composer le middleware i18n avec l'auth (`src/proxy.ts`)

**Files:**
- Modify: `src/proxy.ts`

- [ ] **Step 1: Réécrire `src/proxy.ts` pour chaîner next-intl + Supabase**

Remplacer intégralement par :
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const handleI18n = createMiddleware(routing)

// Retire le préfixe de locale pour les vérifications d'auth (ex. /en/dashboard → /dashboard)
function stripLocale(pathname: string): string {
  const seg = pathname.split('/')[1]
  if ((routing.locales as readonly string[]).includes(seg)) {
    const rest = '/' + pathname.split('/').slice(2).join('/')
    return rest === '/' ? '/' : rest.replace(/\/$/, '')
  }
  return pathname
}

export async function proxy(request: NextRequest) {
  // 1) next-intl : détection Accept-Language, cookie NEXT_LOCALE, redirection/rewrite
  const response = handleI18n(request)

  // 2) Auth Supabase (sur la base du path SANS locale)
  const path = stripLocale(request.nextUrl.pathname)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )
  const { data: { user } } = await supabase.auth.getUser()

  // Protéger /dashboard et /admin (en conservant la locale dans la redirection)
  if ((path.startsWith('/dashboard') || path.startsWith('/admin')) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = url.pathname.replace(stripLocale(url.pathname), '/auth/signin')
    return NextResponse.redirect(url)
  }

  // Rediriger les connectés hors des pages auth
  if (
    path.startsWith('/auth/') && user &&
    !path.includes('/callback') && !path.includes('/reset-password')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = url.pathname.replace(stripLocale(url.pathname), '/dashboard')
    return NextResponse.redirect(url)
  }

  // Path courant (sans locale) pour le layout
  response.headers.set('x-current-path', path)
  return response
}

export const config = {
  // Tout sauf api, fichiers statiques, métadonnées et assets
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```
> Notes :
> - Le matcher s'élargit à tout le site (next-intl doit s'exécuter sur chaque page) en excluant `api`, `_next`, et tout chemin avec une extension (`.*\\..*` couvre `favicon.ico`, `opengraph-image.jpg`, `sitemap.xml`, `robots.txt`, images).
> - `x-current-path` contient désormais le path **sans** locale → simplifie le `isAppRoute` du layout.

- [ ] **Step 2: Vérifier la compilation**

Run: `npx tsc --noEmit`
Expected: pas d'erreur.

- [ ] **Step 3: Commit**

```bash
git add src/proxy.ts
git commit -m "feat(i18n): composer le middleware next-intl avec l'auth Supabase (proxy)"
```

---

## Task 4: Déplacer les routes sous `app/[locale]/`

**Files:**
- Move: toutes les routes de pages de `src/app/*` → `src/app/[locale]/*`

- [ ] **Step 1: Créer le dossier et déplacer les routes (git mv)**

```bash
mkdir -p src/app/\[locale\]
git mv src/app/layout.tsx        src/app/\[locale\]/layout.tsx
git mv src/app/page.tsx          src/app/\[locale\]/page.tsx
git mv src/app/auth              src/app/\[locale\]/auth
git mv src/app/blog              src/app/\[locale\]/blog
git mv src/app/boutique          src/app/\[locale\]/boutique
git mv src/app/dashboard         src/app/\[locale\]/dashboard
git mv src/app/disciplines       src/app/\[locale\]/disciplines
git mv src/app/admin             src/app/\[locale\]/admin
git mv src/app/contact           src/app/\[locale\]/contact
git mv src/app/confidentialite   src/app/\[locale\]/confidentialite
git mv src/app/mentions-legales  src/app/\[locale\]/mentions-legales
git mv src/app/success           src/app/\[locale\]/success
```
> Restent à la racine de `src/app/` (NE PAS déplacer) : `api/`, `globals.css`, `sitemap.ts`, `robots.ts`, `favicon.ico`, `opengraph-image.jpg`, `apple-icon.png`, `apple-icon.alt.txt`, `opengraph-image.alt.txt`.

- [ ] **Step 2: Vérifier ce qui reste à la racine**

Run: `ls src/app`
Expected: `[locale]  api  apple-icon.alt.txt  apple-icon.png  favicon.ico  globals.css  opengraph-image.alt.txt  opengraph-image.jpg  robots.ts  sitemap.ts`

- [ ] **Step 3: Commit (déplacement seul, avant adaptation)**

```bash
git add -A
git commit -m "refactor(i18n): déplacer les routes de pages sous app/[locale]"
```

---

## Task 5: Adapter le layout racine `app/[locale]/layout.tsx`

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Rendre le layout locale-aware (provider, html lang, params)**

Remplacer le composant `RootLayout` (garder les imports existants + ajouter ceux d'i18n) par :
```tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
// ... garder : Inter, headers, Script, './globals.css', Nav, Footer, Providers, SchemaOrg

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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
  const currentPath = headersList.get('x-current-path') ?? '' // déjà sans locale (cf. proxy)
  const isAppRoute = currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin')

  const t = await getTranslations('common')

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <a href="#contenu-principal" className="skip-link">{t('skipLink')}</a>
        <NextIntlClientProvider>
          <Providers>
            {isAppRoute ? children : (
              <>
                <Nav />
                <main id="contenu-principal" tabIndex={-1}>{children}</main>
                <Footer />
              </>
            )}
          </Providers>
        </NextIntlClientProvider>
        <OrganizationSchema />
        <WebsiteSchema />
        {/* Google Analytics GA4 — inchangé */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3H3JTM404V" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3H3JTM404V');
        `}</Script>
      </body>
    </html>
  )
}
```
> `NextIntlClientProvider` sans prop `messages` transmet automatiquement les messages côté client (next-intl v4).

- [ ] **Step 2: Remplacer le `metadata` statique par `generateMetadata` localisé + hreflang**

Au-dessus du composant, remplacer `export const metadata = {...}` par :
```tsx
import type { Metadata } from 'next'

const SITE = 'https://xenotif.com'
const LOCALE_OG: Record<string, string> = { fr: 'fr_FR', en: 'en_US', de: 'de_DE', it: 'it_IT', es: 'es_ES' }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  // Variantes hreflang : FR à la racine, autres préfixées
  const languages: Record<string, string> = { 'x-default': SITE }
  for (const l of routing.locales) languages[l] = l === 'fr' ? SITE : `${SITE}/${l}`

  return {
    metadataBase: new URL(SITE),
    title: { default: t('metaTitle'), template: '%s | Xenotif®' },
    description: t('metaDescription'),
    alternates: { canonical: languages[locale], languages },
    openGraph: {
      title: t('metaTitle'), description: t('metaDescription'),
      url: languages[locale], siteName: 'Xenotif®', type: 'website',
      locale: LOCALE_OG[locale] ?? 'fr_FR',
    },
    twitter: { card: 'summary_large_image', title: t('metaTitle'), description: t('metaDescription') },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    verification: { google: '2kJvq3omakuRUmacSG5OcvKqNZCNofHayAK7f-vVA-c' },
  }
}
```
> Ajouter les clés `home.metaTitle` et `home.metaDescription` dans `messages/fr.json` (valeurs = titre/description FR actuels).

- [ ] **Step 3: Build**

Run: `npx next build`
Expected: build OK ; routes générées avec segment `[locale]` ; pas d'erreur de layout racine.

- [ ] **Step 4: Commit**

```bash
git add src/app/\[locale\]/layout.tsx messages/fr.json
git commit -m "feat(i18n): layout racine locale-aware + métadonnées hreflang"
```

---

## Task 6: Sélecteur de langue + Nav locale-aware

**Files:**
- Create: `src/components/layout/LanguageSwitcher.tsx`
- Modify: `src/components/layout/Nav.tsx`
- Modify: `src/components/layout/Nav.test.tsx`

- [ ] **Step 1: Créer `LanguageSwitcher.tsx`**

```tsx
'use client'
import { useLocale, useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('languages')
  const pathname = usePathname() // path sans locale
  const router = useRouter()

  function change(next: string) {
    router.replace(pathname, { locale: next as Locale })
  }

  return (
    <label className="inline-flex items-center gap-1.5 text-sport-gray">
      <Globe size={14} aria-hidden="true" />
      <span className="sr-only">{t('switch')}</span>
      <select
        value={locale}
        onChange={(e) => change(e.target.value)}
        aria-label={t('switch')}
        className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-sport-dark text-white">{t(l)}</option>
        ))}
      </select>
    </label>
  )
}
```

- [ ] **Step 2: Adapter `Nav.tsx` (imports, traductions, switcher)**

Changements dans `src/components/layout/Nav.tsx` :
1. Remplacer `import Link from 'next/link'` par `import { Link } from '@/i18n/navigation'`.
2. Ajouter `import { useTranslations } from 'next-intl'` et `import { LanguageSwitcher } from './LanguageSwitcher'`.
3. Dans `NAV_LINKS`, remplacer les `label` codés en dur par des clés : `{ href: '/#disciplines', key: 'disciplines' }`, etc. (les libellés viennent de `t`).
4. Dans le composant : `const t = useTranslations('common.nav')`. Remplacer chaque texte affiché par `t('...')` : liens (`t(link.key)`), `t('connexion')`, `t('rejoindre')`, `t('monEspace')`, `aria-label` (`t('ouvrirMenu')`/`t('fermerMenu')`).
5. Insérer `<LanguageSwitcher />` dans la barre desktop (à côté de Connexion) et dans le menu mobile.

> Toutes les valeurs FR correspondantes existent déjà dans `messages/fr.json` (`common.nav.*`, Task 2). Vérifier la complétude.

- [ ] **Step 3: Adapter le test `Nav.test.tsx` (provider intl)**

Remplacer `import { render, screen }` et les `render(<Nav />)` par le helper :
```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders the brand name', () => {
    renderWithIntl(<Nav />)
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
  })
  it('renders navigation links', () => {
    renderWithIntl(<Nav />)
    expect(screen.getByRole('link', { name: /disciplines/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
  })
  it('renders join link', () => {
    renderWithIntl(<Nav />)
    expect(screen.getByRole('link', { name: /rejoindre/i })).toBeInTheDocument()
  })
  it('renders the language switcher', () => {
    renderWithIntl(<Nav />)
    expect(screen.getByRole('combobox', { name: /changer de langue/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Lancer les tests Nav**

Run: `npx jest src/components/layout/Nav.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/LanguageSwitcher.tsx src/components/layout/Nav.tsx src/components/layout/Nav.test.tsx messages/fr.json
git commit -m "feat(i18n): sélecteur de langue + Nav traduite et locale-aware"
```

---

## Task 7: Footer locale-aware + traduit

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/Footer.test.tsx`

- [ ] **Step 1: Adapter `Footer.tsx`**

1. Remplacer `import Link from 'next/link'` par `import { Link } from '@/i18n/navigation'`.
2. Ajouter `import { useTranslations } from 'next-intl'`.
3. `const t = useTranslations('common.footer')`.
4. Remplacer les libellés des tableaux `DISC_LINKS` / `PROG_LINKS` / `INFO_LINKS` : garder les `href`, mais afficher `t('links.<clé>')`. Pour les disciplines, réutiliser les libellés bruts (ce sont des noms propres, ex. « Running & Cardio ») — OK de les laisser tels quels en P1 (repli), ou ajouter sous `common.footer.disc.*`. Choix P1 : laisser les noms de disciplines en dur (noms de marque), traduire les en-têtes (`t('disciplines')`, `t('programmes')`, `t('informations')`), la tagline (`t('tagline')`), le copyright (`t('copyright')`) et la baseline (`t('baseline')`).
5. `Logo href="/"` → le composant `Logo` utilise déjà `next/link` en interne ; le rendre locale-aware est traité Task 9 (note de suivi). En P1, le footer peut continuer d'utiliser `Logo` tel quel.

- [ ] **Step 2: Adapter `Footer.test.tsx`**

```tsx
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/intl'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders brand name', () => {
    renderWithIntl(<Footer />)
    expect(screen.getByText('XENOTIF')).toBeInTheDocument()
  })
  it('renders main column headings', () => {
    renderWithIntl(<Footer />)
    expect(screen.getByText('Disciplines')).toBeInTheDocument()
    expect(screen.getByText('Programmes')).toBeInTheDocument()
    expect(screen.getByText('Informations')).toBeInTheDocument()
  })
  it('renders copyright', () => {
    renderWithIntl(<Footer />)
    expect(screen.getByText(/2026 Xenotif®/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Lancer les tests Footer**

Run: `npx jest src/components/layout/Footer.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx messages/fr.json
git commit -m "feat(i18n): Footer traduit et locale-aware"
```

---

## Task 8: Traduire l'accueil et les pages auth

**Files:**
- Modify: `src/components/home/Hero.tsx` (+ `Hero.test.tsx`)
- Modify: `src/components/home/{ProofBar,Features,HowItWorks,Pricing,Reviews,FAQ,Newsletter,MarqueeStrip}.tsx` (+ tests existants)
- Modify: `src/app/[locale]/auth/{signin,signup,forgot-password,reset-password}/page.tsx`
- Modify: `messages/fr.json` (namespaces `home`, `faq`, `auth`)

> **Méthode (identique pour chaque composant)** — appliquer le patron démontré sur Nav/Footer :
> 1. Ajouter `import { useTranslations } from 'next-intl'` (et remplacer `next/link` par `@/i18n/navigation` si le composant a des liens internes).
> 2. `const t = useTranslations('<namespace>')`.
> 3. Déplacer chaque chaîne FR visible vers `messages/fr.json` sous une clé stable, et l'afficher via `t('clé')`. Pour les listes (FAQ, plans tarifaires), utiliser des clés indexées (`faq.items.0.q`, `faq.items.0.a`, …) ou `t.rich`/`useTranslations` avec tableaux via `t.raw`.
> 4. Mettre à jour le test du composant pour utiliser `renderWithIntl` et asserter sur les libellés FR rendus.

- [ ] **Step 1: Hero — extraire les chaînes**

Clés (`messages/fr.json` → `home`) : `metaTitle`, `metaDescription` (déjà ajoutées Task 5), `slides.0.tag/headline/accent`, …, `cta.rejoindre` (« Rejoindre gratuitement »), `cta.voirDisciplines` (« Voir les disciplines »), `eyebrow` (« La plateforme sport premium »). Les `TRUST_ITEMS`/`BADGES` (issus de `constants.ts`) restent en FR en P1 (repli) — **hors scope** ici.
Dans `Hero.tsx` : `const t = useTranslations('home')`, remplacer les textes des CTA et de l'eyebrow par `t(...)`. Les slides peuvent rester en dur en P1 si trop volumineux (repli FR) — **décision P1 : traduire eyebrow + 2 CTA, laisser slides en FR**.

- [ ] **Step 2: Adapter `Hero.test.tsx` avec `renderWithIntl`**

Remplacer `render(<Hero />)` par `renderWithIntl(<Hero />)` dans chaque test. Adapter les libellés CTA aux clés (`/rejoindre gratuitement/i`, `/voir les disciplines/i`) — inchangés en FR.

Run: `npx jest src/components/home/Hero.test.tsx` → PASS.

- [ ] **Step 3: ProofBar, Features, HowItWorks, Pricing, Reviews, FAQ, Newsletter, MarqueeStrip**

Pour chacun, appliquer la Méthode ci-dessus. Périmètre P1 par composant :
- **FAQ** : namespace `faq` — questions/réponses indexées (`faq.items.N.q/a`) + titre de section. (Le contenu FAQ est dans le composant `FAQ.tsx`.)
- **Pricing** : namespace `home.pricing` — noms de plans, périodicité, libellés boutons, features listées.
- **Newsletter** : `home.newsletter` — titre, placeholder, bouton, mentions.
- **ProofBar** : `home.proof` — labels/sublabels des stats (les valeurs numériques restent dans `constants.ts`).
- **Features / HowItWorks / Reviews / MarqueeStrip** : titres de section + libellés propres au composant. Le contenu issu de `constants.ts` (FEATURES, REVIEWS) **reste en FR en P1** (repli) — sera traité en P2.
Mettre à jour chaque test associé avec `renderWithIntl` et adapter les assertions (toujours en FR).

Run après chaque composant : `npx jest src/components/home/<Composant>.test.tsx` → PASS.

- [ ] **Step 4: Pages auth**

Pour `signin`, `signup`, `forgot-password`, `reset-password` (`src/app/[locale]/auth/*/page.tsx`) : namespace `auth.<page>` — titres, labels de champs, boutons, messages d'aide/erreur statiques. Remplacer `next/link` interne par `@/i18n/navigation`. Ces pages sont des composants client (`'use client'`) → `useTranslations`.

- [ ] **Step 5: Build complet + suite de tests**

Run: `npx tsc --noEmit && npx jest && npx next build`
Expected: tsc OK, tous les tests PASS, build OK.

- [ ] **Step 6: Commit**

```bash
git add src/components/home src/app/\[locale\]/auth messages/fr.json
git commit -m "feat(i18n): traduire l'accueil (hero, sections, FAQ, tarifs) et les pages auth"
```

---

## Task 9: Liens internes locale-aware (Logo + balayage)

**Files:**
- Modify: `src/components/ui/Logo.tsx`
- Modify: tout composant **du chrome/accueil/auth** important `next/link`

- [ ] **Step 1: Rendre `Logo.tsx` locale-aware**

Dans `src/components/ui/Logo.tsx`, remplacer `import Link from 'next/link'` par `import { Link } from '@/i18n/navigation'` (le reste inchangé).

- [ ] **Step 2: Balayer les liens internes des fichiers P1**

```bash
grep -rln "from 'next/link'" src/components/home src/components/layout src/components/ui src/app/\[locale\]/auth src/app/\[locale\]/page.tsx
```
Pour **chaque fichier listé** appartenant au périmètre P1 (chrome, accueil, auth), remplacer `import Link from 'next/link'` par `import { Link } from '@/i18n/navigation'`. (Les pages hors P1 — boutique, blog, disciplines, dashboard — seront converties à leur phase ; en attendant elles restent en FR et leurs liens internes pointent vers les URLs FR, ce qui est cohérent avec le repli.)

> Ne PAS toucher les `<a href>` externes (réseaux sociaux, Amazon, mailto) ni les ancres `/#section`.

- [ ] **Step 3: Build + tests**

Run: `npx tsc --noEmit && npx jest && npx next build`
Expected: tout vert.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(i18n): liens internes locale-aware (chrome/accueil/auth)"
```

---

## Task 10: Sitemap multilingue + hreflang

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Étendre `sitemap.ts` avec les alternates par langue**

Remplacer le contenu par une version qui émet chaque URL avec ses variantes de langue :
```ts
import type { MetadataRoute } from 'next'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'
import { PRODUCTS } from '@/lib/boutique/products'
import { getAllPosts } from '@/lib/blog/posts'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://xenotif.com'

// Construit l'URL localisée : FR à la racine, autres préfixées
function localized(path: string, locale: string): string {
  const clean = path === '/' ? '' : path
  return locale === 'fr' ? `${BASE_URL}${clean}` : `${BASE_URL}/${locale}${clean}`
}

// Pour un chemin donné, retourne l'entrée sitemap avec alternates hreflang
function entry(path: string, opts: { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number; lastModified?: Date }): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = localized(path, l)
  return {
    url: localized(path, 'fr'),
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: Array<[string, { changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }]> = [
    ['/', { changeFrequency: 'daily', priority: 1.0 }],
    ['/boutique', { changeFrequency: 'daily', priority: 0.9 }],
    ['/blog', { changeFrequency: 'weekly', priority: 0.9 }],
    ['/contact', { changeFrequency: 'yearly', priority: 0.5 }],
    ['/confidentialite', { changeFrequency: 'yearly', priority: 0.3 }],
    ['/mentions-legales', { changeFrequency: 'yearly', priority: 0.3 }],
  ]

  return [
    ...staticPaths.map(([p, o]) => entry(p, o)),
    ...Object.keys(DISCIPLINE_CONTENT).map(slug => entry(`/disciplines/${slug}`, { changeFrequency: 'monthly', priority: 0.8 })),
    ...PRODUCTS.map(p => entry(`/boutique/${p.slug}`, { changeFrequency: 'weekly', priority: 0.7 })),
    ...getAllPosts().map(post => entry(`/blog/${post.slug}`, { changeFrequency: 'monthly', priority: 0.8, lastModified: new Date(post.publishedAt) })),
  ]
}
```

- [ ] **Step 2: Build + vérifier le sitemap**

```bash
npx next build && npx next start &
sleep 4
curl -s http://localhost:3000/sitemap.xml | grep -c "xhtml:link\|<url>"
kill %1
```
Expected: le XML contient les balises `<url>` et des `xhtml:link rel="alternate" hreflang="…"` pour chaque langue.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(i18n): sitemap multilingue avec alternates hreflang"
```

---

## Task 11: Vérification de bout en bout

**Files:** aucun (validation)

- [ ] **Step 1: Suite complète**

Run: `npx tsc --noEmit && npx jest && npx next build`
Expected: tsc OK, tous tests PASS, build OK (routes `[locale]` générées pour fr/en/de/it/es).

- [ ] **Step 2: Vérifs manuelles (dev server)**

```bash
npx next dev
```
Vérifier :
- `http://localhost:3000/` → FR (pas de préfixe), nav/footer FR.
- `http://localhost:3000/en` → coquille EN (textes traduits là où la Task 8 a extrait ; repli FR ailleurs).
- Le sélecteur de langue change la langue **en gardant la page**, et un rechargement conserve le choix (cookie `NEXT_LOCALE`).
- `http://localhost:3000/dashboard` non connecté → redirige vers `/auth/signin` (auth toujours OK).
- En-tête HTML : `<html lang="en">` sur `/en`, balises `hreflang` présentes (voir source de page).

- [ ] **Step 3: Commit éventuel de corrections**

```bash
git add -A
git commit -m "fix(i18n): corrections issues de la vérification de bout en bout"
```

- [ ] **Step 4: Pousser**

```bash
git push origin <branche>
```
> Déploiement Vercel ; vérifier en preview que `/` (FR) reste identique et que `/en|/de|/it|/es` répondent.

---

## Self-review (couverture de la spec)

- §3 Langues & URLs → Tasks 1,3,4 (routing as-needed, `[locale]`). ✓
- §4 Détection & sélecteur → Tasks 3 (middleware), 6 (switcher). ✓
- §5 Catalogues / handoff → Task 2 (fr + copies), namespaces. ✓
- §6 Repli FR → Task 1 Step 5 (`getMessageFallback`) + Task 2 (copies FR). ✓
- §7 SEO (hreflang, canonical, html lang, sitemap, métadonnées) → Tasks 5, 10. ✓
- §8 Phasage : ce plan = **P1 uniquement** ; disciplines/produits/blog/guides/dashboard/emails explicitement différés (repli FR). ✓
- §10 Tests (intégrité clés, middleware, build) → Tasks 2, 11. ⚠️ Le middleware n'a pas de test unitaire dédié (difficile à isoler) ; couvert par la vérif manuelle Task 11 Step 2 (auth + redirection). Acceptable pour P1.

**Notes :**
- Le contenu issu de `constants.ts` (FEATURES, REVIEWS, TRUST_ITEMS) et les slides du Hero restent en FR en P1 (repli) pour éviter le chevauchement avec P2 — décision explicite.
- Dépendance clé : compatibilité `next-intl` v4 ↔ Next 16 / convention `proxy.ts` (Task 1 Step 1 le valide avant tout).
