'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type ExtensionPresence = 'checking' | 'absent' | 'present' | 'timed-out'

interface ChromeRuntime {
  lastError?: unknown
  sendMessage: (id: string, message: unknown, callback: (response: unknown) => void) => void
}

const getRuntime = (): ChromeRuntime | undefined =>
  (globalThis as { chrome?: { runtime?: ChromeRuntime } }).chrome?.runtime

const POLL_INTERVAL_MS = 1000
const POLL_TIMEOUT_MS = 30_000
const PING_ACK_MS = 1200

interface PingResult { ok: boolean, authenticated: boolean, clientId: string | null }

const ping = (extensionId: string, runtime: ChromeRuntime): Promise<PingResult> =>
  new Promise((resolve) => {
    let settled = false
    const ackTimer = setTimeout(() => {
      if (!settled) {
        settled = true
        resolve({ ok: false, authenticated: false, clientId: null })
      }
    }, PING_ACK_MS)

    try {
      runtime.sendMessage(extensionId, { type: 'PING' }, (response: unknown) => {
        if (settled)
          return
        settled = true
        clearTimeout(ackTimer)
        const resp = response as { ok?: boolean, authenticated?: boolean, clientId?: string } | undefined
        if (runtime.lastError || !resp?.ok) {
          resolve({ ok: false, authenticated: false, clientId: null })
          return
        }
        resolve({ ok: true, authenticated: !!resp.authenticated, clientId: resp.clientId ?? null })
      })
    }
    catch {
      settled = true
      clearTimeout(ackTimer)
      resolve({ ok: false, authenticated: false, clientId: null })
    }
  })

// Onboarding Stage 3 (onboarding-flow.md): polls for the extension roughly
// every second for up to ~30s instead of a single check, so a slow install
// or reload during onboarding isn't missed — "Waiting for the extension…"
// until it responds or the window times out.
export const useExtensionStatus = () => {
  const [presence, setPresence] = useState<ExtensionPresence>('checking')
  const [authenticated, setAuthenticated] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const stopRef = useRef(false)

  const start = useCallback(() => {
    stopRef.current = false
    setPresence('checking')
    setAuthenticated(false)
    setClientId(null)

    const extensionId = process.env.NEXT_PUBLIC_EXTENSION_ID
    const runtime = getRuntime()
    if (!extensionId || !runtime?.sendMessage) {
      setPresence('timed-out')
      return
    }

    const deadline = Date.now() + POLL_TIMEOUT_MS

    const poll = async () => {
      if (stopRef.current)
        return
      const result = await ping(extensionId, runtime)
      if (stopRef.current)
        return

      if (result.ok) {
        setAuthenticated(result.authenticated)
        setClientId(result.clientId)
        setPresence('present')
        // Keep polling even once present: the caller may still be mid-handoff
        // (AUTH_SUCCESS in flight), and this is what notices `authenticated`
        // flip to true afterward without a manual re-check.
        if (!result.authenticated && Date.now() < deadline)
          setTimeout(() => void poll(), POLL_INTERVAL_MS)
        return
      }

      if (Date.now() >= deadline) {
        setPresence('timed-out')
        return
      }

      setTimeout(() => void poll(), POLL_INTERVAL_MS)
    }

    void poll()
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    start()
    return () => { stopRef.current = true }
  }, [start])

  return { presence, authenticated, clientId, retry: start }
}
