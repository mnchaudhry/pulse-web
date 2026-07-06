import type { RangeKey } from '@/utils/date-range'
import type { FocusBlock } from '../../types'

const RANGE_LABEL: Record<RangeKey, string> = {
  Today: 'today',
  Week: 'this week',
  Month: 'this month',
}

export const FocusBlocks = ({ blocks, range }: { blocks: FocusBlock[], range: RangeKey }) => {
  return (
    <div className="rounded-[14px] border border-edge bg-surface p-5 shadow-[0_4px_16px_rgba(15,23,42,.05)]">
      <h2 className="mb-4 text-sm font-semibold">
        Longest focus blocks
        {' '}
        {RANGE_LABEL[range]}
      </h2>
      {blocks.length === 0
        ? (
            <p className="py-6 text-center text-[13px] text-ink-3">No focus blocks yet.</p>
          )
        : (
            <div className="flex flex-col gap-3.5">
              {blocks.map(block => (
                <div key={`${block.label}-${block.range}`} className="flex items-center gap-3">
                  <span className="h-2 w-2 flex-none rounded-full" style={{ background: block.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] text-ink">{block.label}</div>
                    <div className="mono mt-0.5 text-[11px] text-ink-3">{block.range}</div>
                  </div>
                  <span className="mono text-sm text-ink-2">{block.dur}</span>
                </div>
              ))}
            </div>
          )}
    </div>
  )
}
