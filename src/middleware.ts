import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY
  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const PROTECTED = ['/overview', '/insights', '/bot', '/devices', '/settings']
const AUTH_PAGES = ['/login', '/signup', '/reset-password']

// Refreshes the Supabase session cookie on every request and guards routes:
// unauthenticated → /login for app pages; authenticated → /overview off auth pages.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options))
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Never gate the reset-password update screen (reached via emailed link).
  const isAuthPage = AUTH_PAGES.some(p => pathname.startsWith(p)) && !pathname.startsWith('/reset-password/update')
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/overview'
    // Already logged in but arriving from the extension → open the connect
    // modal so the AUTH_SUCCESS handoff can still run (otherwise the extension
    // never gets a session).
    const fromExtension = pathname.startsWith('/login') && url.searchParams.get('source') === 'extension'
    url.search = fromExtension ? 'connect=1' : ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // Run on everything except static assets, images and the OAuth callback.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
