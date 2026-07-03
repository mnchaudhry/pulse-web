import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY
  = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client Components share one browser client (cookie-backed session).
let client: ReturnType<typeof createSSRBrowserClient<Database>> | undefined

export const createBrowserClient = () => {
  client ??= createSSRBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY)
  return client
}
