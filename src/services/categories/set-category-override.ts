import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-33/34: set an account-level category override (replaces any existing one
// for the domain). Overrides always win over the built-in map.
export const setCategoryOverride = async (domain: string, category: string) => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    throw new Error('Not authenticated')

  await supabase.from('category_overrides').delete().is('device_id', null).eq('domain', domain)
  const { error } = await supabase
    .from('category_overrides')
    .insert({ user_id: user.id, domain, category, device_id: null })
  if (error)
    throw error
}
