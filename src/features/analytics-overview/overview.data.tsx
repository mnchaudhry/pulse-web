import type { ReactNode } from 'react'
import type { Category } from '@/constants/categories'
import { CATEGORY_COLORS } from '@/constants/categories'
import { formatDurationFromMinutes as fmt } from '@/utils/format-duration'

// Static design-mock data (US-36..41). Swapped for real aggregates once the
// analytics services are wired.

const RAW_CATEGORIES: [Category, number][] = [
  ['Dev', 160],
  ['Work', 115],
  ['Social', 65],
  ['News', 40],
  ['Reference', 35],
  ['Entertainment', 25],
  ['Shopping', 12],
  ['Uncategorized', 8],
]

export const totalMinutes = RAW_CATEGORIES.reduce((sum, [, m]) => sum + m, 0)
export const totalActive = fmt(totalMinutes)

export const categories = RAW_CATEGORIES.map(([name, minutes]) => ({
  name,
  color: CATEGORY_COLORS[name],
  dur: fmt(minutes),
  pct: Math.round((minutes / totalMinutes) * 100),
}))

const statIcon = (paths: ReactNode) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    {paths}
  </svg>
)

export interface Stat {
  label: string
  value: string
  delta: string
  tint: string
  icon: ReactNode
}

export const stats: Stat[] = [
  {
    label: 'Total active',
    value: totalActive,
    delta: '+42m vs. yesterday',
    tint: '#005ea4',
    icon: statIcon(<>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>),
  },
  {
    label: 'Focus score',
    value: '63',
    delta: 'steady · 7-day avg 61',
    tint: '#005ea4',
    icon: statIcon(<>
      <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2V17h6v-1.5c0-.8.3-1.3 1-2A6 6 0 0 0 12 3Z" />
      <path d="M9.5 20h5" />
    </>),
  },
  {
    label: 'Longest block',
    value: '1h 48m',
    delta: '9:14–11:02 · Dev',
    tint: '#0E7C86',
    icon: statIcon(<>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </>),
  },
  {
    label: 'Top category',
    value: 'Dev',
    delta: '2h 40m · 35% of today',
    tint: '#0E7C86',
    icon: statIcon(<>
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 8V5M9 13h.01M15 13h.01M9.5 16.5h5" />
    </>),
  },
]

export const focusScore = 63
export const focusAverage = 61

const DOMAINS: [string, Category, number][] = [
  ['github.com', 'Dev', 100],
  ['localhost:3000', 'Dev', 55],
  ['figma.com', 'Work', 48],
  ['x.com', 'Social', 40],
  ['mail.google.com', 'Work', 32],
  ['youtube.com', 'Entertainment', 22],
  ['news.ycombinator.com', 'News', 20],
]

const domainMax = Math.max(...DOMAINS.map(([, , m]) => m))

export const domains = DOMAINS.map(([name, cat, minutes]) => ({
  name,
  cat,
  color: CATEGORY_COLORS[cat],
  dur: fmt(minutes),
  pct: Math.round((minutes / domainMax) * 100),
}))

export const focusBlocks = [
  { label: 'Dev · github.com, localhost', range: '9:14 – 11:02', dur: '1h 48m', color: CATEGORY_COLORS.Dev },
  { label: 'Work · figma.com', range: '13:30 – 14:35', dur: '1h 05m', color: CATEGORY_COLORS.Work },
  { label: 'Dev · github.com', range: '15:40 – 16:20', dur: '40m', color: CATEGORY_COLORS.Dev },
]

export const trend = {
  week: [5.2, 6.1, 4.8, 7.0, 6.5, 3.2, 4.6],
  prev: [4.4, 5.0, 5.6, 6.2, 5.1, 4.0, 3.9],
  max: 8,
  days: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'],
}

export const ranges = ['Today', 'Week', 'Month'] as const
export type Range = (typeof ranges)[number]
