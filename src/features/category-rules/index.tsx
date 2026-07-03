import type { Category } from '@/constants/categories'
import { CATEGORY_COLORS } from '@/constants/categories'

interface CategoryRow {
  domain: string
  cat: Category
  overridden: boolean
}

const ROWS: CategoryRow[] = [
  { domain: 'github.com', cat: 'Dev', overridden: false },
  { domain: 'localhost:3000', cat: 'Dev', overridden: true },
  { domain: 'figma.com', cat: 'Work', overridden: false },
  { domain: 'x.com', cat: 'Social', overridden: false },
  { domain: 'youtube.com', cat: 'Entertainment', overridden: true },
  { domain: 'news.ycombinator.com', cat: 'News', overridden: false },
  { domain: 'notion.so', cat: 'Work', overridden: true },
]

export const CategoryRules = () => {
  return (
    <>
      <div className="overflow-hidden rounded-[14px] border border-edge bg-surface shadow-[0_4px_16px_rgba(15,23,42,.05)]">
        <div className="flex border-b border-hairline px-5 py-[13px] text-[11px] font-semibold uppercase tracking-[.06em] text-ink-3">
          <span className="flex-1">Domain</span>
          <span className="w-[180px]">Category</span>
          <span className="w-20 text-right">Source</span>
        </div>

        {ROWS.map(row => (
          <div
            key={row.domain}
            className="flex items-center border-b border-[#eceef0] px-5 py-[13px] transition-colors last:border-b-0 hover:bg-chip"
          >
            <span className="mono flex-1 text-[13.5px]">{row.domain}</span>
            <div className="w-[180px]">
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-edge bg-chip px-[11px] py-1.5 text-[12.5px]">
                <span className="h-2 w-2 rounded-[3px]" style={{ background: CATEGORY_COLORS[row.cat] }} />
                {row.cat}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#717783" strokeWidth="2.4" className="ml-0.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </div>
            <span className="w-20 text-right text-[11px]">
              {row.overridden
                ? <span className="text-pulse">override</span>
                : <span className="text-ink-3">built-in</span>}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-3">
        Your overrides always win over the built-in map. Scope an override to a single device so the same domain can read differently per profile.
      </p>
    </>
  )
}
