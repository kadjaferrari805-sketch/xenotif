import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for Supabase session cookie (sb-*-auth-token)
  const hasSession = request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))

  // Protect /dashboard and /admin — redirect to signin if no session cookie
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !hasSession) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith('/auth/') && hasSession && !pathname.includes('/callback') && !pathname.includes('/reset-password')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-current-path', pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
