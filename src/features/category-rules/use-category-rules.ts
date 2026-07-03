'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listCategoryRules } from '@/services/categories/list-category-rules'
import { setCategoryOverride } from '@/services/categories/set-category-override'

// US-32..34: list domain→category rules and override them.
export const useCategoryRules = () => {
  const queryClient = useQueryClient()
  const rulesQuery = useQuery({ queryKey: ['category-rules'], queryFn: listCategoryRules })

  const override = useMutation({
    mutationFn: ({ domain, category }: { domain: string, category: string }) =>
      setCategoryOverride(domain, category),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['category-rules'] }),
  })

  return { rulesQuery, override }
}
