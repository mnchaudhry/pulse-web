'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { routes } from '@/constants/routes'
import { deleteAccount } from '@/services/account/delete-account'
import { exportData } from '@/services/account/export-data'
import { getProfile } from '@/services/account/get-profile'
import { updateTimezone } from '@/services/account/update-timezone'

// US-62/65/66: timezone, export, deletion.
export const useAccountSettings = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getProfile })

  const timezone = useMutation({
    mutationFn: updateTimezone,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })

  const exportMutation = useMutation({ mutationFn: exportData })

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      router.replace(routes.login)
      router.refresh()
    },
  })

  return { profileQuery, timezone, exportMutation, deleteMutation }
}
