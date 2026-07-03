'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addExcludeRule } from '@/services/privacy/add-exclude-rule'
import { listExcludeRules } from '@/services/privacy/list-exclude-rules'
import { removeExcludeRule } from '@/services/privacy/remove-exclude-rule'

// US-27/29: manage the account exclude-list from the dashboard.
export const useExcludeList = () => {
  const queryClient = useQueryClient()
  const rulesQuery = useQuery({ queryKey: ['exclude-rules'], queryFn: listExcludeRules })
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['exclude-rules'] })

  const add = useMutation({
    mutationFn: (pattern: string) => addExcludeRule(pattern),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: (id: string) => removeExcludeRule(id),
    onSuccess: invalidate,
  })

  const rules = rulesQuery.data ?? []
  return {
    isLoading: rulesQuery.isLoading,
    accountRules: rules.filter(r => !r.device_id),
    deviceRules: rules.filter(r => r.device_id),
    add,
    remove,
  }
}
