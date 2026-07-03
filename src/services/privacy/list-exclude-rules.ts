import type { ExcludeRuleRow } from '@/lib/supabase/database.types'
import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-27/29: all exclude rules for the account (account-level + device-scoped).
export const listExcludeRules = async (): Promise<ExcludeRuleRow[]> => {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('exclude_rules')
    .select('*')
    .order('created_at', { ascending: true })
  if (error)
    throw error
  return data ?? []
}
