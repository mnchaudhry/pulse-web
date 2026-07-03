import type { ReactNode } from 'react'

// Static design-mock insights (US-50). Observations Pulse surfaced — never verdicts.

const cardIcon = (paths: ReactNode) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    {paths}
  </svg>
)

const lightbulb = cardIcon(<>
  <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2V17h6v-1.5c0-.8.3-1.3 1-2A6 6 0 0 0 12 3Z" />
  <path d="M9.5 20h5" />
</>)

const target = cardIcon(<>
  <circle cx="12" cy="12" r="8" />
  <circle cx="12" cy="12" r="3" />
</>)

const monitor = cardIcon(<>
  <rect x="2" y="4" width="20" height="13" rx="2" />
  <path d="M8 21h8M12 17v4" />
</>)

export interface Insight {
  tint: string
  tag: string
  icon: ReactNode
  title: string
  body: string
  time: string
  chips: { k: string, v: string }[]
}

export const insights: Insight[] = [
  {
    tint: '#B26A00',
    tag: 'Anomaly',
    icon: lightbulb,
    title: 'News is up sharply this week',
    body: '6h 40m on News this week, up from 4h 10m last week — the largest week-over-week increase of any category.',
    time: '2h ago',
    chips: [
      { k: 'this week', v: '6h 40m' },
      { k: 'last week', v: '4h 10m' },
      { k: 'change', v: '+60%' },
    ],
  },
  {
    tint: '#0E7C86',
    tag: 'Focus',
    icon: target,
    title: 'Longest focus block today',
    body: '9:14 – 11:02 on Dev domains — 1h 48m uninterrupted, your longest block in 9 days.',
    time: 'today, 11:04',
    chips: [
      { k: 'duration', v: '1h 48m' },
      { k: 'domains', v: 'github, localhost' },
    ],
  },
  {
    tint: '#3B6FB0',
    tag: 'Device',
    icon: monitor,
    title: 'Work profile: 4h 02m on Slack today',
    body: 'On the Work profile alone, Slack accounted for 4h 02m — clearer as a per-device figure than blended across all devices.',
    time: 'today, 17:30',
    chips: [
      { k: 'Work profile', v: '4h 02m' },
      { k: 'domain', v: 'slack.com' },
    ],
  },
  {
    tint: '#8A5CB0',
    tag: 'Trend',
    icon: lightbulb,
    title: 'Social is below your average',
    body: '3h 12m on Social this week — 18% below your 4-week average of 3h 54m.',
    time: 'yesterday',
    chips: [
      { k: 'this week', v: '3h 12m' },
      { k: '4-wk avg', v: '3h 54m' },
    ],
  },
]

export const insightFilters = ['All', 'Anomalies', 'Focus', 'Trends', 'Devices']
