import { Suspense } from 'react'
import { InsightsFeed } from '@/features/insights-feed'

const InsightsPage = () => {
  return (
    <Suspense>
      <InsightsFeed />
    </Suspense>
  )
}

export default InsightsPage
