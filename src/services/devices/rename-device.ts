import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-09: rename a device.
export const renameDevice = async (deviceId: string, label: string) => {
  const supabase = createBrowserClient()
  const { error } = await supabase.from('devices').update({ label }).eq('id', deviceId)
  if (error)
    throw error
}
