import type { RawEventRow } from '@/lib/supabase/database.types'
import { describe, expect, it } from 'vitest'
import { computeOverview } from './compute-overview'

const NOW = new Date('2026-07-02T18:00:00.000Z')
const START_OF_DAY = new Date('2026-07-02T00:00:00.000Z')

const event = (over: Partial<RawEventRow> & { started_at: string, active_seconds: number }): RawEventRow => ({
  id: crypto.randomUUID(),
  user_id: 'u1',
  device_id: 'd1',
  url: 'https://github.com/x',
  domain: 'github.com',
  title: 'x',
  referrer_domain: null,
  category: 'Dev',
  ended_at: over.started_at,
  created_at: over.started_at,
  ...over,
})

describe('computeOverview', () => {
  it('sums active time per single device', () => {
    const rows = [
      event({ started_at: '2026-07-02T09:00:00.000Z', active_seconds: 600, category: 'Dev', domain: 'github.com' }),
      event({ started_at: '2026-07-02T10:00:00.000Z', active_seconds: 600, category: 'Work', domain: 'figma.com' }),
    ]
    const data = computeOverview(rows, START_OF_DAY, NOW, false)
    expect(data.totalActive).toBe('20m')
    expect(data.categories.map(c => c.name)).toContain('Dev')
    expect(data.topDomains[0].name).toBe('github.com')
  })

  it('de-duplicates overlapping active time across devices in combined view (US-44)', () => {
    // Two devices, each 10 min, fully overlapping window → merged ~10 min, not 20.
    const rows = [
      event({ device_id: 'd1', started_at: '2026-07-02T09:00:00.000Z', active_seconds: 600 }),
      event({ device_id: 'd2', started_at: '2026-07-02T09:00:00.000Z', active_seconds: 600 }),
    ]
    const combined = computeOverview(rows, START_OF_DAY, NOW, true)
    const summed = computeOverview(rows, START_OF_DAY, NOW, false)
    expect(combined.totalActive).toBe('10m')
    expect(summed.totalActive).toBe('20m')
  })

  it('reports no data for an empty range', () => {
    const data = computeOverview([], START_OF_DAY, NOW, true)
    expect(data.hasData).toBe(false)
    expect(data.categories).toHaveLength(0)
  })

  it('conserves total active time exactly when a merged span crosses a home-TZ calendar day boundary', () => {
    // A single 30h span starting at UTC midnight spans two UTC calendar days
    // (24h + 6h) — each day's slice is under that day's own length, so
    // nothing gets clamped; the total must still equal the real 30h, not
    // silently lose or double-count time at the boundary (spec §11.3, §11.7).
    const rows = [event({ started_at: '2026-07-02T00:00:00.000Z', active_seconds: 30 * 3600 })]
    const combined = computeOverview(rows, START_OF_DAY, NOW, true, 'UTC')

    expect(combined.totalActive).toBe('30h 00m')
  })

  it('conserves total active time across a DST fall-back boundary (decision #23)', () => {
    // America/New_York falls back on 2026-11-01 (a real 25-hour local day).
    // A 30h span starting mid-day splits across Nov 1 and Nov 2 — both
    // slices stay under their own day's length, so the full 30h survives.
    const fallBackDay = new Date('2026-11-01T00:00:00Z')
    const now = new Date('2026-11-02T23:00:00Z')
    const rows = [event({ started_at: '2026-11-01T09:00:00.000Z', active_seconds: 30 * 3600 })]
    const combined = computeOverview(rows, fallBackDay, now, true, 'America/New_York')

    expect(combined.totalActive).toBe('30h 00m')
  })
})
