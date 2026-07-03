import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-27: remove an exclude rule.
export const removeExcludeRule = async (id: string) => {
  const supabase = createBrowserClient()
  const { error } = await supabase.from('exclude_rules').delete().eq('id', id)
  if (error)
    throw error
}
