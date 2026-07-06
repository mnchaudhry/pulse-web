'use client'

import { useEffect, useState } from 'react'
import { Logo } from '@/components/logo'
import { primaryBtn } from '../../styles'
import { useOnboardingDisclosure } from '../../use-onboarding-disclosure'

const CHROME_STORE_URL = process.env.NEXT_PUBLIC_CHROME_STORE_URL

interface StageConnectProps {
  presence: 'checking' | 'absent' | 'present' | 'timed-out'
  authenticated: boolean
  onRetry: () => void
  onDefer: () => void
}

// Onboarding Stage 3 (onboarding-flow.md) — "smooth and honest are in
// tension, and honest wins": shows real waiting/polling state rather than a
// fire-and-forget success message. If the extension is already installed
// (Paths A/C), the handoff below fires within the first ~1s poll tick and
// this reads as a near-instant "Connected" — Path B just waits longer.
// The parent swaps this stage out on its own once `authenticated` flips true
// (the status hook keeps polling through the handoff for exactly that) — this
// component only owns triggering the handoff and showing the checkmark.
export const StageConnect = ({ presence, authenticated, onRetry, onDefer }: StageConnectProps) => {
  const { connect } = useOnboardingDisclosure()
  const [handoff, setHandoff] = useState<'idle' | 'connecting' | 'connected'>('idle')

  useEffect(() => {
    if (presence !== 'present' || handoff !== 'idle')
      return
    if (authenticated) {
      setHandoff('connected')
      return
    }
    setHandoff('connecting')
    void connect().then(ok => setHandoff(ok ? 'connected' : 'idle'))
  }, [presence, authenticated, handoff, connect])

  if (handoff === 'connected' || authenticated) {
    return (
      <div className="flex w-full max-w-[520px] flex-col items-center py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(14,124,134,.3)] bg-[rgba(14,124,134,.12)]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" strokeWidth="2.2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mb-1.5 mt-4 text-[20px] font-semibold tracking-[-.3px]">Connected</h1>
        <p className="text-[13.5px] text-ink-2">Taking you to the next step…</p>
      </div>
    )
  }

  if (presence === 'timed-out') {
    return (
      <div className="w-full max-w-[520px] flex-col items-center text-center">
        <Logo variant="mark" size={40} />
        <h1 className="mb-1.5 mt-4 text-[18px] font-semibold tracking-[-.3px]">Still not seeing it — that's okay</h1>
        <p className="mb-5 text-[13.5px] text-ink-2">
          Make sure the extension is installed on this Chrome profile, then try again.
        </p>
        <div className="flex flex-col gap-2.5">
          <button type="button" onClick={onRetry} className={primaryBtn}>Try again</button>
          <button type="button" onClick={onDefer} className="text-[13px] font-semibold text-ink-2 transition-colors hover:text-ink">
            I'll do this later
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[520px] flex-col items-center text-center">
      <Logo variant="mark" size={40} />
      <h1 className="mb-1.5 mt-4 text-[18px] font-semibold tracking-[-.3px]">Connect this browser</h1>
      <p className="mb-5 text-[13.5px] text-ink-2">
        Each Chrome profile is its own device — install once here and it connects automatically.
      </p>
      {CHROME_STORE_URL && (
        <a href={CHROME_STORE_URL} target="_blank" rel="noreferrer" className={`mb-4 inline-block text-center ${primaryBtn}`}>
          Add to Chrome
        </a>
      )}
      <p className="flex items-center justify-center gap-2 text-[13px] text-ink-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-pulse" />
        {handoff === 'connecting' ? 'Connecting…' : 'Waiting for the extension…'}
      </p>
    </div>
  )
}
