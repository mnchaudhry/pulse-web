'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { routes } from '@/constants/routes'
import { createBrowserClient } from '@/lib/supabase/browser-client'

interface ChromeRuntime {
  sendMessage: (id: string, message: unknown, callback?: (response: unknown) => void) => void
}

// US-67/US-02: on explicit confirm, hand the session to the extension via
// externally_connectable (AUTH_SUCCESS), then continue to the dashboard.
export const useOnboardingDisclosure = () => {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)

  const confirm = async () => {
    setIsConnecting(true)
    const supabase = createBrowserClient()
    const { data: { session } } = await supabase.auth.getSession()

    const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID
    const runtime = (globalThis as { chrome?: { runtime?: ChromeRuntime } }).chrome?.runtime

    if (session && extensionId && runtime?.sendMessage) {
      runtime.sendMessage(
        extensionId,
        {
          type: 'AUTH_SUCCESS',
          session: { access_token: session.access_token, refresh_token: session.refresh_token },
        },
        () => {},
      )
    }

    router.replace(routes.overview)
  }

  return { confirm, isConnecting }
}
