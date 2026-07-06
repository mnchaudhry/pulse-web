import type { DeviceRow } from '@/lib/supabase/database.types'
import { createBrowserClient } from '@/lib/supabase/browser-client'

// Onboarding Stage 4 (onboarding-flow.md) — find this browser's own device
// row (identified by the extension's clientId, returned over the PING/
// AUTH_SUCCESS handoff) so the naming step edits the right one.
export const getDeviceByClientId = async (clientId: string): Promise<DeviceRow | null> => {
  const supabase = createBrowserClient()
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('client_id', clientId)
    .maybeSingle()
  if (error)
    throw error
  return data
}
