import type { DeviceRow } from '@/lib/supabase/database.types'
import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-10/12: every device reporting to the account (RLS-scoped).
export const listDevices = async (): Promise<DeviceRow[]> => {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: true })
  if (error)
    throw error
  return data ?? []
}
