'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getProfile } from '@/services/account/get-profile'
import { getDeviceByClientId } from '@/services/devices/get-device-by-client-id'
import { useExtensionStatus } from './use-extension-status'

export type OnboardingStage = 'loading' | 'disclosure' | 'connect' | 'name-device' | 'done'

const DEFERRED_KEY = 'pulse:connect-deferred'

// "I'll do this later" (Stage 3) is per-browser UX chrome, not account
// history — unlike disclosure/tour state, it deliberately lives in
// localStorage (onboarding-flow.md §5).
export const isConnectDeferred = (): boolean =>
  typeof window !== 'undefined' && localStorage.getItem(DEFERRED_KEY) === '1'

const persistDeferred = (value: boolean): void => {
  if (typeof window === 'undefined')
    return
  if (value)
    localStorage.setItem(DEFERRED_KEY, '1')
  else
    localStorage.removeItem(DEFERRED_KEY)
}

// Onboarding resumability derived from real account/device data, not a
// separate wizard-state flag (onboarding-flow.md §3):
// no disclosure → Stage 2; disclosure confirmed + not connected → Stage 3;
// connected + device unnamed → Stage 4; otherwise done (the tour, Stage 5,
// is handled separately by <ProductTour> once the modal is out of the way).
export const useOnboardingFlow = () => {
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getProfile })
  const extensionStatus = useExtensionStatus()
  const [deferred, setDeferredState] = useState(isConnectDeferred)

  const deviceQuery = useQuery({
    queryKey: ['device-by-client', extensionStatus.clientId],
    queryFn: () => getDeviceByClientId(extensionStatus.clientId!),
    enabled: extensionStatus.clientId !== null,
  })

  const profile = profileQuery.data

  let stage: OnboardingStage = 'loading'
  if (profile) {
    if (!profile.disclosure_confirmed_at)
      stage = 'disclosure'
    else if (!extensionStatus.authenticated)
      stage = 'connect'
    else if (deviceQuery.data && !deviceQuery.data.renamed)
      stage = 'name-device'
    else
      stage = 'done'
  }

  const setDeferred = (value: boolean) => {
    persistDeferred(value)
    setDeferredState(value)
  }

  return {
    stage,
    deferred,
    setDeferred,
    profile,
    device: deviceQuery.data ?? null,
    extensionStatus,
  }
}
