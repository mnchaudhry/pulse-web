import { describe, expect, it } from 'vitest'
import { dayKeyInZone, dayLengthSeconds, splitAcrossDays, startOfDayInZone } from './day-length'

describe('dayLengthSeconds', () => {
  it('is 86,400s on an ordinary day', () => {
    expect(dayLengthSeconds(new Date('2026-07-06T12:00:00Z'), 'America/New_York')).toBe(86_400)
    expect(dayLengthSeconds(new Date('2026-07-06T12:00:00Z'), 'UTC')).toBe(86_400)
  })

  it('is 90,000s on a DST fall-back day (25-hour day, decision #23)', () => {
    // America/New_York falls back on 2026-11-01.
    expect(dayLengthSeconds(new Date('2026-11-01T12:00:00Z'), 'America/New_York')).toBe(90_000)
  })

  it('is 82,800s on a DST spring-forward day (23-hour day)', () => {
    // America/New_York springs forward on 2026-03-08.
    expect(dayLengthSeconds(new Date('2026-03-08T12:00:00Z'), 'America/New_York')).toBe(82_800)
  })
})

describe('startOfDayInZone / dayKeyInZone', () => {
  it('resolves the correct local calendar day even when UTC has already rolled over', () => {
    // 2026-07-06T02:00:00Z is still 2026-07-05 evening in America/Los_Angeles.
    const instant = new Date('2026-07-06T02:00:00Z')
    expect(dayKeyInZone(instant, 'America/Los_Angeles')).toBe('2026-07-05')
    expect(dayKeyInZone(instant, 'UTC')).toBe('2026-07-06')
  })

  it('startOfDayInZone lands exactly at local midnight', () => {
    const start = startOfDayInZone(new Date('2026-07-06T18:00:00Z'), 'America/New_York')
    expect(dayKeyInZone(start, 'America/New_York')).toBe('2026-07-06')
    // One second earlier must be the previous calendar day.
    expect(dayKeyInZone(new Date(start.getTime() - 1000), 'America/New_York')).toBe('2026-07-05')
  })
})

describe('splitAcrossDays', () => {
  it('does not split a visit that stays within one calendar day', () => {
    const startedAt = new Date('2026-07-06T20:00:00Z').getTime() // 4pm America/New_York
    const result = splitAcrossDays(startedAt, 600, 'America/New_York')

    expect(result).toEqual([{ day: '2026-07-06', seconds: 600 }])
  })

  it('splits a visit crossing home-TZ midnight proportionally (spec §11.7 example)', () => {
    // 11:30pm-12:30am America/New_York → 30 min on each side of midnight.
    const startedAt = new Date('2026-07-07T03:30:00Z').getTime() // 11:30pm 2026-07-06 ET
    const result = splitAcrossDays(startedAt, 3600, 'America/New_York')

    expect(result).toEqual([
      { day: '2026-07-06', seconds: 1800 },
      { day: '2026-07-07', seconds: 1800 },
    ])
  })

  it('sums back to the original active seconds', () => {
    const startedAt = new Date('2026-07-07T03:45:00Z').getTime()
    const result = splitAcrossDays(startedAt, 1800, 'America/New_York')
    const total = result.reduce((sum, r) => sum + r.seconds, 0)

    expect(total).toBe(1800)
  })
})
