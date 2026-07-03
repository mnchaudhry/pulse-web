'use client'

import Link from 'next/link'
import { PulseLogo } from '@/components/pulse-logo'
import { routes } from '@/constants/routes'
import { useOnboardingDisclosure } from './use-onboarding-disclosure'

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

export const OnboardingDisclosure = () => {
  const { confirm, isConnecting } = useOnboardingDisclosure()

  return (
    <div className="w-full max-w-[520px]">
      <div className="mb-[26px] flex flex-col items-center">
        <PulseLogo size={44} />
        <h1 className="mb-1.5 mt-[18px] text-[22px] font-semibold tracking-[-.3px]">Before Pulse starts</h1>
        <p className="max-w-[400px] text-center text-[13.5px] text-ink-2">
          Here is exactly what will and won’t be recorded. Nothing is captured until you confirm.
        </p>
      </div>

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

      <button
        type="button"
        onClick={confirm}
        disabled={isConnecting}
        className="mt-[18px] w-full rounded-[11px] bg-pulse p-[13px] text-sm font-semibold text-white transition-colors hover:bg-pulse-bright disabled:opacity-60"
      >
        {isConnecting ? 'Connecting…' : 'I understand — connect the extension'}
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
