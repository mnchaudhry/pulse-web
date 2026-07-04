import { NextResponse } from 'next/server'
import { routes } from '@/constants/routes'
import { createServerClient } from '@/lib/supabase/server-client'

// OAuth + email-link landing (signup confirm, Google sign-in, password reset):
// exchanges the ?code for a session cookie, then forwards to ?next.
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Only allow internal paths — never redirect off-site (open-redirect guard).
  const nextParam = searchParams.get('next') ?? routes.overview
  const next = nextParam.startsWith('/') ? nextParam : routes.overview

  if (code) {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Behind a proxy (Vercel) trust the forwarded host so the redirect lands
      // on the real domain (pulse.brinn.app), not the internal origin.
      const forwardedHost = request.headers.get('x-forwarded-host')
      const base = process.env.NODE_ENV === 'development' || !forwardedHost
        ? origin
        : `https://${forwardedHost}`
      return NextResponse.redirect(`${base}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
