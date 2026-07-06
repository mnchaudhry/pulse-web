'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/browser-client'

interface ChromeRuntime {
  sendMessage: (id: string, message: unknown, callback: (response: unknown) => void) => void
}

// US-67/US-02: hand the current session to the extension via
// externally_connectable (AUTH_SUCCESS). Resolves true once the extension acks.
export const useOnboardingDisclosure = () => {
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = async (): Promise<boolean> => {
    setIsConnecting(true)
    const supabase = createBrowserClient()
    const { data: { session } } = await supabase.auth.getSession()

    const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID
    const runtime = (globalThis as { chrome?: { runtime?: ChromeRuntime } }).chrome?.runtime

    if (!session || !extensionId || !runtime?.sendMessage) {
      setIsConnecting(false)
      return false
    }

    return new Promise<boolean>((resolve) => {
      const done = (ok: boolean) => {
        setIsConnecting(false)
        resolve(ok)
      }
      const timeout = setTimeout(() => done(false), 2500)
      runtime.sendMessage(
        extensionId,
        {
          type: 'AUTH_SUCCESS',
          session: { access_token: session.access_token, refresh_token: session.refresh_token },
        },
        (response: unknown) => {
          clearTimeout(timeout)
          done(!!(response as { ok?: boolean } | undefined)?.ok)
        },
      )
    })
  }

  return { connect, isConnecting }
}
