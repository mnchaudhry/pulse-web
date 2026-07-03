import { startOfDay, startOfMonth, startOfWeek, subDays } from 'date-fns'

export type RangeKey = 'Today' | 'Week' | 'Month'

// Start of the selected analytics range. (Uses local time; home-timezone-aware
// boundaries are a later refinement — US-62.)
export const rangeStart = (range: RangeKey, now: Date = new Date()): Date => {
  switch (range) {
    case 'Today':
      return startOfDay(now)
    case 'Week':
      return startOfWeek(now, { weekStartsOn: 1 })
    case 'Month':
      return startOfMonth(now)
  }
}

// Earliest timestamp any overview computation needs: the range start, but never
// less than 14 days back so the 7-day trend + previous-week comparison have data.
export const overviewFetchStart = (range: RangeKey, now: Date = new Date()): Date => {
  const fourteenDaysAgo = startOfDay(subDays(now, 13))
  const start = rangeStart(range, now)
  return start < fourteenDaysAgo ? start : fourteenDaysAgo
}
