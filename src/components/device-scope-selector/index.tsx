// Scope pill shown on Overview & Insights — blends devices or narrows to one.
// Presentational for now; wiring to the device-filter store lands with US-42.
export const DeviceScopeSelector = ({ scope = 'Combined' }: { scope?: string }) => {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-[10px] border border-edge bg-surface px-[13px] py-[9px] text-[13px] text-ink transition-colors hover:border-pulse-soft"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-pulse" />
      {scope}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#717783" strokeWidth="2.4">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  )
}
