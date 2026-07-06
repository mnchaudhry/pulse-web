'use client'

import Link from 'next/link'
import { routes } from '@/constants/routes'
import { useOnboardingFlowContext } from '../../onboarding-flow-provider'

// Persistent but quiet — a small pill, not a modal that reopens itself
// (onboarding-flow.md Stage 3 "I'll do this later" path). Clicking it
// reopens Stage 3 directly via `?connect=1`, which forces the modal open
// regardless of the deferred flag.
export const ConnectReminderPill = () => {
  const flow = useOnboardingFlowContext()

  if (flow.stage !== 'connect' || !flow.deferred)
    return null

  return (
    <Link
      href={routes.connectExtension}
      className="mx-0.5 mb-1 flex items-center gap-2 rounded-[9px] border border-dashed border-edge-strong bg-chip px-2.5 py-2 text-[11.5px] text-ink-2 transition-colors hover:border-pulse hover:text-ink"
    >
      <span className="h-[7px] w-[7px] flex-none rounded-full bg-danger" />
      Extension not connected — nothing will be tracked yet.
    </Link>
  )
}
