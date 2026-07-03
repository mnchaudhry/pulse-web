import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server-client'

// OAuth + email-link landing: exchanges the ?code for a session cookie, then
// forwards to ?next (used by Google sign-in and password-reset links).
export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/overview'

  if (code) {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error)
      return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
