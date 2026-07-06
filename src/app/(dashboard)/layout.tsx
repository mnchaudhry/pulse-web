import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Providers } from '@/app/providers'
import { OnboardingFlowProvider } from '@/features/onboarding-disclosure/onboarding-flow-provider'
import { OnboardingModal } from '@/features/onboarding-disclosure/onboarding-modal'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <OnboardingFlowProvider>
        <div className="flex min-h-screen w-full bg-surface">
          <AppSidebar />
          <main className="flex min-w-0 flex-1 flex-col">{children}</main>
        </div>
        <Suspense>
          <OnboardingModal />
        </Suspense>
      </OnboardingFlowProvider>
    </Providers>
  )
}

export default DashboardLayout
