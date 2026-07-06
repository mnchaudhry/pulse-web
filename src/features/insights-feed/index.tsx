'use client'

import type { InsightView } from './insight-meta'
import { useRouter } from 'next/navigation'
import { ErrorState } from '@/components/error-state'
import { PageContainer } from '@/components/page-container'
import { InsightsSkeleton } from '@/components/skeleton/insights-skeleton'
import { useDeviceFilter } from '@/features/device-filter/use-device-filter'
import { useDeviceParamSync, useInsightFilterParam } from '@/hooks/use-dashboard-params'
import { cn } from '@/utils/cn'
import { InsightCard } from './components/insight-card'
import { buildAskBotPrompt, INSIGHT_FILTERS } from './insight-meta'
import { useInsightsFeed } from './use-insights-feed'

// Filter label → the tag its insights carry.
const FILTER_TAG: Record<string, string> = {
  Anomalies: 'Anomaly',
  Focus: 'Focus',
  Trends: 'Trend',
  Devices: 'Device',
}

export const InsightsFeed = () => {
  const router = useRouter()
  useDeviceParamSync()
  const [filter, setFilter] = useInsightFilterParam()
  const { data: insights = [], isLoading, isError, refetch } = useInsightsFeed()
  const { deviceId, setDeviceId } = useDeviceFilter()

  const visible = filter === 'All'
    ? insights
    : insights.filter(i => i.tag === FILTER_TAG[filter])

  const onAskBot = (insight: InsightView) => {
    router.push(`/bot?prompt=${encodeURIComponent(buildAskBotPrompt(insight))}`)
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-[-.4px]">Insights</h1>
        <p className="mt-1.5 text-[13.5px] text-ink-2">
          Observations Pulse surfaced from your data — never verdicts.
        </p>
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

      {isError && (
        <ErrorState message="Couldn’t load insights. Check your connection and try again." onRetry={() => refetch()} />
      )}

      {isLoading && <InsightsSkeleton />}

      {!isLoading && !isError && visible.length === 0 && (
        <div className="rounded-[14px] border border-dashed border-edge-strong bg-chip p-8 text-center text-[13px] text-ink-2">
          {deviceId === 'combined'
            ? 'No insights yet. As Pulse gathers a few days of activity, observations will appear here.'
            : (
                <>
                  No insights for this device yet.
                  {' '}
                  <button
                    type="button"
                    onClick={() => setDeviceId('combined')}
                    className="font-medium text-pulse underline-offset-2 hover:underline"
                  >
                    Switch to Combined
                  </button>
                  {' '}
                  to see account-wide observations.
                </>
              )}
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] gap-3.5 max-sm:grid-cols-1">
        {visible.map(insight => (
          <InsightCard key={insight.id} insight={insight} onAskBot={onAskBot} />
        ))}
      </div>
    </PageContainer>
  )
}
