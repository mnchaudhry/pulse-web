export const AccountSettings = () => {
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="rounded-[14px] border border-edge bg-surface p-[22px] shadow-[0_4px_16px_rgba(15,23,42,.05)]">
        <h2 className="mb-1 text-[15px] font-semibold">Home timezone</h2>
        <p className="mb-4 text-[12.5px] text-ink-2">
          Daily and weekly boundaries use this, not each device’s system clock.
        </p>
        <div className="mono flex items-center justify-between rounded-[9px] border border-edge bg-chip px-[15px] py-[11px] text-[13.5px]">
          Asia/Karachi · GMT+5
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#717783" strokeWidth="2.4">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-[14px] border border-edge bg-surface p-[22px] shadow-[0_4px_16px_rgba(15,23,42,.05)]">
        <div className="flex-1">
          <h2 className="mb-[3px] text-[15px] font-semibold">Export your data</h2>
          <p className="text-[12.5px] text-ink-2">
            Download raw events and aggregates as JSON or CSV before you delete anything.
          </p>
        </div>
        <button
          type="button"
          className="rounded-[9px] border border-edge-strong bg-chip px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-pulse-soft"
        >
          Export
        </button>
      </div>

      <div className="flex items-center gap-4 rounded-[14px] border border-danger-edge bg-danger-bg p-[22px]">
        <div className="flex-1">
          <h2 className="mb-[3px] text-[15px] font-semibold text-danger">Delete account</h2>
          <p className="text-[12.5px] text-danger-deep">
            Permanently removes every device, event, aggregate and insight. This can’t be undone.
          </p>
        </div>
        <button
          type="button"
          className="rounded-[9px] border border-danger-soft bg-transparent px-4 py-2.5 text-[13px] font-medium text-danger transition-colors hover:bg-danger-edge"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
