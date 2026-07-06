import type { InsightRow } from '@/lib/supabase/database.types'
import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-50: the insights feed, newest first (RLS-scoped), strictly filtered to
// the active device scope. `device_id IS NULL` means an account-wide insight.
export const listInsights = async (deviceId: string | 'combined'): Promise<InsightRow[]> => {
  const supabase = createBrowserClient()
  const base = supabase
    .from('insights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const { data, error } = deviceId === 'combined'
    ? await base.is('device_id', null)
    : await base.eq('device_id', deviceId)

  if (error)
    throw error
  return data ?? []
}
