'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listCategoryRules } from '@/services/categories/list-category-rules'
import { setCategoryOverride } from '@/services/categories/set-category-override'
import { listDevices } from '@/services/devices/list-devices'

// US-32..35: list rules for a scope (account or device) and override them.
export const useCategoryRules = (deviceId: string | null) => {
  const queryClient = useQueryClient()
  const rulesQuery = useQuery({
    queryKey: ['category-rules', deviceId ?? 'account'],
    queryFn: () => listCategoryRules(deviceId),
  })
  const devicesQuery = useQuery({ queryKey: ['devices'], queryFn: listDevices })

  const override = useMutation({
    mutationFn: ({ domain, category }: { domain: string, category: string }) =>
      setCategoryOverride(domain, category, deviceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['category-rules'] }),
  })

  return { rulesQuery, devices: devicesQuery.data ?? [], override }
}
