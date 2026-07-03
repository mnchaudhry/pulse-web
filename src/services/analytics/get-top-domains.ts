import type { RangeKey } from '@/utils/date-range'
import { rangeStart } from '@/utils/date-range'
import { fetchEventsInRange } from './fetch-events'

// US-40: top domains by active time over a range (also used by the bot).
export const getTopDomains = async (
  range: RangeKey,
  deviceId: string | 'combined',
  limit = 10,
) => {
  const from = rangeStart(range)
  const rows = await fetchEventsInRange({ from, deviceId })
  const byDomain = new Map<string, number>()
  for (const r of rows.filter(e => new Date(e.started_at) >= from))
    byDomain.set(r.domain, (byDomain.get(r.domain) ?? 0) + r.active_seconds)

  return [...byDomain.entries()]
    .map(([domain, seconds]) => ({ domain, seconds }))
    .sort((a, b) => b.seconds - a.seconds)
    .slice(0, limit)
}
