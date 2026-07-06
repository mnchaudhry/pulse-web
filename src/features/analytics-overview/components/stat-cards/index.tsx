import type { ReactNode } from 'react'
import type { StatCard } from '../../types'

const CARD = 'rounded-[14px] border border-edge bg-surface p-[18px] pb-4 shadow-[0_4px_16px_rgba(15,23,42,.05)]'

const icon = (paths: ReactNode) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    {paths}
  </svg>
)

// Icons keyed by stat label (the data hook supplies values, not icons).
const ICONS: Record<string, ReactNode> = {
  'Total active': icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  'Longest block': icon(<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>),
  'Top category': icon(<><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 8V5M9 13h.01M15 13h.01M9.5 16.5h5" /></>),
}

export const StatCards = ({ stats }: { stats: StatCard[] }) => {
  return (
    <div className="mb-4 grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {stats.map(stat => (
        <div key={stat.label} className={CARD}>
          <div className="mb-3.5 flex items-center gap-2 text-xs text-ink-2">
            <span className="flex" style={{ color: stat.tint }}>{ICONS[stat.label]}</span>
            {stat.label}
          </div>
          <div className="mono text-[26px] font-semibold leading-none tracking-[-.5px]">{stat.value}</div>
          <div className="mt-[9px] text-[11.5px] text-ink-2">{stat.delta}</div>
        </div>
      ))}
    </div>
  )
}
