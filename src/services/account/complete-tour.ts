import { createBrowserClient } from '@/lib/supabase/browser-client'

// Onboarding Stage 5 (onboarding-flow.md) — account-scoped, not per-device
// localStorage, so a second device never re-runs the tour for this account.
export const completeTour = async () => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    throw new Error('Not authenticated')

  const { error } = await supabase
    .from('users')
    .update({ tour_completed_at: new Date().toISOString() })
    .eq('id', user.id)
  if (error)
    throw error
}
