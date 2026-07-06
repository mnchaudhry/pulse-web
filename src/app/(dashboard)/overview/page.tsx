import { Suspense } from 'react'
import { AnalyticsOverview } from '@/features/analytics-overview'

const OverviewPage = () => {
  return (
    <Suspense>
      <AnalyticsOverview />
    </Suspense>
  )
}

export default OverviewPage
