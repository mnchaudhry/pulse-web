import { trend } from '../../overview.data'

const W = 640
const H = 200
const PAD = 14

const x = (i: number) => (i / (trend.week.length - 1)) * W
const y = (v: number) => H - PAD - (v / trend.max) * (H - PAD * 2)

const toPath = (values: number[]) =>
  values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')

const linePath = toPath(trend.week)
const prevPath = toPath(trend.prev)
const areaPath = `${linePath} L${W} ${H} L0 ${H} Z`

export const TrendChart = () => {
  return (
    <div className="rounded-[14px] border border-edge bg-surface p-5 shadow-[0_4px_16px_rgba(15,23,42,.05)]">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Active time · last 7 days</h2>
        <div className="flex gap-3.5 text-[11px] text-ink-3">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 rounded-[2px] bg-pulse" />
            this week
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 rounded-[2px] bg-[#b9c7df]" />
            prev
          </span>
        </div>
      </div>

      <svg width="100%" viewBox="0 0 640 200" preserveAspectRatio="none" className="mt-2 block">
        <line x1="0" y1="40" x2="640" y2="40" stroke="#eceef0" strokeWidth="1" />
        <line x1="0" y1="90" x2="640" y2="90" stroke="#eceef0" strokeWidth="1" />
        <line x1="0" y1="140" x2="640" y2="140" stroke="#eceef0" strokeWidth="1" />
        <path d={prevPath} fill="none" stroke="#b9c7df" strokeWidth="2" strokeDasharray="4 4" />
        <path d={areaPath} fill="url(#pulse-trend)" />
        <path d={linePath} fill="none" stroke="#005ea4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="pulse-trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#005ea4" stopOpacity=".18" />
            <stop offset="1" stopColor="#005ea4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mono mt-2.5 flex justify-between text-[11px] text-ink-3">
        {trend.days.map(day => <span key={day}>{day}</span>)}
      </div>
    </div>
  )
}
