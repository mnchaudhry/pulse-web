import Link from 'next/link'
import { useState } from 'react'

const RADIUS = 70
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface Props {
  score: number
  average: number
}

export const FocusScoreCard = ({ score, average }: Props) => {
  const [showExplainer, setShowExplainer] = useState(false)
  const offset = CIRCUMFERENCE * (1 - score / 100)

  return (
    <div className="flex flex-col rounded-[14px] border border-edge bg-surface p-5 shadow-[0_4px_16px_rgba(15,23,42,.05)]">
      <div className="mb-1 flex items-center gap-1.5">
        <h2 className="text-sm font-semibold">Focus score</h2>
        <button
          type="button"
          onClick={() => setShowExplainer(v => !v)}
          aria-expanded={showExplainer}
          aria-label="How is the focus score calculated?"
          className="flex text-ink-3 transition-colors hover:text-pulse"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-5M12 8h.01" />
          </svg>
        </button>
      </div>
      <p className="text-[11.5px] text-ink-3">% in Work &amp; Dev during work hours</p>

      {showExplainer && (
        <div className="mt-2.5 rounded-[10px] border border-edge bg-chip p-3 text-[12px] leading-normal text-ink-2">
          <p>
            Your focus score is the percentage of active time spent in
            {' '}
            <strong className="text-ink">Work</strong>
            {' '}
            or
            {' '}
            <strong className="text-ink">Dev</strong>
            {' '}
            during
            {' '}
            <strong className="text-ink">work hours (9am–6pm)</strong>
            {' '}
            in your local timezone.
          </p>
          <p className="mt-1.5">
            Only categories you mark as Work or Dev count.
            {' '}
            <Link href="/settings/categories" className="font-medium text-pulse hover:underline">
              Change categories in Settings
            </Link>
            .
          </p>
        </div>
      )}

      <div className="flex flex-1 items-center justify-center py-3.5">
        <div className="relative h-[168px] w-[168px]">
          <svg width="168" height="168" viewBox="0 0 168 168">
            <circle cx="84" cy="84" r={RADIUS} fill="none" stroke="#e6e8ea" strokeWidth="12" />
            <circle
              cx="84"
              cy="84"
              r={RADIUS}
              fill="none"
              stroke="#005ea4"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 84 84)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="mono text-[38px] font-semibold tracking-[-1px]">{score}</span>
            <span className="mt-0.5 text-[11px] text-ink-3">of 100</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-ink-2">
        Your 7-day average is
        {' '}
        <span className="mono text-ink-2">{average}</span>
      </div>
    </div>
  )
}
