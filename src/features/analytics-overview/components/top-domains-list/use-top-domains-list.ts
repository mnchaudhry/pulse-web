'use client'

import type { RangeKey } from '@/utils/date-range'
import type { PageSlice } from '../../types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getDomainPages } from '@/services/analytics/get-domain-pages'
import { useDeviceFilterStore } from '@/stores/device-filter-store'
import { formatDuration } from '@/utils/format-duration'

// US-40: page-level drill-down for a clicked domain — Nice for the popup,
// Must on the dashboard overview (tracking-spec §6.4).
export const useTopDomainsList = (range: RangeKey) => {
  const deviceId = useDeviceFilterStore(s => s.deviceId)
  const [openDomain, setOpenDomain] = useState<string | null>(null)

  const pagesQuery = useQuery({
    queryKey: ['domain-pages', range, deviceId, openDomain],
    queryFn: () => getDomainPages(range, deviceId, openDomain!),
    enabled: openDomain !== null,
  })

  const rows = pagesQuery.data ?? []
  const max = rows[0]?.seconds ?? 0
  const pages: PageSlice[] = rows.map(r => ({
    url: r.url,
    title: r.title,
    dur: formatDuration(r.seconds),
    pct: max ? Math.round((r.seconds / max) * 100) : 0,
  }))

  return {
    openDomain,
    openDrilldown: setOpenDomain,
    closeDrilldown: () => setOpenDomain(null),
    pages,
    isLoading: pagesQuery.isLoading,
  }
}
