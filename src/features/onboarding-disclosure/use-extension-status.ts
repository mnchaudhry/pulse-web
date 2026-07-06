'use client'

import { useCallback, useEffect, useState } from 'react'

export type ExtensionStatus = 'checking' | 'not-installed' | 'not-connected' | 'connected'

interface ChromeRuntime {
  lastError?: unknown
  sendMessage: (id: string, message: unknown, callback: (response: unknown) => void) => void
}

const getRuntime = (): ChromeRuntime | undefined =>
  (globalThis as { chrome?: { runtime?: ChromeRuntime } }).chrome?.runtime

// Detects whether the Pulse extension is installed in this browser and whether
// it already holds a session — by PINGing it over externally_connectable.
export const useExtensionStatus = () => {
  const [status, setStatus] = useState<ExtensionStatus>('checking')

  const check = useCallback(() => {
    const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID
    const runtime = getRuntime()
    if (!extensionId || !runtime?.sendMessage) {
      setStatus('not-installed')
      return
    }

    setStatus('checking')
    let settled = false
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true
        setStatus('not-installed')
      }
    }, 1200)

    try {
      runtime.sendMessage(extensionId, { type: 'PING' }, (response: unknown) => {
        if (settled)
          return
        settled = true
        clearTimeout(timeout)
        const resp = response as { ok?: boolean, authenticated?: boolean } | undefined
        if (runtime.lastError || !resp?.ok) {
          setStatus('not-installed')
          return
        }
        setStatus(resp.authenticated ? 'connected' : 'not-connected')
      })
    }
    catch {
      settled = true
      clearTimeout(timeout)
      setStatus('not-installed')
    }
  }, [])

  useEffect(() => {
    // Kick off the install/connection check when the modal mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    check()
  }, [check])

  return { status, recheck: check }
}
