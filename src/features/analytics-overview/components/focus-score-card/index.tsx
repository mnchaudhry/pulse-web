const RADIUS = 70
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface Props {
  score: number
  average: number
}

export const FocusScoreCard = ({ score, average }: Props) => {
  const offset = CIRCUMFERENCE * (1 - score / 100)

  return (
    <div className="flex flex-col rounded-[14px] border border-edge bg-surface p-5 shadow-[0_4px_16px_rgba(15,23,42,.05)]">
      <h2 className="mb-1 text-sm font-semibold">Focus score</h2>
      <p className="text-[11.5px] text-ink-3">% in Work &amp; Dev during work hours</p>

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
