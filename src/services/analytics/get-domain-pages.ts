import type { RangeKey } from '@/utils/date-range'
import { normalizePageUrl } from '@/utils/normalize-page-url'
import { rangeStart } from '@/utils/date-range'
import { fetchEventsInRange } from './fetch-events'

export interface PageBreakdownRow {
  url: string
  title: string
  seconds: number
}

// US-40: page-level drill-down within one domain (§6.4) — same data as the
// site-level rollup, grouped by normalized URL instead of by domain. Two
// visits to the same page (e.g. re-watching a video) sum into one row.
export const getDomainPages = async (
  range: RangeKey,
  deviceId: string | 'combined',
  domain: string,
): Promise<PageBreakdownRow[]> => {
  const from = rangeStart(range)
  const rows = await fetchEventsInRange({ from, deviceId })

  const byPage = new Map<string, PageBreakdownRow>()
  for (const r of rows) {
    if (r.domain !== domain || new Date(r.started_at) < from)
      continue
    const key = normalizePageUrl(r.url)
    const entry = byPage.get(key) ?? { url: r.url, title: r.title ?? '', seconds: 0 }
    entry.seconds += r.active_seconds
    if (!entry.title && r.title)
      entry.title = r.title
    byPage.set(key, entry)
  }

  return [...byPage.values()].sort((a, b) => b.seconds - a.seconds)
}
