'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(15_23_42/0.45)] p-6 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-edge bg-base p-7 shadow-[0_24px_60px_rgba(0,40,80,.25)]"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-chip hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <OnboardingDisclosure flow={flow} onClose={close} />
      </div>
    </div>
  )
}
