import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-62: set the home timezone used for daily/weekly boundaries.
export const updateTimezone = async (timezone: string) => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    throw new Error('Not authenticated')

  const { error } = await supabase
    .from('users')
    .update({ home_timezone: timezone })
    .eq('id', user.id)
  if (error)
    throw error
}
