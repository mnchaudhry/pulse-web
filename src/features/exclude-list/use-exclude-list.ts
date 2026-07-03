'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listDevices } from '@/services/devices/list-devices'
import { addExcludeRule } from '@/services/privacy/add-exclude-rule'
import { listExcludeRules } from '@/services/privacy/list-exclude-rules'
import { removeExcludeRule } from '@/services/privacy/remove-exclude-rule'

// US-27/29: manage account-level and device-scoped exclusions from the dashboard.
export const useExcludeList = () => {
  const queryClient = useQueryClient()
  const rulesQuery = useQuery({ queryKey: ['exclude-rules'], queryFn: listExcludeRules })
  const devicesQuery = useQuery({ queryKey: ['devices'], queryFn: listDevices })
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['exclude-rules'] })

  const add = useMutation({
    mutationFn: ({ pattern, deviceId }: { pattern: string, deviceId: string | null }) =>
      addExcludeRule(pattern, deviceId),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: (id: string) => removeExcludeRule(id),
    onSuccess: invalidate,
  })

  const rules = rulesQuery.data ?? []
  return {
    isLoading: rulesQuery.isLoading,
    devices: devicesQuery.data ?? [],
    accountRules: rules.filter(r => !r.device_id),
    deviceRules: rules.filter(r => r.device_id),
    add,
    remove,
  }
}
