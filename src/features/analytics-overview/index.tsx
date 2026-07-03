'use client'

import { useState } from 'react'
import { DeviceScopeSelector } from '@/components/device-scope-selector'
import { PageContainer } from '@/components/page-container'
import { cn } from '@/utils/cn'
import { CategoryBreakdownChart } from './components/category-breakdown-chart'
import { FocusBlocks } from './components/focus-blocks'
import { FocusScoreCard } from './components/focus-score-card'
import { StatCards } from './components/stat-cards'
import { TopDomainsList } from './components/top-domains-list'
import { TrendChart } from './components/trend-chart'
import type { Range } from './overview.data'
import { ranges } from './overview.data'

export const AnalyticsOverview = () => {
  const [range, setRange] = useState<Range>('Today')

  return (
    <PageContainer>
      <div className="mb-[26px] flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-.4px]">Overview</h1>
          <p className="mt-1.5 text-[13.5px] text-ink-2">
            Tuesday, July 2 ·
            {' '}
            <span className="mono text-ink-2">where your attention went today</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex rounded-[10px] border border-edge bg-surface p-[3px]">
            {ranges.map((r) => {
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
          <DeviceScopeSelector />
        </div>
      </div>

      <StatCards />

      <div className="mb-4 grid grid-cols-[1.55fr_1fr] gap-4 max-lg:grid-cols-1">
        <CategoryBreakdownChart />
        <FocusScoreCard />
      </div>

      <div className="grid grid-cols-[1.55fr_1fr] gap-4 max-lg:grid-cols-1">
        <TrendChart />
        <FocusBlocks />
      </div>

      <TopDomainsList />
    </PageContainer>
  )
}
