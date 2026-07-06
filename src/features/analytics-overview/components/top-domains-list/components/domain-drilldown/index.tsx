import type { PageSlice } from '../../../../types'

interface DomainDrilldownProps {
  domain: string
  pages: PageSlice[]
  isLoading: boolean
  onClose: () => void
}

// Page-level breakdown within one domain (US-40, tracking-spec §6.4) — same
// overlay pattern as the onboarding modal (fixed backdrop, no portal library).
export const DomainDrilldown = ({ domain, pages, isLoading, onClose }: DomainDrilldownProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(15_23_42/0.45)] p-6 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="relative max-h-[80vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-edge bg-base p-7 shadow-[0_24px_60px_rgba(0,40,80,.25)]"
      onClick={e => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-chip hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <h2 className="mb-1 text-[15px] font-semibold">{domain}</h2>
      <p className="mb-5 text-[12.5px] text-ink-2">Pages you were on within this site.</p>

      {isLoading && <p className="py-6 text-center text-[13px] text-ink-3">Loading…</p>}

      {!isLoading && pages.length === 0 && (
        <p className="py-6 text-center text-[13px] text-ink-3">No page-level detail for this range.</p>
      )}

      {!isLoading && pages.length > 0 && (
        <div className="flex flex-col gap-[11px]">
          {pages.map(page => (
            <div key={page.url} className="flex items-center gap-3.5">
              <div className="w-[280px] flex-none overflow-hidden">
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px]">{page.title || page.url}</p>
                <p className="mono overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-ink-3">{page.url}</p>
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded bg-raised">
                <div className="h-full rounded bg-pulse" style={{ width: `${page.pct}%` }} />
              </div>
              <span className="mono w-[60px] flex-none text-right text-[12.5px] text-ink-2">{page.dur}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)
