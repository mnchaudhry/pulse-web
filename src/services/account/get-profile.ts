import { createBrowserClient } from '@/lib/supabase/browser-client'

export interface Profile {
  home_timezone: string
  notif_chrome: boolean
  notif_email_daily: boolean
  notif_email_weekly: boolean
}

// The signed-in user's profile row (timezone + notification prefs).
export const getProfile = async (): Promise<Profile | null> => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    return null

  const { data, error } = await supabase
    .from('users')
    .select('home_timezone, notif_chrome, notif_email_daily, notif_email_weekly')
    .eq('id', user.id)
    .single()
  if (error)
    throw error
  return data
}
