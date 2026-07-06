'use client'

import type { useOnboardingFlow } from './use-onboarding-flow'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { routes } from '@/constants/routes'
import { listDevices } from '@/services/devices/list-devices'
import { StageConnect } from './components/stage-connect'
import { StageDisclosure } from './components/stage-disclosure'
import { StageNameDevice } from './components/stage-name-device'

// Pre-fills Stage 4's label distinctly from any other device already on the
// account (onboarding-flow.md §6 — nudges a real name like "Work profile"
// instead of a silent duplicate).
const useDistinctDefaultLabel = (deviceId: string | undefined, baseLabel: string | undefined) => {
  const devicesQuery = useQuery({ queryKey: ['devices'], queryFn: listDevices })
  return useMemo(() => {
    if (!deviceId || !baseLabel)
      return ''
    const others = (devicesQuery.data ?? []).filter(d => d.id !== deviceId)
    if (!others.some(d => d.label === baseLabel))
      return baseLabel
    let n = 2
    while (others.some(d => d.label === `${baseLabel} (${n})`))
      n++
    return `${baseLabel} (${n})`
  }, [deviceId, baseLabel, devicesQuery.data])
}

interface OnboardingDisclosureProps {
  flow: ReturnType<typeof useOnboardingFlow>
  onClose?: () => void
}

// Lives inside the modal shell (onboarding-modal.tsx), which owns the single
// `useOnboardingFlow()` instance (and its live extension-status polling) so
// there's only ever one poll loop running, not one per component.
export const OnboardingDisclosure = ({ flow, onClose }: OnboardingDisclosureProps) => {
  const router = useRouter()
  const defaultLabel = useDistinctDefaultLabel(flow.device?.id, flow.device?.label)

  if (flow.stage === 'loading')
    return null

  if (flow.stage === 'done') {
    onClose?.()
    return null
  }

  if (flow.stage === 'disclosure')
    return <StageDisclosure />

  if (flow.stage === 'connect') {
    return (
      <StageConnect
        presence={flow.extensionStatus.presence}
        authenticated={flow.extensionStatus.authenticated}
        onRetry={flow.extensionStatus.retry}
        onDefer={() => {
          flow.setDeferred(true)
          onClose?.()
        }}
      />
    )
  }

  // name-device — only reached once flow.device is guaranteed non-null
  const isSecondDevice = !!flow.profile?.tour_completed_at
  return (
    <StageNameDevice
      deviceId={flow.device!.id}
      defaultLabel={defaultLabel}
      onConfirmed={() => {
        router.replace(isSecondDevice ? `${routes.overview}?device-connected=1` : `${routes.overview}?tour=1`)
      }}
    />
  )
}
