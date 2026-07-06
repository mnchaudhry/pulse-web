'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { useOnboardingFlow } from './use-onboarding-flow'

type OnboardingFlowValue = ReturnType<typeof useOnboardingFlow>

const OnboardingFlowContext = createContext<OnboardingFlowValue | null>(null)

// Single shared `useOnboardingFlow()` instance (and its live extension-status
// polling) for the whole dashboard layout — both the modal and the sidebar's
// reminder pill read from here instead of each running their own poll loop.
export const OnboardingFlowProvider = ({ children }: { children: ReactNode }) => {
  const flow = useOnboardingFlow()
  return <OnboardingFlowContext.Provider value={flow}>{children}</OnboardingFlowContext.Provider>
}

export const useOnboardingFlowContext = (): OnboardingFlowValue => {
  const ctx = useContext(OnboardingFlowContext)
  if (!ctx)
    throw new Error('useOnboardingFlowContext must be used within OnboardingFlowProvider')
  return ctx
}
