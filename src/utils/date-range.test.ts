import { describe, expect, it } from 'vitest'
import { overviewFetchStart, rangeStart } from './date-range'

const NOW = new Date('2026-07-02T15:00:00Z')

describe('rangeStart', () => {
  it('Today starts at local midnight, at or before now', () => {
    expect(rangeStart('Today', NOW).getTime()).toBeLessThanOrEqual(NOW.getTime())
  })

  it('Week and Month start at or before Today', () => {
    const today = rangeStart('Today', NOW).getTime()
    expect(rangeStart('Week', NOW).getTime()).toBeLessThanOrEqual(today)
    expect(rangeStart('Month', NOW).getTime()).toBeLessThanOrEqual(today)
  })
})

describe('overviewFetchStart', () => {
  it('always reaches back at least ~14 days for the trend', () => {
    const start = overviewFetchStart('Today', NOW)
    const fourteenDaysMs = 13 * 86_400_000
    expect(NOW.getTime() - start.getTime()).toBeGreaterThanOrEqual(fourteenDaysMs)
  })
})
