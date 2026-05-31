import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

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

  // 3. Initialiser Supabase en lisant depuis request.cookies et en écrivant
  //    directement sur i18nResponse (évite de créer un nouveau NextResponse qui
  //    écraserait les headers/cookies posés par next-intl).
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
  //    On préserve le préfixe de locale dans la redirection : /en/dashboard → /en/auth/signin.
  if ((path.startsWith('/dashboard') || path.startsWith('/admin')) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = `${localePrefix}/auth/signin`
    return NextResponse.redirect(url)
  }

  // 5. Rediriger les utilisateurs déjà connectés hors des pages d'auth.
  //    On préserve le préfixe de locale : /en/auth/signin → /en/dashboard.
  if (
    path.startsWith('/auth/') &&
    user &&
    !path.includes('/callback') &&
    !path.includes('/reset-password')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = `${localePrefix}/dashboard`
    return NextResponse.redirect(url)
  }

  // 6. Transmettre le path sans préfixe de locale pour le layout.
  i18nResponse.headers.set('x-current-path', path)
  return i18nResponse
}

export const config = {
  // Exclure : routes API, assets Next.js internes, Vercel, et tout fichier avec une extension (favicon, images, sitemap…)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
