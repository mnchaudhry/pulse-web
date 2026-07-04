import type { ReactNode } from 'react'
import { Logo } from '@/components/logo'

const TRUST_CHIPS = [
  {
    label: 'Private by default',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      </svg>
    ),
  },
  {
    label: 'No page content, ever',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <path d="M4 4l16 16" />
      </svg>
    ),
  },
  {
    label: 'Pause anytime',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    ),
  },
]

interface BrandPanelProps {
  headline: string
  description: string
  children?: ReactNode
}

// Left-hand azure gradient panel shared by /login and /signup.
export const BrandPanel = ({ headline, description, children }: BrandPanelProps) => {
  return (
    <div className="relative flex min-w-0 flex-2 flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#0477cd_0%,#005ea4_48%,#004881_100%)] p-[52px_54px] text-white max-lg:hidden">
      <svg
        width="640"
        height="200"
        viewBox="0 0 640 200"
        fill="none"
        className="pointer-events-none absolute -left-10 top-[60px] opacity-[.14]"
      >
        <path
          d="M0 120h150l24-70 40 130 34-96 20 36h372"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="900"
          className="[animation:pulseline_4s_linear_infinite]"
        />
      </svg>
      <div className="relative">
        <Logo tone="inverse" size={26} />
      </div>
      <div className="relative max-w-[460px]">
        <h2 className="mb-3.5 text-[34px] font-bold leading-[1.12] tracking-[-.8px]">{headline}</h2>
        <p className="mb-[30px] text-[15px] leading-[1.6] text-white/[.82]">{description}</p>
        {children}
      </div>
      <div className="relative flex flex-wrap gap-2.5">
        {TRUST_CHIPS.map(chip => (
          <span
            key={chip.label}
            className="inline-flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/[.12] px-[13px] py-[7px] text-xs text-white/90"
          >
            {chip.icon}
            {chip.label}
          </span>
        ))}
      </div>
    </div>
  )
}
