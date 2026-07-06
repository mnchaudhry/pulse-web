import { clearBotChatStorage } from '@/features/bot-chat/bot-chat-storage'
import { createBrowserClient } from '@/lib/supabase/browser-client'

// US-65: permanent deletion. Deleting the auth user requires elevated access, so
// it runs in the `delete-account` Edge Function (service-role inside Supabase);
// the FK cascade from auth.users removes every device/event/aggregate/insight.
export const deleteAccount = async () => {
  const supabase = createBrowserClient()
  const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' })
  if (error)
    throw error
  await supabase.auth.signOut()
  clearBotChatStorage()
}
