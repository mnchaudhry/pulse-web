import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Supabase renamed anon → publishable; accept either so env naming can vary.
const SUPABASE_KEY
  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cookie-based client for Server Components and Route Handlers — reads the
// logged-in dashboard session; all access is RLS-scoped to that user.
export const createServerClient = async () => {
  const cookieStore = await cookies()

  return createSSRServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        }
        catch {
          // Called from a Server Component — the middleware refreshes cookies.
        }
      },
    },
  })
}

// Bearer-token client for the extension ingest endpoint (/api/events): runs as
// the token's user so RLS still isolates rows — no service-role key involved.
export const createTokenClient = (accessToken: string) => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
