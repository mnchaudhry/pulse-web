import { categories, totalActive } from '../../overview.data'

export const CategoryBreakdownChart = () => {
  return (
    <div className="rounded-[14px] border border-edge bg-surface p-5 shadow-[0_4px_16px_rgba(15,23,42,.05)]">
      <div className="mb-[18px] flex items-center justify-between">
        <h2 className="text-sm font-semibold">Time by category</h2>
        <span className="mono text-xs text-ink-3">
          {totalActive}
          {' '}
          total
        </span>
      </div>

      <div className="mb-5 flex h-3 gap-0.5 overflow-hidden rounded-md">
        {categories.map(cat => (
          <div key={cat.name} style={{ width: `${cat.pct}%`, background: cat.color }} />
        ))}
      </div>

      <div className="flex flex-col gap-0.5">
        {categories.map(cat => (
          <div key={cat.name} className="flex items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-tint">
            <span className="h-[9px] w-[9px] flex-none rounded-[3px]" style={{ background: cat.color }} />
            <span className="flex-1 text-[13.5px]">{cat.name}</span>
            <span className="mono w-11 text-right text-xs text-ink-3">
              {cat.pct}
              %
            </span>
            <span className="mono w-[66px] text-right text-[13px] text-ink-2">{cat.dur}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
