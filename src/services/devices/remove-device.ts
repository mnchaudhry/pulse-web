import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-11: remove/deauthorize a device. Cascades its events/aggregates (FKs).
export const removeDevice = async (deviceId: string) => {
  const supabase = createBrowserClient()
  const { error } = await supabase.from('devices').delete().eq('id', deviceId)
  if (error)
    throw error
}
