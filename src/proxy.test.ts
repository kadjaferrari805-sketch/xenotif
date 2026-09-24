/**
 * @jest-environment node
 */
// PHASE 09.6.3 — Filet de sécurité du Proxy (middleware Next.js 16).
//
// Environnement `node` : `next/server` référence les globals Fetch API natifs à
// Node, absents du jsdom par défaut du projet (cf. src/app/api/streak/route.test.ts).
//
// ─── CE QUI EST MOCKÉ, ET CE QUI NE L'EST PAS ──────────────────────────────
// Mockés : `@supabase/ssr` (contrôle de l'utilisateur), `next-intl/middleware`
// (sa résolution de locale n'est pas l'objet du test) et la garde
// d'environnement. RÉELS et volontairement non mockés : `next/server` et
// `@/i18n/routing` — ce sont précisément les comportements à verrouiller.
//
// ─── COMMENT L'INTERRUPTION EST PROUVÉE ────────────────────────────────────
// Contrairement au filet 09.5, le proxy ne LÈVE rien : il RETOURNE
// `NextResponse.redirect(...)`. Un mock levant serait ici une fiction.
// La preuve d'interruption est une asymétrie observable : `x-current-path` est
// posé à la toute fin (l.102), donc il est PRÉSENT sur un passage et ABSENT sur
// une redirection. Les deux sens sont assertés ; sans quoi un proxy qui
// redirigerait puis continuerait passerait inaperçu.
import { NextRequest, NextResponse } from 'next/server'

/** Utilisateur renvoyé par `auth.getUser()` (null = visiteur anonyme). */
let mockUser: { id: string } | null = null

/** Options `cookies` transmises à `createServerClient`, capturées pour §8. */
let mockCookieOptions: {
  getAll: () => { name: string; value: string }[]
  setAll: (c: { name: string; value: string; options?: object }[]) => void
} | null = null

/** Compteur d'appels réels à `auth.getUser()` — instrumentation de la §9. */
let mockGetUserCalls = 0

jest.mock('@supabase/ssr', () => ({
  createServerClient: (
    _url: string,
    _key: string,
    opts: { cookies: typeof mockCookieOptions },
  ) => {
    mockCookieOptions = opts.cookies
    return {
      auth: {
        getUser: async () => {
          mockGetUserCalls += 1
          return { data: { user: mockUser } }
        },
      },
    }
  },
}))

// next-intl renvoie normalement une réponse de continuation ; on la reproduit
// à l'identique pour que le proxy pose ses cookies et en-têtes dessus.
jest.mock('next-intl/middleware', () => ({
  __esModule: true,
  default: () => () => {
    const { NextResponse: NR } = jest.requireActual('next/server')
    return NR.next()
  },
}))

// Chemin RELATIF : l'alias `@/` est résolu par SWC à la transformation des
// spécificateurs d'import, jamais sur la chaîne passée à `jest.mock`.
jest.mock('./lib/env/deployment', () => ({
  assertSupabaseEnvironment: jest.fn(),
}))

import { proxy, config } from './proxy'

const SIGNIN = '/auth/signin'

/** Construit une requête réelle vers le chemin donné. */
function req(path: string): NextRequest {
  return new NextRequest(new URL(`https://xenotif.com${path}`))
}

/** Réponse du proxy, normalisée pour les assertions. */
async function run(path: string) {
  const res = await proxy(req(path))
  return {
    status: res.status,
    location: res.headers.get('location'),
    currentPath: res.headers.get('x-current-path'),
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUser = null
  mockCookieOptions = null
  mockGetUserCalls = 0
})

// ─── 0. Le harness discrimine-t-il ? ──────────────────────────────────────

describe('harness — l’asymétrie x-current-path est exploitable', () => {
  it('un PASSAGE porte x-current-path', async () => {
    const r = await run('/blog')
    expect(r.currentPath).toBe('/blog')
    expect(r.status).not.toBe(307)
  })

  it('une REDIRECTION ne le porte pas — le proxy est sorti avant la ligne 102', async () => {
    const r = await run('/dashboard')
    expect(r.status).toBe(307)
    expect(r.currentPath).toBeNull()
  })
})

// ─── 1. Branche dashboard ─────────────────────────────────────────────────

describe('proxy — /dashboard/* protégé', () => {
  it.each([
    ['/dashboard', SIGNIN],
    ['/dashboard/programme', SIGNIN],
    ['/dashboard/admin-lookalike', SIGNIN],
  ])('%s anonyme → 307 vers %s', async (path, attendu) => {
    const r = await run(path)
    expect(r.status).toBe(307)
    expect(r.location).toContain(attendu)
    expect(r.currentPath).toBeNull()
  })

  it('un utilisateur authentifié traverse sans redirection', async () => {
    mockUser = { id: 'u1' }
    const r = await run('/dashboard')
    expect(r.status).not.toBe(307)
    expect(r.currentPath).toBe('/dashboard')
  })
})

// ─── 2. Préservation du préfixe de locale (l.84) ──────────────────────────
//
// On ne triple pas la même branche : ce qui est vérifié ici est UNIQUEMENT la
// reconstruction `${localePrefix}/auth/signin`, seul comportement propre aux
// locales dans ce fichier.

describe('proxy — le préfixe de locale est préservé dans la redirection', () => {
  it.each([
    ['/fr/dashboard', '/fr/auth/signin'],
    ['/en/dashboard', '/en/auth/signin'],
    ['/de/dashboard', '/de/auth/signin'],
    ['/dashboard', '/auth/signin'], // locale par défaut : as-needed, sans préfixe
  ])('%s anonyme → %s', async (path, attendu) => {
    const r = await run(path)
    expect(r.status).toBe(307)
    expect(new URL(r.location!, 'https://xenotif.com').pathname).toBe(attendu)
  })

  it('les locales testées sont bien celles déclarées par le routage', async () => {
    const { routing } = await import('./i18n/routing')
    expect([...routing.locales]).toEqual(['fr', 'en', 'de'])
    expect(routing.localePrefix).toBe('as-needed')
  })
})

// ─── 3. Branche admin ─────────────────────────────────────────────────────

describe('proxy — /admin/* protégé', () => {
  it.each(['/admin', '/admin/content', '/en/admin'])(
    '%s anonyme → redirigé vers la connexion',
    async (path) => {
      const r = await run(path)
      expect(r.status).toBe(307)
      expect(r.location).toContain(SIGNIN)
      expect(r.currentPath).toBeNull()
    },
  )

  // Le proxy ne teste QUE `!user` (l.82). La distinction admin / non-admin est
  // faite par les pages (`admin_users` → redirect('/dashboard')), couverte par
  // src/app/[locale]/auth-safety-net.test.ts. On verrouille ici le fait que le
  // proxy PASSE, pour qu'un futur déplacement de cette logique soit visible.
  it('un authentifié NON-admin traverse le proxy — l’arbitrage appartient aux pages', async () => {
    mockUser = { id: 'u1' }
    const r = await run('/admin')
    expect(r.status).not.toBe(307)
    expect(r.currentPath).toBe('/admin')
  })
})

// ─── 4. Branche auth ──────────────────────────────────────────────────────

describe('proxy — /auth/*', () => {
  it('/auth/signin anonyme est accessible', async () => {
    const r = await run('/auth/signin')
    expect(r.status).not.toBe(307)
    expect(r.currentPath).toBe('/auth/signin')
  })

  it.each(['/auth/signin', '/auth/signup'])(
    '%s pour un utilisateur connecté → renvoyé vers le dashboard',
    async (path) => {
      mockUser = { id: 'u1' }
      const r = await run(path)
      expect(r.status).toBe(307)
      expect(new URL(r.location!, 'https://xenotif.com').pathname).toBe('/dashboard')
    },
  )

  it('/en/auth/signin connecté → /en/dashboard (préfixe préservé)', async () => {
    mockUser = { id: 'u1' }
    const r = await run('/en/auth/signin')
    expect(new URL(r.location!, 'https://xenotif.com').pathname).toBe('/en/dashboard')
  })

  it.each(['/auth/callback', '/auth/reset-password'])(
    '%s reste accessible à un connecté (exclusion explicite)',
    async (path) => {
      mockUser = { id: 'u1' }
      const r = await run(path)
      expect(r.status).not.toBe(307)
      expect(r.currentPath).toBe(path)
    },
  )
})

// ─── 5. Routes publiques et exception dashboard-preview ───────────────────

describe('proxy — routes publiques', () => {
  it.each(['/', '/blog', '/boutique', '/app', '/success'])(
    '%s traverse sans redirection',
    async (path) => {
      const r = await run(path)
      expect(r.status).not.toBe(307)
      expect(r.currentPath).toBe(path)
    },
  )

  // Garde critique : `/dashboard-preview` ne doit satisfaire NI `=== '/dashboard'`
  // NI `startsWith('/dashboard/')`. Une protection écrite en `startsWith('/dashboard')`
  // rendrait cette page marketing inaccessible aux visiteurs anonymes.
  it('/dashboard-preview reste PUBLIQUE pour un anonyme', async () => {
    const r = await run('/dashboard-preview')
    expect(r.status).not.toBe(307)
    expect(r.currentPath).toBe('/dashboard-preview')
  })

  it.each(['/fr/dashboard-preview', '/en/dashboard-preview'])(
    '%s reste publique quelle que soit la locale',
    async (path) => {
      const r = await run(path)
      expect(r.status).not.toBe(307)
    },
  )
})

// ─── 6. Matcher : ce que le proxy ne voit jamais ──────────────────────────

describe('config.matcher — exclusions', () => {
  const motif = new RegExp(`^${config.matcher[0]}$`)

  it.each(['/api/geo', '/api/checkout', '/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/_next/static/a.js', '/_vercel/insights'])(
    '%s est EXCLU du proxy',
    (path) => {
      expect(motif.test(path)).toBe(false)
    },
  )

  it.each(['/', '/blog', '/dashboard', '/admin', '/en/dashboard', '/dashboard-preview'])(
    '%s est bien traversé par le proxy',
    (path) => {
      expect(motif.test(path)).toBe(true)
    },
  )
})

// ─── 7. Contrôle négatif : un proxy sans protection serait-il détecté ? ────
//
// Une suite verte ne prouve rien tant qu'on n'a pas montré qu'elle sait
// échouer. On reproduit la structure du proxy PRIVÉE de sa branche l.82 et on
// vérifie que les assertions ci-dessus la rejetteraient.

describe('contrôle négatif — proxy sans branche de protection', () => {
  /** Réplique de la fin du proxy, sans le test de segment protégé. */
  async function proxySansGarde(path: string) {
    const res = NextResponse.next()
    res.headers.set('x-current-path', path)
    return { status: res.status, currentPath: res.headers.get('x-current-path') }
  }

  it('il laisserait passer /dashboard — ce que l’assertion de §1 rejette', async () => {
    const faible = await proxySansGarde('/dashboard')
    expect(faible.status).not.toBe(307)
    expect(faible.currentPath).toBe('/dashboard')

    // Le vrai proxy, lui, redirige : c'est cet écart que le filet détecte.
    const reel = await run('/dashboard')
    expect(reel.status).toBe(307)
    expect(reel.currentPath).toBeNull()
    expect(reel.status).not.toBe(faible.status)
  })

  it('une garde écrite en startsWith("/dashboard") casserait dashboard-preview', () => {
    const tropLarge = (p: string) => p.startsWith('/dashboard')
    const correcte = (p: string) => p === '/dashboard' || p.startsWith('/dashboard/')

    expect(tropLarge('/dashboard-preview')).toBe(true) // piège
    expect(correcte('/dashboard-preview')).toBe(false) // comportement attendu
    expect(correcte('/dashboard')).toBe(true)
    expect(correcte('/dashboard/programme')).toBe(true)
  })
})

// ─── 8. Propagation des cookies de session (l.64-72) ──────────────────────
//
// Le proxy branche Supabase sur `request.cookies` en lecture et sur la réponse
// i18n en écriture. Ce second chemin est le rafraîchissement de session : s'il
// cassait, les sessions expireraient silencieusement au lieu de se renouveler.
// Le mock capture les callbacks pour les exercer explicitement — sans quoi ils
// ne sont jamais invoqués et restent hors couverture.

describe('propagation des cookies de session', () => {
  // Ces trois cas visent des routes où l'authentification s'exécute réellement.
  // Depuis 09.6.4, le client Supabase n'est plus construit sur les routes
  // publiques : les y viser ne testerait plus rien.
  it('getAll expose les cookies de la requête entrante', async () => {
    const requete = new NextRequest(new URL('https://xenotif.com/dashboard'), {
      headers: { cookie: 'sb-access-token=jeton-entrant; NEXT_LOCALE=fr' },
    })
    await proxy(requete)

    expect(mockCookieOptions).not.toBeNull()
    const noms = mockCookieOptions!.getAll().map((c) => c.name)
    expect(noms).toContain('sb-access-token')
    expect(noms).toContain('NEXT_LOCALE')
  })

  it('setAll écrit les cookies rafraîchis sur la réponse RETOURNÉE', async () => {
    // Utilisateur connecté sur une route protégée : l'auth s'exécute ET le
    // proxy laisse passer, donc la réponse rendue est bien la réponse i18n sur
    // laquelle `setAll` écrit (sur une redirection, elle ne le serait pas).
    mockUser = { id: 'u1' }
    const res = await proxy(req('/dashboard'))
    expect(mockCookieOptions).not.toBeNull()

    mockCookieOptions!.setAll([
      { name: 'sb-access-token', value: 'jeton-rafraichi', options: { path: '/' } },
      { name: 'sb-refresh-token', value: 'refresh-rafraichi', options: { path: '/' } },
    ])

    expect(res.cookies.get('sb-access-token')?.value).toBe('jeton-rafraichi')
    expect(res.cookies.get('sb-refresh-token')?.value).toBe('refresh-rafraichi')
  })

  it('le client Supabase n’est PAS construit sur une route publique', async () => {
    await proxy(req('/'))
    expect(mockCookieOptions).toBeNull()
  })
})

// ─── 9. Mesure : auth.getUser() n'est plus payé par les routes publiques ──
//
// Instrumentation locale (compteur dans le stub), jamais en production.

describe('coût d’authentification par segment', () => {
  it.each(['/', '/blog', '/boutique', '/app', '/success', '/dashboard-preview'])(
    '%s ne déclenche AUCUN appel à auth.getUser()',
    async (path) => {
      await proxy(req(path))
      expect(mockGetUserCalls).toBe(0)
    },
  )

  it.each(['/dashboard', '/dashboard/programme', '/admin', '/admin/content', '/auth/signin', '/auth/signup'])(
    '%s déclenche exactement UN appel à auth.getUser()',
    async (path) => {
      await proxy(req(path))
      expect(mockGetUserCalls).toBe(1)
    },
  )

  it.each(['/auth/callback', '/auth/reset-password'])(
    '%s est exclu de la redirection et ne paie plus l’appel',
    async (path) => {
      await proxy(req(path))
      expect(mockGetUserCalls).toBe(0)
    },
  )

  it('le coût est nul quelle que soit la locale d’une route publique', async () => {
    await proxy(req('/en/blog'))
    await proxy(req('/de/boutique'))
    expect(mockGetUserCalls).toBe(0)
  })

  it('le coût est maintenu quelle que soit la locale d’une route protégée', async () => {
    await proxy(req('/en/dashboard'))
    await proxy(req('/de/admin'))
    expect(mockGetUserCalls).toBe(2)
  })
})
