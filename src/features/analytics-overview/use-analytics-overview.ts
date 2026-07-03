'use client'

import type { RangeKey } from '@/utils/date-range'
import { useQuery } from '@tanstack/react-query'
import { getOverview } from '@/services/analytics/get-overview'
import { useDeviceFilterStore } from '@/stores/device-filter-store'

// US-36..44: overview data for the active range + device scope.
export const useAnalyticsOverview = (range: RangeKey) => {
  const deviceId = useDeviceFilterStore(s => s.deviceId)

  return useQuery({
    queryKey: ['overview', range, deviceId],
    queryFn: () => getOverview(range, deviceId),
  })
}
