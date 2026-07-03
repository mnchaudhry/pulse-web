'use client'

import { useState } from 'react'
import { DeviceScopeSelector } from '@/components/device-scope-selector'
import { PageContainer } from '@/components/page-container'
import { cn } from '@/utils/cn'
import { InsightCard } from './components/insight-card'
import { INSIGHT_FILTERS } from './insight-meta'
import { useInsightsFeed } from './use-insights-feed'

// Filter label → the tag its insights carry.
const FILTER_TAG: Record<string, string> = {
  Anomalies: 'Anomaly',
  Focus: 'Focus',
  Trends: 'Trend',
  Devices: 'Device',
}

export const InsightsFeed = () => {
  const [filter, setFilter] = useState('All')
  const { data: insights = [], isLoading } = useInsightsFeed()

  const visible = filter === 'All'
    ? insights
    : insights.filter(i => i.tag === FILTER_TAG[filter])

  return (
    <PageContainer>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-.4px]">Insights</h1>
          <p className="mt-1.5 text-[13.5px] text-ink-2">
            Observations Pulse surfaced from your data — never verdicts.
          </p>
        </div>
        <DeviceScopeSelector />
      </div>

      <div className="mb-[22px] flex gap-2">
        {INSIGHT_FILTERS.map((f) => {
          const active = f === filter
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-[8px] border px-3.5 py-2 text-[12.5px] font-medium transition-colors',
                active
                  ? 'border-pulse bg-pulse text-white'
                  : 'border-edge bg-surface text-ink-2 hover:border-pulse-soft hover:text-ink',
              )}
            >
              {f}
            </button>
          )
        })}
      </div>

      {isLoading && (
        <div className="rounded-[14px] border border-edge bg-surface p-6 text-[13px] text-ink-3">Loading insights…</div>
      )}

      {!isLoading && visible.length === 0 && (
        <div className="rounded-[14px] border border-dashed border-edge-strong bg-chip p-8 text-center text-[13px] text-ink-2">
          No insights yet. As Pulse gathers a few days of activity, observations will appear here.
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] gap-3.5 max-sm:grid-cols-1">
        {visible.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </PageContainer>
  )
}
