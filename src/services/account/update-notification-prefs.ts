import { createBrowserClient } from '@/lib/supabase/browser-client'

export interface NotificationPrefs {
  notif_chrome: boolean
  notif_email_daily: boolean
  notif_email_weekly: boolean
}

// US-49: persist notification channel preferences.
export const updateNotificationPrefs = async (prefs: Partial<NotificationPrefs>) => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    throw new Error('Not authenticated')

  const { error } = await supabase.from('users').update(prefs).eq('id', user.id)
  if (error)
    throw error
}
