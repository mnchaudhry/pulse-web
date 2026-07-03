import type { Device } from '../../device.data'

export const DeviceRow = ({ device }: { device: Device }) => {
  return (
    <div className="flex items-center gap-4 rounded-[14px] border border-edge bg-surface px-5 py-[18px] shadow-[0_4px_16px_rgba(15,23,42,.05)] transition-colors hover:border-pulse-soft">
      <div className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] border border-edge bg-chip">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B6B87" strokeWidth="1.6">
          <rect x="2" y="4" width="20" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-[9px]">
          <span className="text-[15px] font-semibold">{device.name}</span>
          {device.current && (
            <span className="rounded-[5px] border border-[rgba(0,94,164,.16)] bg-[rgba(0,94,164,.08)] px-[7px] py-0.5 text-[10px] font-semibold uppercase tracking-[.06em] text-pulse">
              This device
            </span>
          )}
        </div>
        <div className="mono mt-[5px] flex gap-3 text-xs text-ink-3">
          <span>{device.platform}</span>
          <span>·</span>
          <span>{device.active}</span>
          <span>·</span>
          <span>{device.excl}</span>
        </div>
      </div>

      <div className="mono flex items-center gap-2 text-xs text-ink-2">
        <span className={`h-[7px] w-[7px] rounded-full ${device.online ? 'bg-good' : 'bg-ink-3'}`} />
        {device.synced}
      </div>

      <div className="flex gap-1.5">
        <button
          type="button"
          title="Rename"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-edge text-ink-2 transition-colors hover:border-pulse-soft hover:text-ink"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          title="Remove"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-edge text-ink-2 transition-colors hover:border-danger-edge hover:text-danger"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
          </svg>
        </button>
      </div>
    </div>
  )
}
