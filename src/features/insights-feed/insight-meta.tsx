import type { ReactNode } from 'react'

export interface InsightChip {
  k: string
  v: string
}

export interface InsightView {
  id: string
  tint: string
  tag: string
  icon: ReactNode
  title: string
  body: string
  time: string
  chips: InsightChip[]
}

const icon = (paths: ReactNode) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    {paths}
  </svg>
)

const lightbulb = icon(<><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2V17h6v-1.5c0-.8.3-1.3 1-2A6 6 0 0 0 12 3Z" /><path d="M9.5 20h5" /></>)
const target = icon(<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>)
const monitor = icon(<><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>)

// kind (insights.kind column) → display tag, accent colour, icon, filter bucket.
export const KIND_META: Record<string, { tag: string, tint: string, icon: ReactNode, filter: string }> = {
  anomaly: { tag: 'Anomaly', tint: '#B26A00', icon: lightbulb, filter: 'Anomalies' },
  focus: { tag: 'Focus', tint: '#0E7C86', icon: target, filter: 'Focus' },
  trend: { tag: 'Trend', tint: '#8A5CB0', icon: lightbulb, filter: 'Trends' },
  device: { tag: 'Device', tint: '#3B6FB0', icon: monitor, filter: 'Devices' },
}

export const DEFAULT_META = { tag: 'Insight', tint: '#005ea4', icon: lightbulb, filter: 'All' }

export const INSIGHT_FILTERS = ['All', 'Anomalies', 'Focus', 'Trends', 'Devices']

// P0.2: the context handed to the bot when a user asks about a specific insight card.
export const buildAskBotPrompt = (insight: InsightView): string => {
  const metrics = insight.chips.map(chip => `${chip.k} ${chip.v}`).join(', ')
  return `Tell me more about this insight: "${insight.title}". Context: ${insight.body}.${metrics ? ` Metrics: ${metrics}.` : ''}`
}
