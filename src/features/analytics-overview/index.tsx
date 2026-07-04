'use client'

import { format } from 'date-fns'
import { Suspense, useState } from 'react'
import { DeviceScopeSelector } from '@/components/device-scope-selector'
import { PageContainer } from '@/components/page-container'
import { ProductTour } from '@/features/product-tour'
import type { RangeKey } from '@/utils/date-range'
import { cn } from '@/utils/cn'
import { CategoryBreakdownChart } from './components/category-breakdown-chart'
import { FocusBlocks } from './components/focus-blocks'
import { FocusScoreCard } from './components/focus-score-card'
import { StatCards } from './components/stat-cards'
import { TopDomainsList } from './components/top-domains-list'
import { TrendChart } from './components/trend-chart'
import { useAnalyticsOverview } from './use-analytics-overview'

const RANGES: RangeKey[] = ['Today', 'Week', 'Month']

export const AnalyticsOverview = () => {
  const [range, setRange] = useState<RangeKey>('Today')
  const { data, isLoading, isError } = useAnalyticsOverview(range)

  return (
    <PageContainer>
      <Suspense>
        <ProductTour />
      </Suspense>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-.4px]">Overview</h1>
          <p className="mt-1.5 text-[13.5px] text-ink-2">
            {format(new Date(), 'EEEE, MMMM d')}
            {' · '}
            <span className="mono text-ink-2">where your attention went</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div data-tour="range" className="flex rounded-[10px] border border-edge bg-surface p-[3px]">
            {RANGES.map((r) => {
              const active = r === range
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={cn(
                    'rounded-lg px-3.5 py-[7px] text-[12.5px] font-medium transition-colors',
                    active ? 'bg-pulse font-semibold text-white' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  {r}
                </button>
              )
            })}
          </div>
          <span data-tour="scope">
            <DeviceScopeSelector />
          </span>
        </div>
      </div>

      {isError && (
        <div className="rounded-[14px] border border-danger-edge bg-danger-bg p-6 text-[13px] text-danger-deep">
          Couldn’t load your activity. Check your connection and try again.
        </div>
      )}

      {isLoading && !data && (
        <div className="flex h-[320px] items-center justify-center rounded-[14px] border border-edge bg-surface text-[13px] text-ink-3">
          Loading your day…
        </div>
      )}

      {data && (
        <>
          <div data-tour="stats">
            <StatCards stats={data.stats} />
          </div>

          <div className="mb-4 grid grid-cols-[1.55fr_1fr] gap-4 max-lg:grid-cols-1">
            <CategoryBreakdownChart categories={data.categories} totalActive={data.totalActive} />
            <FocusScoreCard score={data.focusScore} average={data.focusAverage} />
          </div>

          <div className="grid grid-cols-[1.55fr_1fr] gap-4 max-lg:grid-cols-1">
            <TrendChart trend={data.trend} />
            <FocusBlocks blocks={data.longestBlocks} />
          </div>

          <TopDomainsList domains={data.topDomains} />
        </>
      )}
    </PageContainer>
  )
}
