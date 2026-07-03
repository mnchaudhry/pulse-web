import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-33/34/35: set a category override at account scope (deviceId null) or for a
// single device. Replaces any existing override at that scope. Overrides win.
export const setCategoryOverride = async (
  domain: string,
  category: string,
  deviceId: string | null = null,
) => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    throw new Error('Not authenticated')

  const existing = supabase.from('category_overrides').delete().eq('domain', domain)
  await (deviceId ? existing.eq('device_id', deviceId) : existing.is('device_id', null))

  const { error } = await supabase
    .from('category_overrides')
    .insert({ user_id: user.id, domain, category, device_id: deviceId })
  if (error)
    throw error
}
