import type { InsightView } from '../../insight-meta'

interface Props {
  insight: InsightView
  onAskBot: (insight: InsightView) => void
}

export const InsightCard = ({ insight, onAskBot }: Props) => {
  return (
    <div className="flex overflow-hidden rounded-[14px] border border-edge bg-surface shadow-[0_4px_16px_rgba(15,23,42,.05)] transition-colors hover:border-pulse-soft">
      <div className="w-[3px] flex-none" style={{ background: insight.tint }} />
      <div className="flex-1 p-[18px] px-5">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span className="flex" style={{ color: insight.tint }}>{insight.icon}</span>
          <span
            className="text-[10.5px] font-semibold uppercase tracking-[.08em]"
            style={{ color: insight.tint }}
          >
            {insight.tag}
          </span>
          <span className="mono ml-auto text-[11.5px] text-ink-3">{insight.time}</span>
        </div>

        <h3 className="mb-1.5 text-base font-semibold tracking-[-.2px]">{insight.title}</h3>
        <p className="mb-3.5 text-[13.5px] leading-[1.55] text-ink-2">{insight.body}</p>

        <div className="flex flex-wrap items-center gap-2">
          {insight.chips.map(chip => (
            <span
              key={chip.k}
              className="inline-flex items-center gap-[7px] rounded-[7px] border border-edge bg-chip px-[9px] py-[5px] text-[11.5px] text-ink-2"
            >
              <span>{chip.k}</span>
              <span className="mono text-ink">{chip.v}</span>
            </span>
          ))}
          <button
            type="button"
            onClick={() => onAskBot(insight)}
            className="ml-auto flex items-center gap-1.5 text-[12.5px] text-pulse transition-colors hover:text-pulse-bright"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 10h8M8 14h5M21 12a9 9 0 1 1-3.5-7.1L21 4v5h-5" />
            </svg>
            Ask the bot
          </button>
        </div>
      </div>
    </div>
  )
}
