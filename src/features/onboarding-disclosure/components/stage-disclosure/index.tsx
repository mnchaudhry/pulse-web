'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { routes } from '@/constants/routes'
import { confirmDisclosure } from '@/services/account/confirm-disclosure'
import { primaryBtn } from '../../styles'

// Onboarding Stage 2 (onboarding-flow.md) — itemized, plain-spoken, no
// marketing language. Content must match tracking-spec §3 exactly: New Tab /
// browser internals, foreground-only (no idle guessing), subdomain excludes,
// and one-person-per-account (US-67).
const TRACKS = [
  'Domain and page title of tabs you actively use in the foreground (active tab in a focused Chrome window)',
  'New Tab and browser pages like Settings and Extensions (chrome://…) — not just third-party websites',
  'Start/end time and active seconds per visit, and which device/profile the activity came from',
  'Foreground time only — no guessing from mouse/keyboard idle; a static cursor on a long video still counts while that tab stays focused',
]

const NEVER_TRACKS = [
  'Page content or anything you type, and no screenshots',
  'Anything in an Incognito window',
  'Any excluded site — excluding chase.com also excludes all its subdomains, like secure.chase.com',
  'Background tabs — even if playing audio',
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
    <div className="border-b border-hairline px-[22px] py-5">
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
    <div className="px-[22px] py-5">
      <div className="mb-1.5 text-[12.5px] font-semibold uppercase tracking-[.04em] text-ink-3">Your account</div>
      <p className="text-[13.5px] text-ink-2">
        One Pulse account is for
        {' '}
        <strong className="text-ink">one person</strong>
        . Don't share login credentials — Combined analytics assume a single individual.
      </p>
    </div>
  </div>
)

// The parent swaps this stage out on its own once `disclosure_confirmed_at`
// lands (the mutation below invalidates the profile query that drives it).
export const StageDisclosure = () => {
  const queryClient = useQueryClient()
  const confirm = useMutation({
    mutationFn: confirmDisclosure,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  })

  return (
    <div className="w-full max-w-[520px]">
      <div className="mb-[26px] flex flex-col items-center">
        <Logo variant="mark" size={44} />
        <h1 className="mb-1.5 mt-[18px] text-[22px] font-semibold tracking-[-.3px]">What Pulse tracks</h1>
        <p className="max-w-[420px] text-center text-[13.5px] text-ink-2">
          Read this before anything starts recording.
        </p>
      </div>
      <Disclosure />
      <button
        type="button"
        onClick={() => confirm.mutate()}
        disabled={confirm.isPending}
        className={`mt-[18px] ${primaryBtn}`}
      >
        {confirm.isPending ? 'Continuing…' : 'I understand — continue'}
      </button>
      <p className="mt-3.5 text-center text-xs text-ink-3">
        Read the full
        {' '}
        <Link href={routes.privacy} className="text-pulse">privacy policy</Link>
        .
      </p>
    </div>
  )
}
