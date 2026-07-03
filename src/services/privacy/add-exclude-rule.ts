import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-23/27/29: add an exclude rule. device_id null = account-level (all devices).
export const addExcludeRule = async (pattern: string, deviceId: string | null = null) => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    throw new Error('Not authenticated')

  const { error } = await supabase
    .from('exclude_rules')
    .insert({ user_id: user.id, pattern, device_id: deviceId })
  if (error)
    throw error
}
