import type { RangeKey } from '@/utils/date-range'
import { rangeStart } from '@/utils/date-range'
import { fetchEventsInRange } from './fetch-events'

// US-36..38: active seconds per category over a range (also used by the bot).
export const getTimeByCategory = async (range: RangeKey, deviceId: string | 'combined') => {
  const from = rangeStart(range)
  const rows = await fetchEventsInRange({ from, deviceId })
  const byCategory = new Map<string, number>()
  for (const r of rows.filter(e => new Date(e.started_at) >= from))
    byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + r.active_seconds)

  return [...byCategory.entries()]
    .map(([category, seconds]) => ({ category, seconds }))
    .sort((a, b) => b.seconds - a.seconds)
}
