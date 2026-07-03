'use client'

import { useAccountSettings } from './use-account-settings'

const timezoneOptions = (): string[] => {
  const withValues = Intl as unknown as { supportedValuesOf?: (key: string) => string[] }
  return withValues.supportedValuesOf?.('timeZone') ?? ['UTC', 'America/New_York', 'Europe/London', 'Asia/Karachi']
}

export const AccountSettings = () => {
  const { profileQuery, timezone, exportMutation, deleteMutation } = useAccountSettings()
  const currentTz = profileQuery.data?.home_timezone ?? 'UTC'

  const onDelete = () => {
    if (window.confirm('Permanently delete your account and all data? This cannot be undone.'))
      deleteMutation.mutate()
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="rounded-[14px] border border-edge bg-surface p-[22px] shadow-[0_4px_16px_rgba(15,23,42,.05)]">
        <h2 className="mb-1 text-[15px] font-semibold">Home timezone</h2>
        <p className="mb-4 text-[12.5px] text-ink-2">
          Daily and weekly boundaries use this, not each device’s system clock.
        </p>
        <select
          value={currentTz}
          disabled={profileQuery.isLoading || timezone.isPending}
          onChange={e => timezone.mutate(e.target.value)}
          className="mono w-full rounded-[9px] border border-edge bg-chip px-[15px] py-[11px] text-[13.5px] text-ink outline-none focus:border-pulse"
        >
          {timezoneOptions().map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 rounded-[14px] border border-edge bg-surface p-[22px] shadow-[0_4px_16px_rgba(15,23,42,.05)]">
        <div className="flex-1">
          <h2 className="mb-[3px] text-[15px] font-semibold">Export your data</h2>
          <p className="text-[12.5px] text-ink-2">
            Download raw events and aggregates as JSON before you delete anything.
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportMutation.mutate()}
          disabled={exportMutation.isPending}
          className="rounded-[9px] border border-edge-strong bg-chip px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-pulse-soft disabled:opacity-60"
        >
          {exportMutation.isPending ? 'Exporting…' : 'Export'}
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
          onClick={onDelete}
          disabled={deleteMutation.isPending}
          className="rounded-[9px] border border-danger-soft bg-transparent px-4 py-2.5 text-[13px] font-medium text-danger transition-colors hover:bg-danger-edge disabled:opacity-60"
        >
          {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
