import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { assertSupabaseEnvironment } from '@/lib/env/deployment'

// Middleware next-intl : gère la détection de locale (Accept-Language → cookie NEXT_LOCALE),
// les redirections de préfixe (/en/dashboard) et les rewrites pour la locale par défaut (fr, sans préfixe).
const handleI18n = createMiddleware(routing)

/**
 * Extrait le préfixe de locale de l'URL (ex: "/en") s'il est présent.
 * Avec localePrefix:'as-needed' et defaultLocale:'fr', le français n'a pas de préfixe.
 */
function getLocalePrefix(pathname: string): string {
  const seg = pathname.split('/')[1]
  if ((routing.locales as readonly string[]).includes(seg)) {
    return `/${seg}`
  }
  return ''
}

/**
 * Retourne le pathname sans le préfixe de locale.
 * ex: "/en/dashboard" → "/dashboard", "/dashboard" → "/dashboard"
 */
function stripLocale(pathname: string): string {
  const prefix = getLocalePrefix(pathname)
  if (prefix) {
    const rest = pathname.slice(prefix.length) || '/'
    return rest
  }
  return pathname
}

export async function proxy(request: NextRequest) {
  // 1. Laisser next-intl faire sa détection de locale et ses rewrites/redirects.
  //    Pour localePrefix:'as-needed' avec defaultLocale:'fr' :
  //    - /dashboard      → pas de redirect, rewrite transparent (locale fr implicite)
  //    - /en/dashboard   → rewrite interne vers /dashboard avec locale en dans les headers
  //    - /de             → rewrite transparent
  //    Si next-intl émet un redirect (ex: normalisation de préfixe), il contient le cookie NEXT_LOCALE.
  const i18nResponse = handleI18n(request)

  // 2. Extraire le pathname sans locale pour la logique d'auth.
  const { pathname } = request.nextUrl
  const path = stripLocale(pathname)
  const localePrefix = getLocalePrefix(pathname)

  // Garde : hors production, le projet Supabase de production est refusé, dès
  // le proxy (donc avant tout rendu de page protégée). Volontairement
  // INCONDITIONNELLE : c'est une vérification d'environnement synchrone, sans
  // coût réseau — seul l'appel réseau `getUser()` est conditionné ci-dessous.
  assertSupabaseEnvironment({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    keys: [process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  })

  // 3. Déterminer si ce segment a besoin de connaître l'utilisateur, AVANT
  //    d'interroger Supabase. Auparavant `auth.getUser()` était appelé sur
  //    chaque requête traversant le matcher — donc sur toutes les pages
  //    publiques, où son résultat n'était jamais lu (audit 09.6.2).
  //    Les deux prédicats sont repris à l'identique des conditions d'origine :
  //    ils sont seulement nommés et évalués plus tôt.
  //
  // NB : `/dashboard-preview` (aperçu public) n'est visé NI par `=== '/dashboard'`
  //      NI par `startsWith('/dashboard/')` — il reste donc public.
  const estRouteProtegee =
    path === '/dashboard' ||
    path.startsWith('/dashboard/') ||
    path === '/admin' ||
    path.startsWith('/admin/')

  // Pages d'auth d'où l'on renvoie un utilisateur déjà connecté. `/callback` et
  // `/reset-password` en sont exclus : ils doivent rester accessibles à une
  // session active, et ne déclenchent donc plus aucun appel.
  const estPageAuthRedirigeable =
    path.startsWith('/auth/') &&
    !path.includes('/callback') &&
    !path.includes('/reset-password')

  if (estRouteProtegee || estPageAuthRedirigeable) {
    // Initialiser Supabase en lisant depuis request.cookies et en écrivant
    // directement sur i18nResponse (évite de créer un nouveau NextResponse qui
    // écraserait les headers/cookies posés par next-intl).
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            // Écrire les cookies Supabase (refresh de session) sur la réponse
            // qui sera retournée au client, quelle qu'elle soit.
            cookiesToSet.forEach(({ name, value, options }) =>
              i18nResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 4. Protéger /dashboard et /admin.
    //    On préserve le préfixe de locale : /en/dashboard → /en/auth/signin.
    if (estRouteProtegee && !user) {
      const url = request.nextUrl.clone()
      url.pathname = `${localePrefix}/auth/signin`
      return NextResponse.redirect(url)
    }

    // 5. Rediriger les utilisateurs déjà connectés hors des pages d'auth.
    //    On préserve le préfixe de locale : /en/auth/signin → /en/dashboard.
    if (estPageAuthRedirigeable && user) {
      const url = request.nextUrl.clone()
      url.pathname = `${localePrefix}/dashboard`
      return NextResponse.redirect(url)
    }
  }

  // 6. Transmettre le path sans préfixe de locale pour le layout.
  i18nResponse.headers.set('x-current-path', path)
  return i18nResponse
}

export const config = {
  // Exclure : routes API, assets Next.js internes, Vercel, et tout fichier avec une extension (favicon, images, sitemap…)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
