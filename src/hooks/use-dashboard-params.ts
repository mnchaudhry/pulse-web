'use client'

import type { RangeKey } from '@/utils/date-range'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDeviceFilterStore } from '@/stores/device-filter-store'

const setParam = (
  router: ReturnType<typeof useRouter>,
  pathname: string,
  searchParams: URLSearchParams,
  key: string,
  value: string | null,
) => {
  const params = new URLSearchParams(searchParams.toString())
  if (value === null)
    params.delete(key)
  else
    params.set(key, value)
  const query = params.toString()
  router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
}

// P1.3: keeps the dashboard-wide device scope mirrored to `?device=` so a
// refresh or a shared link preserves it. Combined omits the param entirely.
export const useDeviceParamSync = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const deviceId = useDeviceFilterStore(s => s.deviceId)
  const setDeviceId = useDeviceFilterStore(s => s.setDeviceId)

  useEffect(() => {
    const fromUrl = searchParams.get('device')
    if (fromUrl && fromUrl !== deviceId)
      setDeviceId(fromUrl)
    // Only meant to hydrate the store from the URL once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setParam(router, pathname, searchParams, 'device', deviceId === 'combined' ? null : deviceId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId])
}

const RANGE_TO_PARAM: Record<RangeKey, string> = { Today: 'today', Week: 'week', Month: 'month' }
const PARAM_TO_RANGE: Record<string, RangeKey> = { today: 'Today', week: 'Week', month: 'Month' }

// P1.3: Overview's range toggle, URL-backed via `?range=` (default Today, omitted from the URL).
export const useRangeParam = (): [RangeKey, (range: RangeKey) => void] => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const range = PARAM_TO_RANGE[searchParams.get('range') ?? ''] ?? 'Today'

  const setRange = (next: RangeKey) => {
    setParam(router, pathname, searchParams, 'range', next === 'Today' ? null : RANGE_TO_PARAM[next])
  }

  return [range, setRange]
}

const INSIGHT_FILTER_TO_PARAM: Record<string, string> = {
  All: 'all',
  Anomalies: 'anomalies',
  Focus: 'focus',
  Trends: 'trends',
  Devices: 'devices',
}
const PARAM_TO_INSIGHT_FILTER: Record<string, string> = Object.fromEntries(
  Object.entries(INSIGHT_FILTER_TO_PARAM).map(([label, param]) => [param, label]),
)

// P1.3: Insights' filter pill, URL-backed via `?insight=` (default All, omitted from the URL).
export const useInsightFilterParam = (): [string, (filter: string) => void] => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filter = PARAM_TO_INSIGHT_FILTER[searchParams.get('insight') ?? ''] ?? 'All'

  const setFilter = (next: string) => {
    setParam(router, pathname, searchParams, 'insight', next === 'All' ? null : INSIGHT_FILTER_TO_PARAM[next])
  }

  return [filter, setFilter]
}
