import type { RangeKey } from '@/utils/date-range'
import { computeOverview } from '@/utils/compute-overview'
import { overviewFetchStart, rangeStart } from '@/utils/date-range'
import { fetchEventsInRange } from './fetch-events'

// One fetch → the full overview screen (US-36..41). Pulls a 14-day window so the
// trend + previous-week comparison have data, then computes for the range.
export const getOverview = async (range: RangeKey, deviceId: string | 'combined') => {
  const now = new Date()
  const rows = await fetchEventsInRange({ from: overviewFetchStart(range, now), deviceId })
  return computeOverview(rows, rangeStart(range, now), now, deviceId === 'combined')
}
