'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { Suspense } from 'react'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { PageContainer } from '@/components/page-container'
import { OverviewSkeleton } from '@/components/skeleton/overview-skeleton'
import { Toast } from '@/components/toast'
import { routes } from '@/constants/routes'
import { DeviceConnectedToast } from '@/features/onboarding-disclosure/components/device-connected-toast'
import { ProductTour } from '@/features/product-tour'
import { useDeviceParamSync, useRangeParam } from '@/hooks/use-dashboard-params'
import { CategoryBreakdownChart } from './components/category-breakdown-chart'
import { FocusBlocks } from './components/focus-blocks'
import { FocusScoreCard } from './components/focus-score-card'
import { StatCards } from './components/stat-cards'
import { TopDomainsList } from './components/top-domains-list'
import { TrendChart } from './components/trend-chart'
import { useAnalyticsOverview } from './use-analytics-overview'
import { useFirstDataToast } from './use-first-data-toast'

export const AnalyticsOverview = () => {
  useDeviceParamSync()
  const [range] = useRangeParam()
  const { data, isLoading, isError, refetch } = useAnalyticsOverview(range)
  const firstDataToast = useFirstDataToast(data?.hasData ?? false)

  return (
    <PageContainer>
      <Suspense>
        <ProductTour />
        <DeviceConnectedToast />
      </Suspense>
      {firstDataToast.show && (
        <Toast message="Your first activity just came in." onDismiss={firstDataToast.dismiss} />
      )}
      <div className="mb-[26px]">
        <h1 className="text-2xl font-semibold tracking-[-.4px]">Overview</h1>
        <p className="mt-1.5 text-[13.5px] text-ink-2">
          {format(new Date(), 'EEEE, MMMM d')}
          {' · '}
          <span className="mono text-ink-2">where your attention went</span>
        </p>
      </div>

      {isError && (
        <ErrorState message="Couldn’t load your activity. Check your connection and try again." onRetry={() => refetch()} />
      )}

      {isLoading && !data && <OverviewSkeleton />}

      {!isLoading && !isError && data && !data.hasData && (
        <EmptyState
          icon={(
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B6B87" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          )}
          title="No activity yet"
          body="Add the Pulse extension to a Chrome profile and your activity starts showing up here automatically."
          action={(
            <Link
              href={routes.connectExtension}
              className="rounded-[10px] bg-pulse px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-pulse-bright"
            >
              Set up the extension
            </Link>
          )}
        />
      )}

      {data && data.hasData && (
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
            <FocusBlocks blocks={data.longestBlocks} range={range} />
          </div>

          <TopDomainsList domains={data.topDomains} range={range} />
        </>
      )}
    </PageContainer>
  )
}
