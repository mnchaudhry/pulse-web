'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { OnboardingDisclosure } from './index'

// Onboarding shown as a modal over the dashboard, controlled by ?connect=1.
// Cleaner than a standalone route — it overlays in context and closing just
// drops the query param.
export const OnboardingModal = () => {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  if (params.get('connect') !== '1')
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
        <OnboardingDisclosure />
      </div>
    </div>
  )
}
