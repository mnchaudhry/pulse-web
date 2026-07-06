'use client'

import type { RangeKey } from '@/utils/date-range'
import type { DomainSlice } from '../../types'
import { DomainDrilldown } from './components/domain-drilldown'
import { useTopDomainsList } from './use-top-domains-list'

export const TopDomainsList = ({ domains, range }: { domains: DomainSlice[], range: RangeKey }) => {
  const { openDomain, openDrilldown, closeDrilldown, pages, isLoading } = useTopDomainsList(range)

  return (
    <div className="mt-4 rounded-[14px] border border-edge bg-surface p-5 shadow-[0_4px_16px_rgba(15,23,42,.05)]">
      <h2 className="mb-[18px] text-sm font-semibold">Top domains</h2>
      {domains.length === 0
        ? (
            <p className="py-6 text-center text-[13px] text-ink-3">No domains tracked in this range yet.</p>
          )
        : (
            <div className="flex flex-col gap-[11px]">
              {domains.map(domain => (
                <button
                  key={domain.name}
                  type="button"
                  onClick={() => openDrilldown(domain.name)}
                  className="flex items-center gap-3.5 rounded-md text-left transition-colors hover:bg-chip"
                >
                  <span className="w-[180px] flex-none overflow-hidden text-ellipsis whitespace-nowrap text-[13px]">
                    {domain.name}
                  </span>
                  <span className="w-24 flex-none text-[11px]" style={{ color: domain.color }}>{domain.cat}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded bg-raised">
                    <div className="h-full rounded" style={{ width: `${domain.pct}%`, background: domain.color }} />
                  </div>
                  <span className="mono w-[60px] flex-none text-right text-[12.5px] text-ink-2">{domain.dur}</span>
                </button>
              ))}
            </div>
          )}

      {openDomain && (
        <DomainDrilldown
          domain={openDomain}
          pages={pages}
          isLoading={isLoading}
          onClose={closeDrilldown}
        />
      )}
    </div>
  )
}
