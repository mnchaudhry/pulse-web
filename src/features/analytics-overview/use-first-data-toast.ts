'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { markFirstDataSeen } from '@/services/account/mark-first-data-seen'
import { getProfile } from '@/services/account/get-profile'

// Onboarding Stage 6 (onboarding-flow.md) — the empty-to-populated
// transition otherwise happens silently. Fires the toast exactly once per
// account, ever, the first time this screen has real data to show.
export const useFirstDataToast = (hasData: boolean) => {
  const queryClient = useQueryClient()
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getProfile })
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!hasData || !profileQuery.data || profileQuery.data.first_data_seen_at)
      return
    setShow(true)
    void markFirstDataSeen().then(() => queryClient.invalidateQueries({ queryKey: ['profile'] }))
  }, [hasData, profileQuery.data, queryClient])

  return { show, dismiss: () => setShow(false) }
}
