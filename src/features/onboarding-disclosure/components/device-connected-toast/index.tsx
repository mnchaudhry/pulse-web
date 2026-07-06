'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Toast } from '@/components/toast'

// Onboarding Stage 5, second-device variant (onboarding-flow.md §6) — no
// tour for an account that's already toured, just a one-time toast landing
// on `?device-connected=1`.
export const DeviceConnectedToast = () => {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [dismissed, setDismissed] = useState(false)

  if (params.get('device-connected') !== '1' || dismissed)
    return null

  const dismiss = () => {
    setDismissed(true)
    router.replace(pathname)
  }

  return <Toast message="New device connected." onDismiss={dismiss} />
}
