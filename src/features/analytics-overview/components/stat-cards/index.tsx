import { stats } from '../../overview.data'

const CARD = 'rounded-[14px] border border-edge bg-surface p-[18px] pb-4 shadow-[0_4px_16px_rgba(15,23,42,.05)]'

export const StatCards = () => {
  return (
    <div className="mb-4 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {stats.map(stat => (
        <div key={stat.label} className={CARD}>
          <div className="mb-3.5 flex items-center gap-2 text-xs text-ink-2">
            <span className="flex" style={{ color: stat.tint }}>{stat.icon}</span>
            {stat.label}
          </div>
          <div className="mono text-[26px] font-semibold leading-none tracking-[-.5px]">{stat.value}</div>
          <div className="mt-[9px] text-[11.5px] text-ink-2">{stat.delta}</div>
        </div>
      ))}
    </div>
  )
}
