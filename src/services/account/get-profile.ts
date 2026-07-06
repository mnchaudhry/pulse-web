import { createBrowserClient } from '@/lib/supabase/browser-client'

export interface Profile {
  home_timezone: string
  notif_chrome: boolean
  notif_email_daily: boolean
  notif_email_weekly: boolean
  disclosure_confirmed_at: string | null
  tour_completed_at: string | null
  first_data_seen_at: string | null
}

const PROFILE_COLUMNS = 'home_timezone, notif_chrome, notif_email_daily, notif_email_weekly, disclosure_confirmed_at, tour_completed_at, first_data_seen_at'

// The signed-in user's profile row (timezone, notification prefs, and
// onboarding state — onboarding-flow.md §3 derives resumability from these
// account-scoped signals rather than a separate wizard-state flag).
export const getProfile = async (): Promise<Profile | null> => {
  const supabase = createBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user)
    return null

  const { data, error } = await supabase
    .from('users')
    .select(PROFILE_COLUMNS)
    .eq('id', user.id)
    .maybeSingle()
  if (error)
    throw error
  if (data)
    return data

  // The row should always exist (handle_new_user trigger on signup), but if
  // it's ever missing, create it rather than hard-failing every screen that
  // reads a profile.
  const { data: created, error: createError } = await supabase
    .from('users')
    .upsert({ id: user.id, email: user.email }, { onConflict: 'id' })
    .select(PROFILE_COLUMNS)
    .single()
  if (createError)
    throw createError
  return created
}
