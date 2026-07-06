import { createBrowserClient } from '@/lib/supabase/browser-client'

// Onboarding Stage 2 (onboarding-flow.md) — persisted so resumability is
// derived from real account data, not a query param or local flag.
export const confirmDisclosure = async () => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    throw new Error('Not authenticated')

  const { error } = await supabase
    .from('users')
    .update({ disclosure_confirmed_at: new Date().toISOString() })
    .eq('id', user.id)
  if (error)
    throw error
}
