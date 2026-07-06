import { createBrowserClient } from '@/lib/supabase/browser-client'

// Onboarding Stage 6 (onboarding-flow.md) — fires the "your first activity
// just came in" toast exactly once per account, ever.
export const markFirstDataSeen = async () => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    throw new Error('Not authenticated')

  const { error } = await supabase
    .from('users')
    .update({ first_data_seen_at: new Date().toISOString() })
    .eq('id', user.id)
  if (error)
    throw error
}
