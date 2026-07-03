import type { InsightRow } from '@/lib/supabase/database.types'
import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-50: the insights feed, newest first (RLS-scoped).
export const listInsights = async (): Promise<InsightRow[]> => {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error)
    throw error
  return data ?? []
}
