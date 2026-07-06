import type { DeviceRow as Device } from '@/lib/supabase/database.types'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

interface Props {
  device: Device
  onRename: (device: Device, label: string) => void
  onRequestRemove: (device: Device) => void
}

// Online if it synced within the last 5 minutes.
const isOnline = (lastSyncedAt: string | null) =>
  !!lastSyncedAt && Date.now() - new Date(lastSyncedAt).getTime() < 5 * 60_000

export const DeviceRow = ({ device, onRename, onRequestRemove }: Props) => {
  const [editing, setEditing] = useState(false)
  const [draftLabel, setDraftLabel] = useState(device.label)
  const online = isOnline(device.last_synced_at)
  const synced = device.last_synced_at
    ? `synced ${formatDistanceToNow(new Date(device.last_synced_at), { addSuffix: true })}`
    : 'never synced'

  const startEditing = () => {
    setDraftLabel(device.label)
    setEditing(true)
  }

  const save = () => {
    const trimmed = draftLabel.trim()
    if (trimmed && trimmed !== device.label)
      onRename(device, trimmed)
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-4 rounded-[14px] border border-edge bg-surface px-5 py-[18px] shadow-[0_4px_16px_rgba(15,23,42,.05)] transition-colors hover:border-pulse-soft">
      <div className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] border border-edge bg-chip">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B6B87" strokeWidth="1.6">
          <rect x="2" y="4" width="20" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        {editing
          ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={draftLabel}
                  onChange={e => setDraftLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      save()
                    if (e.key === 'Escape')
                      setEditing(false)
                  }}
                  className="rounded-[8px] border border-edge bg-chip px-2.5 py-1 text-[14px] font-semibold outline-none focus:border-pulse"
                />
                <button
                  type="button"
                  onClick={save}
                  className="rounded-[7px] bg-pulse px-2.5 py-1 text-[12px] font-semibold text-white transition-colors hover:bg-pulse-bright"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-[7px] border border-edge px-2.5 py-1 text-[12px] text-ink-2 transition-colors hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            )
          : (
              <div className="flex items-center gap-[9px]">
                <span className="text-[15px] font-semibold">{device.label}</span>
                {device.is_paused && (
                  <span className="rounded-[5px] border border-[rgba(178,106,0,.2)] bg-[rgba(178,106,0,.08)] px-[7px] py-0.5 text-[10px] font-semibold uppercase tracking-[.06em] text-warn">
                    Paused
                  </span>
                )}
              </div>
            )}
        <div className="mono mt-[5px] flex gap-3 text-xs text-ink-3">
          <span>{device.platform ?? 'Unknown platform'}</span>
          <span>·</span>
          <span>{device.is_paused ? 'tracking paused' : 'tracking'}</span>
        </div>
      </div>

      <div className="mono flex items-center gap-2 text-xs text-ink-2">
        <span className={`h-[7px] w-[7px] rounded-full ${online ? 'bg-good' : 'bg-ink-3'}`} />
        {synced}
      </div>

      <div className="flex gap-1.5">
        <button
          type="button"
          title="Rename"
          onClick={startEditing}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-edge text-ink-2 transition-colors hover:border-pulse-soft hover:text-ink"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          title="Remove"
          onClick={() => onRequestRemove(device)}
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
