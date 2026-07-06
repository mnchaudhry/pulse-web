'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Modal } from '@/components/modal'
import { OnboardingDisclosure } from './index'
import { useOnboardingFlowContext } from './onboarding-flow-provider'

// Onboarding shown as a modal over the dashboard. Resumability is derived
// from real account/device data (onboarding-flow.md §3) — it auto-opens
// whenever the flow isn't done, except a "connect" stage the user explicitly
// deferred ("I'll do this later" leaves a quiet reminder pill instead, see
// <ConnectReminderPill>). `?connect=1` always forces it open regardless —
// that's how the reminder pill and the extension-initiated login both
// re-enter the flow directly.
export const OnboardingModal = () => {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const flow = useOnboardingFlowContext()

  const forced = params.get('connect') === '1'
  const autoShow = flow.stage !== 'loading'
    && flow.stage !== 'done'
    && !(flow.stage === 'connect' && flow.deferred)

  if (!forced && !autoShow)
    return null

  const close = () => router.replace(pathname)

  return (
    <Modal onClose={close} ariaLabel="Get set up with Pulse">
      <OnboardingDisclosure flow={flow} onClose={close} />
    </Modal>
  )
}
