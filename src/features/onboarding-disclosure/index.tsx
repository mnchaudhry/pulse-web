'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/logo'
import { routes } from '@/constants/routes'
import { useExtensionStatus } from './use-extension-status'
import { useOnboardingDisclosure } from './use-onboarding-disclosure'

const CHROME_STORE_URL = process.env.NEXT_PUBLIC_CHROME_STORE_URL

const TRACKS = [
  'The domain and page title of each tab you actively use',
  'The referrer domain — where a visit came from',
  'Start and end time, and active (focused) seconds per visit',
  'Which device/profile the activity came from',
]

const NEVER_TRACKS = [
  'Page content, article text, or anything you type',
  'Screenshots or images of your screen',
  'Anything in an Incognito window',
  'Any site on your exclude-list — it never leaves your machine',
]

const Disclosure = () => (
  <div className="rounded-2xl border border-edge bg-surface p-1.5 shadow-[0_8px_28px_rgba(15,23,42,.07)]">
    <div className="border-b border-hairline px-[22px] py-5">
      <div className="mb-3.5 flex items-center gap-[9px]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" strokeWidth="2">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <span className="text-[12.5px] font-semibold uppercase tracking-[.04em] text-good">Pulse will track</span>
      </div>
      <div className="flex flex-col gap-[11px]">
        {TRACKS.map(item => (
          <div key={item} className="flex gap-[11px] text-[13.5px] text-ink-2">
            <span className="flex-none text-good">·</span>
            {item}
          </div>
        ))}
      </div>
    </div>
    <div className="px-[22px] py-5">
      <div className="mb-3.5 flex items-center gap-[9px]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ba1a1a" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M6 18 18 6" />
        </svg>
        <span className="text-[12.5px] font-semibold uppercase tracking-[.04em] text-danger">Pulse will never track</span>
      </div>
      <div className="flex flex-col gap-[11px]">
        {NEVER_TRACKS.map(item => (
          <div key={item} className="flex gap-[11px] text-[13.5px] text-ink-2">
            <span className="flex-none text-danger">·</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
)

const Header = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-[26px] flex flex-col items-center">
    <Logo variant="mark" size={44} />
    <h1 className="mb-1.5 mt-[18px] text-[22px] font-semibold tracking-[-.3px]">{title}</h1>
    <p className="max-w-[420px] text-center text-[13.5px] text-ink-2">{subtitle}</p>
  </div>
)

const primaryBtn = 'w-full rounded-[11px] bg-pulse p-[13px] text-sm font-semibold text-white transition-colors hover:bg-pulse-bright disabled:opacity-60'

export const OnboardingDisclosure = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter()
  const { status, recheck } = useExtensionStatus()
  const { connect, isConnecting } = useOnboardingDisclosure()
  const [justConnected, setJustConnected] = useState(false)

  // Already connected on arrival → nothing to do; close the modal.
  useEffect(() => {
    if (status === 'connected' && !justConnected)
      onClose?.()
  }, [status, justConnected, onClose])

  // After a successful connect, head to the dashboard with the tour flagged on.
  useEffect(() => {
    if (!justConnected)
      return
    const timer = setTimeout(() => router.replace(`${routes.overview}?tour=1`), 1400)
    return () => clearTimeout(timer)
  }, [justConnected, router])

  const handleConnect = async () => {
    if (await connect())
      setJustConnected(true)
  }

  // --- success ---
  if (justConnected) {
    return (
      <div className="flex w-full max-w-[520px] flex-col items-center py-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(14,124,134,.3)] bg-[rgba(14,124,134,.12)]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0E7C86" strokeWidth="2.2">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mb-1.5 mt-4 text-[20px] font-semibold tracking-[-.3px]">Extension connected</h1>
        <p className="text-[13.5px] text-ink-2">Taking you to your dashboard…</p>
      </div>
    )
  }

  // --- checking ---
  if (status === 'checking') {
    return (
      <div className="flex w-full max-w-[520px] flex-col items-center py-10 text-center">
        <Logo variant="mark" size={40} />
        <p className="mt-4 text-[13.5px] text-ink-2">Looking for the Pulse extension…</p>
      </div>
    )
  }

  // --- already connected (closing) ---
  if (status === 'connected')
    return null

  // --- installed but not connected ---
  if (status === 'not-connected') {
    return (
      <div className="w-full max-w-[520px]">
        <Header title="Connect this browser" subtitle="The Pulse extension is installed here. Review what it records, then connect it to your account." />
        <Disclosure />
        <button type="button" onClick={handleConnect} disabled={isConnecting} className={`mt-[18px] ${primaryBtn}`}>
          {isConnecting ? 'Connecting…' : 'Connect the extension'}
        </button>
        <p className="mt-3.5 text-center text-xs text-ink-3">
          You can pause tracking or exclude any site at any time. Read the full
          {' '}
          <Link href={routes.privacy} className="text-pulse">privacy policy</Link>
          .
        </p>
      </div>
    )
  }

  // --- not installed ---
  return (
    <div className="w-full max-w-[520px]">
      <Header title="Add Pulse to Chrome" subtitle="Install the extension on this Chrome profile — each profile is its own device. Then it connects automatically." />
      <div className="mb-4 flex flex-col items-center gap-3">
        {CHROME_STORE_URL
          ? (
              <a href={CHROME_STORE_URL} target="_blank" rel="noreferrer" className={`text-center ${primaryBtn}`}>
                Add to Chrome
              </a>
            )
          : (
              <div className="w-full rounded-[11px] border border-dashed border-edge-strong bg-chip p-[13px] text-center text-[13px] text-ink-2">
                Coming to the Chrome Web Store — for now, load the extension unpacked.
              </div>
            )}
        <button type="button" onClick={recheck} className="text-[13px] font-semibold text-pulse hover:text-pulse-bright">
          I’ve installed it — check again
        </button>
      </div>
      <Disclosure />
      <p className="mt-3.5 text-center text-xs text-ink-3">
        Read the full
        {' '}
        <Link href={routes.privacy} className="text-pulse">privacy policy</Link>
        .
      </p>
    </div>
  )
}
