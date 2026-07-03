import type { RawEventRow } from '@/lib/supabase/database.types'
import type {
  CategorySlice,
  DomainSlice,
  FocusBlock,
  OverviewData,
  StatCard,
  TrendData,
} from '@/features/analytics-overview/types'
import { addDays, format, isSameDay } from 'date-fns'
import { CATEGORY_COLORS } from '@/constants/categories'
import { formatDurationFromMinutes as fmt } from '@/utils/format-duration'

const colorFor = (category: string) =>
  (CATEGORY_COLORS as Record<string, string>)[category] ?? CATEGORY_COLORS.Uncategorized

const toMinutes = (seconds: number) => Math.round(seconds / 60)
const hhmm = (iso: string) => format(new Date(iso), 'H:mm')

const WORK_CATEGORIES = new Set(['Dev', 'Work'])
const isWorkHour = (iso: string) => {
  const h = new Date(iso).getHours()
  return h >= 9 && h < 18
}

const focusScoreFor = (rows: RawEventRow[]): number => {
  const workHourRows = rows.filter(r => isWorkHour(r.started_at))
  const total = workHourRows.reduce((sum, r) => sum + r.active_seconds, 0)
  if (!total)
    return 0
  const focused = workHourRows
    .filter(r => WORK_CATEGORIES.has(r.category))
    .reduce((sum, r) => sum + r.active_seconds, 0)
  return Math.round((focused / total) * 100)
}

// Pure transform of raw_events → everything the overview screen renders.
// `rows` should span at least the last 14 days so the trend + prev-week draw.
export function computeOverview(
  rows: RawEventRow[],
  rangeFrom: Date,
  now: Date = new Date(),
): OverviewData {
  const inRange = rows.filter(r => new Date(r.started_at) >= rangeFrom)

  // --- categories ---
  const catSeconds = new Map<string, number>()
  for (const r of inRange)
    catSeconds.set(r.category, (catSeconds.get(r.category) ?? 0) + r.active_seconds)

  const totalSeconds = [...catSeconds.values()].reduce((a, b) => a + b, 0)
  const categories: CategorySlice[] = [...catSeconds.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, sec]) => ({
      name,
      color: colorFor(name),
      dur: fmt(toMinutes(sec)),
      pct: totalSeconds ? Math.round((sec / totalSeconds) * 100) : 0,
    }))

  // --- top domains ---
  const domainAgg = new Map<string, { sec: number, cats: Map<string, number> }>()
  for (const r of inRange) {
    const entry = domainAgg.get(r.domain) ?? { sec: 0, cats: new Map() }
    entry.sec += r.active_seconds
    entry.cats.set(r.category, (entry.cats.get(r.category) ?? 0) + r.active_seconds)
    domainAgg.set(r.domain, entry)
  }
  const domainRanked = [...domainAgg.entries()].sort((a, b) => b[1].sec - a[1].sec).slice(0, 7)
  const domainMax = domainRanked[0]?.[1].sec ?? 0
  const topDomains: DomainSlice[] = domainRanked.map(([domain, entry]) => {
    const cat = [...entry.cats.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Uncategorized'
    return {
      name: domain,
      cat,
      color: colorFor(cat),
      dur: fmt(toMinutes(entry.sec)),
      pct: domainMax ? Math.round((entry.sec / domainMax) * 100) : 0,
    }
  })

  // --- focus score + 7-day average ---
  const focusScore = focusScoreFor(inRange)
  const dailyScores: number[] = []
  for (let i = 0; i < 7; i++) {
    const day = addDays(now, -i)
    const dayRows = rows.filter(r => isSameDay(new Date(r.started_at), day))
    if (dayRows.length)
      dailyScores.push(focusScoreFor(dayRows))
  }
  const focusAverage = dailyScores.length
    ? Math.round(dailyScores.reduce((a, b) => a + b, 0) / dailyScores.length)
    : focusScore

  // --- longest focus blocks (top 3 events by active time) ---
  const longestBlocks: FocusBlock[] = [...inRange]
    .sort((a, b) => b.active_seconds - a.active_seconds)
    .slice(0, 3)
    .map(r => ({
      label: `${r.category} · ${r.domain}`,
      range: `${hhmm(r.started_at)} – ${hhmm(r.ended_at)}`,
      dur: fmt(toMinutes(r.active_seconds)),
      color: colorFor(r.category),
    }))

  // --- trend: last 7 days vs previous 7 (hours/day) ---
  const dayHours = (day: Date) =>
    rows
      .filter(r => isSameDay(new Date(r.started_at), day))
      .reduce((sum, r) => sum + r.active_seconds, 0) / 3600

  const week: number[] = []
  const prev: number[] = []
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const day = addDays(now, -i)
    week.push(Number(dayHours(day).toFixed(2)))
    prev.push(Number(dayHours(addDays(day, -7)).toFixed(2)))
    days.push(format(day, 'EEE'))
  }
  const trendMax = Math.max(1, ...week, ...prev)
  const trend: TrendData = { week, prev, max: Math.ceil(trendMax), days }

  // --- stat cards ---
  const top = categories[0]
  const longest = longestBlocks[0]
  const stats: StatCard[] = [
    { label: 'Total active', value: fmt(toMinutes(totalSeconds)), delta: 'active, focused time', tint: '#005ea4' },
    { label: 'Focus score', value: String(focusScore), delta: `steady · 7-day avg ${focusAverage}`, tint: '#005ea4' },
    { label: 'Longest block', value: longest?.dur ?? '0m', delta: longest ? `${longest.range} · ${longest.label.split(' · ')[0]}` : 'no activity yet', tint: '#0E7C86' },
    { label: 'Top category', value: top?.name ?? '—', delta: top ? `${top.dur} · ${top.pct}% of range` : 'no activity yet', tint: '#0E7C86' },
  ]

  return {
    totalActive: fmt(toMinutes(totalSeconds)),
    hasData: inRange.length > 0,
    categories,
    topDomains,
    focusScore,
    focusAverage,
    longestBlocks,
    trend,
    stats,
  }
}
