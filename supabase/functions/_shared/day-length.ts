// Home-timezone-aware day boundaries (tracking-spec §11.2/§11.7). Built on
// `Intl.DateTimeFormat` — no extra timezone dependency needed, and Deno's
// runtime ships full ICU data. Hand-kept identical to
// pulse-web/src/utils/day-length.ts (tech-stack §5 manual-sync pattern) since
// Edge Functions run in a separate Deno bundle and can't import from `src/`.

const zonedCalendarParts = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]))
  return { year: Number(map.year), month: Number(map.month), day: Number(map.day) }
}

const offsetMinutesAt = (date: Date, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date)
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]))
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  )
  return Math.round((asUtc - date.getTime()) / 60_000)
}

const zonedMidnightUtcMs = (year: number, month: number, day: number, timeZone: string): number => {
  let guess = Date.UTC(year, month - 1, day, 0, 0, 0)
  for (let i = 0; i < 2; i++) {
    const offset = offsetMinutesAt(new Date(guess), timeZone)
    guess = Date.UTC(year, month - 1, day, 0, 0, 0) - offset * 60_000
  }
  return guess
}

const nextMidnightAfter = (ms: number, timeZone: string): number => {
  const { year, month, day } = zonedCalendarParts(new Date(ms), timeZone)
  const nextCalendarDay = new Date(Date.UTC(year, month - 1, day + 1))
  return zonedMidnightUtcMs(
    nextCalendarDay.getUTCFullYear(),
    nextCalendarDay.getUTCMonth() + 1,
    nextCalendarDay.getUTCDate(),
    timeZone,
  )
}

export const dayKeyInZone = (date: Date, timeZone: string): string => {
  const { year, month, day } = zonedCalendarParts(date, timeZone)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export interface DaySplit { day: string, seconds: number }

// Splits one visit's active seconds across the calendar day(s) (in timeZone)
// its active window falls on — proportional split at home-TZ midnight
// (spec §11.7, decision #16).
export const splitAcrossDays = (startedAtMs: number, activeSeconds: number, timeZone: string): DaySplit[] => {
  const day1 = dayKeyInZone(new Date(startedAtMs), timeZone)
  const boundary = nextMidnightAfter(startedAtMs, timeZone)
  const windowEndMs = startedAtMs + activeSeconds * 1000

  if (windowEndMs <= boundary)
    return [{ day: day1, seconds: activeSeconds }]

  const secondsBeforeMidnight = Math.round((boundary - startedAtMs) / 1000)
  const secondsAfterMidnight = activeSeconds - secondsBeforeMidnight
  const day2 = dayKeyInZone(new Date(windowEndMs), timeZone)
  return [
    { day: day1, seconds: secondsBeforeMidnight },
    { day: day2, seconds: secondsAfterMidnight },
  ]
}
