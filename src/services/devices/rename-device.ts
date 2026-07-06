import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-09: rename a device. `renamed` also gates onboarding Stage 4
// (onboarding-flow.md) — once true, the device naming step never reappears.
export const renameDevice = async (deviceId: string, label: string) => {
  const supabase = createBrowserClient()
  const { error } = await supabase.from('devices').update({ label, renamed: true }).eq('id', deviceId)
  if (error)
    throw error
}
