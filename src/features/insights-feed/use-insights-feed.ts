'use client'

import type { InsightChip, InsightView } from './insight-meta'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { useDeviceFilterStore } from '@/stores/device-filter-store'
import { listInsights } from '@/services/insights/list-insights'
import { DEFAULT_META, KIND_META } from './insight-meta'

// US-50: fetch insights and map DB rows → card view models, scoped to the
// active device (US-42/43) — strict filter, no cross-scope blending.
export const useInsightsFeed = () => {
  const deviceId = useDeviceFilterStore(s => s.deviceId)

  return useQuery({
    queryKey: ['insights', deviceId],
    queryFn: () => listInsights(deviceId),
    select: (rows): InsightView[] =>
      rows.map((row) => {
        const meta = KIND_META[row.kind] ?? DEFAULT_META
        return {
          id: row.id,
          tint: meta.tint,
          tag: meta.tag,
          icon: meta.icon,
          title: row.title,
          body: row.body,
          time: formatDistanceToNow(new Date(row.created_at), { addSuffix: true }),
          chips: Array.isArray(row.payload) ? (row.payload as unknown as InsightChip[]) : [],
        }
      }),
  })
}
