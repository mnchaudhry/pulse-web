'use client'

import type { NotificationPrefs } from '@/services/account/update-notification-prefs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile } from '@/services/account/get-profile'
import { updateNotificationPrefs } from '@/services/account/update-notification-prefs'

// US-49: read + persist notification channel preferences.
export const useNotificationPreferences = () => {
  const queryClient = useQueryClient()
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getProfile })

  const update = useMutation({
    mutationFn: (prefs: Partial<NotificationPrefs>) => updateNotificationPrefs(prefs),
    onMutate: async (prefs) => {
      await queryClient.cancelQueries({ queryKey: ['profile'] })
      const previous = queryClient.getQueryData(['profile'])
      queryClient.setQueryData(['profile'], (old: unknown) =>
        old ? { ...old, ...prefs } : old)
      return { previous }
    },
    onError: (_e, _v, context) => {
      if (context?.previous)
        queryClient.setQueryData(['profile'], context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })

  return { profileQuery, update }
}
