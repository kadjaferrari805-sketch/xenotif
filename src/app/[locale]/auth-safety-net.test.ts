/**
 * @jest-environment node
 */
// PHASE 09.5.1 — Filet de sécurité transversal sur l'authentification.
//
// Environnement `node` : on exerce des composants serveur (layout et pages
// async), jamais un rendu navigateur. Aucune dépendance jsdom n'est utile.
//
// ─── POURQUOI UN MOCK LOCAL DE `next/navigation` ───────────────────────────
// `jest.setup.ts` mocke globalement `next/navigation` avec `redirect: jest.fn()`,
// qui RETOURNE `undefined`. Le vrai `redirect()` de Next LÈVE une erreur
// NEXT_REDIRECT, ce qui interrompt le rendu. Avec le mock global, une garde
// `if (!user) redirect('/auth/signin')` enregistrerait l'appel PUIS continuerait
// à rendre la page : le test serait vert sans rien prouver — un faux vert.
//
// On réinstalle donc localement un `redirect` LEVANT, et le premier test du
// fichier vérifie explicitement que ce mock lève. Sans cette méta-assertion,
// toutes les autres reposeraient sur une hypothèse non vérifiée.
//
// ─── CE QUE CE FICHIER NE PEUT PAS TESTER ──────────────────────────────────
// Les formes de locale (/dashboard, /en/dashboard, /de/dashboard) sont résolues
// par le routage next-intl + Next.js, pas par les modules de page : le même
// module sert les trois locales. Boucler trois fois la même assertion serait
// sans valeur. On verrouille donc la CONFIGURATION de routage, d'où la matrice
// d'URL se déduit, et la vérification au niveau URL reste du ressort d'un test
// de bout en bout.
import fs from 'node:fs'
import path from 'node:path'

// ─── Mocks ────────────────────────────────────────────────────────────────

const mockRedirect = jest.fn((url: string) => {
  throw new Error(`NEXT_REDIRECT:${url}`)
})
const mockNotFound = jest.fn(() => {
  throw new Error('NEXT_NOT_FOUND')
})
jest.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
  notFound: () => mockNotFound(),
}))

/** Utilisateur renvoyé par la garde du dashboard (`null` = anonyme). */
let mockUser: { id: string } | null = null
/** Appelé APRÈS la garde du layout → témoin de « le rendu a continué ». */
const mockGetProfileName = jest.fn(async () => null)
// Chemin RELATIF et non `@/…` : l'alias est résolu par SWC à la transformation
// des spécificateurs d'import, pas par le résolveur de Jest (aucune entrée `@/`
// dans `moduleNameMapper`). La cible d'un `jest.mock` est une chaîne, jamais
// réécrite — d'où les 67 `jest.mock` relatifs du dépôt et zéro en `@/`.
jest.mock('../../lib/supabase/session', () => ({
  getCurrentUser: async () => mockUser,
  getProfileName: () => mockGetProfileName(),
}))

/** Appelé APRÈS la garde du layout → second témoin de continuation. */
const mockGetTranslations = jest.fn(async () => (k: string) => k)
jest.mock('next-intl/server', () => ({
  getTranslations: (...args: unknown[]) => mockGetTranslations(...(args as [])),
  setRequestLocale: jest.fn(),
}))

/** Utilisateur renvoyé par `supabase.auth.getUser()` dans les pages admin. */
let mockAdminAuthUser: { id: string } | null = null
/** Appelé APRÈS la garde des pages admin → témoin de continuation. */
const mockCreateServiceClient = jest.fn(async () => ({
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null }) }) }),
  }),
}))
jest.mock('../../lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: mockAdminAuthUser } }) },
  }),
  createServiceClient: () => mockCreateServiceClient(),
}))

// ─── Constantes ───────────────────────────────────────────────────────────

const SIGNIN = '/auth/signin'
const APP = path.join(process.cwd(), 'src/app/[locale]')
const DASHBOARD_DIR = path.join(APP, 'dashboard')
const ADMIN_DIR = path.join(APP, 'admin')

/** Toutes les `page.tsx` d'un arbre, chemins relatifs à cet arbre. */
function pagesUnder(dir: string): string[] {
  const out: string[] = []
  ;(function walk(d: string) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name === 'page.tsx') out.push(path.relative(dir, p))
    }
  })(dir)
  return out.sort()
}

function filesNamed(dir: string, names: string[]): string[] {
  const out: string[] = []
  ;(function walk(d: string) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (names.includes(e.name)) out.push(path.relative(dir, p))
    }
  })(dir)
  return out.sort()
}

// Prédicats de détection. Extraits en fonctions pour que les tests structurels
// ET les contrôles négatifs (§6) exercent exactement le même code : sans cela,
// rien ne prouverait que ces expressions savent répondre « non ».

/** La source porte-t-elle la garde « anonyme → /auth/signin » ? */
function hasAnonGuard(src: string): boolean {
  return (
    /auth\.getUser\(\)|getCurrentUser\(\)/.test(src) &&
    /redirect\('\/auth\/signin'\)/.test(src)
  )
}

/** La source vérifie-t-elle l'appartenance à `admin_users` ? */
function hasAdminCheck(src: string): boolean {
  return /admin_users/.test(src) && /redirect\('\/dashboard'\)/.test(src)
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUser = null
  mockAdminAuthUser = null
})

// ─── 0. Méta : le harness lui-même ────────────────────────────────────────

describe('harness anti-faux-vert', () => {
  it('le redirect mocké LÈVE, comme le vrai redirect de Next', () => {
    expect(() => mockRedirect(SIGNIN)).toThrow('NEXT_REDIRECT:/auth/signin')
  })

  it('le mock local supplante bien le redirect non-levant de jest.setup.ts', async () => {
    const { redirect } = await import('next/navigation')
    expect(() => redirect(SIGNIN)).toThrow(/NEXT_REDIRECT/)
  })
})

// ─── 1. Dashboard : la garde vit dans le layout ───────────────────────────

describe('dashboard/layout.tsx — garde serveur', () => {
  it('redirige un anonyme vers /auth/signin ET interrompt le rendu', async () => {
    const { default: DashboardLayout } = await import('./dashboard/layout')
    mockUser = null

    await expect(
      DashboardLayout({ children: null }),
    ).rejects.toThrow('NEXT_REDIRECT:/auth/signin')

    expect(mockRedirect).toHaveBeenCalledTimes(1)
    expect(mockRedirect).toHaveBeenCalledWith(SIGNIN)

    // Preuve d'interruption : ces deux appels suivent la garde dans le layout.
    // S'ils avaient lieu, le rendu aurait continué malgré la redirection.
    expect(mockGetProfileName).not.toHaveBeenCalled()
    expect(mockGetTranslations).not.toHaveBeenCalled()
  })

  it('ne redirige pas un utilisateur authentifié', async () => {
    const { default: DashboardLayout } = await import('./dashboard/layout')
    mockUser = { id: 'user-1' }

    await DashboardLayout({ children: null })

    expect(mockRedirect).not.toHaveBeenCalled()
    // Le rendu s'est poursuivi au-delà de la garde.
    expect(mockGetProfileName).toHaveBeenCalled()
  })
})

// ─── 2. Admin : chaque page porte sa propre garde (aucun layout) ──────────

describe('admin/* — garde par page', () => {
  it('/admin redirige un anonyme et interrompt le rendu', async () => {
    const { default: AdminPage } = await import('./admin/page')
    mockAdminAuthUser = null

    await expect(AdminPage()).rejects.toThrow('NEXT_REDIRECT:/auth/signin')
    expect(mockRedirect).toHaveBeenCalledWith(SIGNIN)
    // `createServiceClient()` suit la garde : non appelé ⇒ rendu interrompu.
    expect(mockCreateServiceClient).not.toHaveBeenCalled()
  })

  it('/admin/content redirige un anonyme et interrompt le rendu', async () => {
    const { default: AdminContentPage } = await import('./admin/content/page')
    mockAdminAuthUser = null

    await expect(AdminContentPage()).rejects.toThrow('NEXT_REDIRECT:/auth/signin')
    expect(mockRedirect).toHaveBeenCalledWith(SIGNIN)
    expect(mockCreateServiceClient).not.toHaveBeenCalled()
  })

  it('/admin/content/[slug] redirige un anonyme et interrompt le rendu', async () => {
    const { default: AdminContentEditPage } = await import('./admin/content/[slug]/page')
    const { FEATURES } = await import('../../lib/constants')
    mockAdminAuthUser = null

    // Un slug VALIDE : sinon `notFound()` se déclencherait avant la garde et le
    // test passerait pour une raison étrangère à l'authentification.
    await expect(
      AdminContentEditPage({ params: Promise.resolve({ slug: FEATURES[0].slug }) }),
    ).rejects.toThrow('NEXT_REDIRECT:/auth/signin')

    expect(mockNotFound).not.toHaveBeenCalled()
    expect(mockRedirect).toHaveBeenCalledWith(SIGNIN)
    expect(mockCreateServiceClient).not.toHaveBeenCalled()
  })

  it('un utilisateur authentifié NON admin est renvoyé vers /dashboard', async () => {
    const { default: AdminPage } = await import('./admin/page')
    mockAdminAuthUser = { id: 'user-1' } // `admin_users` renvoie `data: null`

    await expect(AdminPage()).rejects.toThrow('NEXT_REDIRECT:/dashboard')
    expect(mockCreateServiceClient).toHaveBeenCalled()
  })
})

// ─── 3. Exception publique : dashboard-preview ────────────────────────────

describe('dashboard-preview — doit rester PUBLIQUE', () => {
  const src = fs.readFileSync(
    path.join(APP, 'dashboard-preview/page.tsx'),
    'utf8',
  )

  it("n'est pas dans l'arbre /dashboard et n'hérite donc d'aucun layout gardé", () => {
    expect(fs.existsSync(path.join(APP, 'dashboard-preview'))).toBe(true)
    expect(pagesUnder(DASHBOARD_DIR)).not.toContain('../dashboard-preview/page.tsx')
    expect(path.dirname(path.join(APP, 'dashboard-preview'))).toBe(APP)
  })

  it("n'importe aucune garde d'authentification", () => {
    expect(src).not.toMatch(/getCurrentUser|auth\.getUser/)
    expect(src).not.toMatch(/redirect\(/)
  })

  it('son rendu ne déclenche aucune redirection', async () => {
    const { default: DashboardPreviewPage } = await import('./dashboard-preview/page')
    await DashboardPreviewPage({ params: Promise.resolve({ locale: 'fr' }) })
    expect(mockRedirect).not.toHaveBeenCalled()
  })
})

// ─── 4. Invariants structurels (détection des régressions futures) ────────

describe('invariants structurels des arbres protégés', () => {
  it('le layout dashboard est à la racine de son arbre et porte la garde', () => {
    const layouts = filesNamed(DASHBOARD_DIR, ['layout.tsx'])
    // Un seul layout, à la racine : il enveloppe donc TOUTES les pages filles.
    expect(layouts).toEqual(['layout.tsx'])

    const src = fs.readFileSync(path.join(DASHBOARD_DIR, 'layout.tsx'), 'utf8')
    expect(hasAnonGuard(src)).toBe(true)
  })

  it('CHAQUE page admin porte sa propre garde (il n’existe aucun layout admin)', () => {
    expect(filesNamed(ADMIN_DIR, ['layout.tsx'])).toEqual([])

    const pages = pagesUnder(ADMIN_DIR)
    expect(pages.length).toBeGreaterThan(0)

    // Le nom du fichier est porté dans l'assertion : en cas d'échec, le rapport
    // désigne la page fautive au lieu d'un simple `false`.
    for (const rel of pages) {
      const src = fs.readFileSync(path.join(ADMIN_DIR, rel), 'utf8')
      expect([rel, hasAnonGuard(src)]).toEqual([rel, true])
      expect([rel, hasAdminCheck(src)]).toEqual([rel, true])
    }
  })

  it('aucun fichier de route ne contourne les layouts des arbres protégés', () => {
    const contournants = ['route.ts', 'route.tsx', 'template.tsx', 'default.tsx']
    expect(filesNamed(DASHBOARD_DIR, contournants)).toEqual([])
    expect(filesNamed(ADMIN_DIR, contournants)).toEqual([])
  })
})

// ─── 5. Matrice d'URL : on verrouille la configuration de routage ─────────

describe('configuration de locale (matrice d’URL attendue)', () => {
  it('locales et stratégie de préfixe sont figées', async () => {
    const { routing, locales } = await import('../../i18n/routing')
    expect([...locales]).toEqual(['fr', 'en', 'de'])
    expect(routing.defaultLocale).toBe('fr')
    expect(routing.localePrefix).toBe('as-needed')
  })

  it('la matrice d’URL protégées se déduit de cette configuration', async () => {
    const { locales, routing } = await import('../../i18n/routing')
    const routes = [
      ...pagesUnder(DASHBOARD_DIR).map(p => '/dashboard/' + path.dirname(p)),
      ...pagesUnder(ADMIN_DIR).map(p => '/admin/' + path.dirname(p)),
    ].map(r => r.replace(/\/\.$/, ''))

    // `as-needed` : la locale par défaut est servie SANS préfixe, les autres avec.
    const formes = routes.flatMap(r =>
      locales.map(l => (l === routing.defaultLocale ? r : `/${l}${r}`)),
    )

    // RECENSEMENT, et non simple compte : ces deux nombres rendent visible toute
    // route protégée nouvellement apparue. Ils ont rempli leur office en 09.7.16
    // en signalant l'ajout de /dashboard/bienvenue (parcours de démarrage
    // Website), dont la garde est assurée par le layout racine vérifié plus haut.
    expect(routes).toHaveLength(12) // 9 dashboard + 3 admin
    expect(formes).toHaveLength(36) // × 3 locales
    expect(formes).toContain('/dashboard')
    expect(formes).toContain('/en/dashboard')
    expect(formes).toContain('/de/admin/content')
  })
})

// ─── 6. Contrôles négatifs : le détecteur sait-il répondre « non » ? ──────
//
// Une suite entièrement verte ne prouve rien tant qu'on n'a pas montré qu'elle
// sait échouer. On confronte donc les MÊMES prédicats à des sources synthétiques
// représentant la régression que ce filet doit attraper.

describe('contrôles négatifs du détecteur structurel', () => {
  const PAGE_NON_GARDEE = `
    export default async function NouvellePage() {
      const service = await createServiceClient()
      const { data } = await service.from('profiles').select('id')
      return <div>{data?.length}</div>
    }
  `

  const PAGE_GARDEE = `
    export default async function NouvellePage() {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) redirect('/auth/signin')
      const service = await createServiceClient()
      const { data: isAdmin } = await service.from('admin_users').select('id')
      if (!isAdmin) redirect('/dashboard')
      return <div />
    }
  `

  it('une page admin SANS garde est rejetée', () => {
    expect(hasAnonGuard(PAGE_NON_GARDEE)).toBe(false)
    expect(hasAdminCheck(PAGE_NON_GARDEE)).toBe(false)
  })

  it('une page admin correctement gardée est acceptée', () => {
    expect(hasAnonGuard(PAGE_GARDEE)).toBe(true)
    expect(hasAdminCheck(PAGE_GARDEE)).toBe(true)
  })

  it('une garde qui redirige vers une AUTRE destination est rejetée', () => {
    expect(hasAnonGuard(PAGE_GARDEE.replace("'/auth/signin'", "'/'"))).toBe(false)
  })

  it('un contrôle admin sans renvoi vers /dashboard est rejeté', () => {
    expect(hasAdminCheck(PAGE_GARDEE.replace("redirect('/dashboard')", 'noop()'))).toBe(false)
  })

  it('un layout dashboard amputé de sa redirection est rejeté', () => {
    const layout = fs.readFileSync(path.join(DASHBOARD_DIR, 'layout.tsx'), 'utf8')
    expect(hasAnonGuard(layout.replace("redirect('/auth/signin')", 'void 0'))).toBe(false)
  })
})
