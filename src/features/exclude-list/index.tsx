'use client'

import { useState } from 'react'
import { useExcludeList } from './use-exclude-list'

const CARD = 'rounded-[14px] border border-edge bg-surface p-[22px] shadow-[0_4px_16px_rgba(15,23,42,.05)]'

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] text-ink-3 transition-colors hover:bg-edge hover:text-danger"
  >
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  </button>
)

export const ExcludeList = () => {
  const { accountRules, deviceRules, devices, add, remove } = useExcludeList()
  const [accountDraft, setAccountDraft] = useState('')
  const [deviceDraft, setDeviceDraft] = useState('')
  const [deviceId, setDeviceId] = useState('')

  const deviceLabel = (id: string | null) => devices.find(d => d.id === id)?.label ?? 'Unknown device'

  const addAccount = () => {
    const pattern = accountDraft.trim()
    if (!pattern)
      return
    add.mutate({ pattern, deviceId: null })
    setAccountDraft('')
  }

  const addDevice = () => {
    const pattern = deviceDraft.trim()
    const target = deviceId || devices[0]?.id
    if (!pattern || !target)
      return
    add.mutate({ pattern, deviceId: target })
    setDeviceDraft('')
  }

  return (
    <div className="flex flex-col gap-[22px]">
      <div className={CARD}>
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold">Account exclude-list</h2>
          <span className="text-[11.5px] text-ink-3">applies to every device by default</span>
        </div>
        <p className="mb-4 text-[12.5px] text-ink-2">
          Excluded domains are never captured — enforced on-device, before anything is written or synced.
        </p>

        <div className="mb-4 flex gap-2.5">
          <input
            value={accountDraft}
            onChange={e => setAccountDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addAccount()}
            placeholder="Add a domain or *.pattern"
            className="mono flex-1 rounded-[9px] border border-edge bg-chip px-[13px] py-2.5 text-[13px] text-ink outline-none focus:border-pulse"
          />
          <button
            type="button"
            onClick={addAccount}
            disabled={add.isPending}
            className="rounded-[9px] bg-pulse px-[18px] text-[13px] font-semibold text-white transition-colors hover:bg-pulse-bright disabled:opacity-60"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {accountRules.length === 0 && <span className="text-[12.5px] text-ink-3">No account exclusions yet.</span>}
          {accountRules.map(rule => (
            <span key={rule.id} className="mono inline-flex items-center gap-[9px] rounded-[8px] border border-edge bg-chip py-[7px] pl-3 pr-2 text-[12.5px]">
              {rule.pattern}
              <RemoveButton onClick={() => remove.mutate(rule.id)} />
            </span>
          ))}
        </div>
      </div>

      <div className={CARD}>
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold">Per-device overrides</h2>
          <span className="text-[11.5px] text-ink-3">layered on top of the account list</span>
        </div>
        <p className="mb-4 text-[12.5px] text-ink-2">Exclusions scoped to a single device.</p>

        {devices.length === 0
          ? (
              <span className="text-[12.5px] text-ink-3">No devices yet.</span>
            )
          : (
              <div className="mb-4 flex gap-2.5">
                <select
                  value={deviceId || devices[0]?.id}
                  onChange={e => setDeviceId(e.target.value)}
                  className="rounded-[9px] border border-edge bg-chip px-3 py-2.5 text-[13px] text-ink outline-none focus:border-pulse"
                >
                  {devices.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
                <input
                  value={deviceDraft}
                  onChange={e => setDeviceDraft(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addDevice()}
                  placeholder="Add a domain or *.pattern"
                  className="mono flex-1 rounded-[9px] border border-edge bg-chip px-[13px] py-2.5 text-[13px] text-ink outline-none focus:border-pulse"
                />
                <button
                  type="button"
                  onClick={addDevice}
                  disabled={add.isPending}
                  className="rounded-[9px] bg-pulse px-[18px] text-[13px] font-semibold text-white transition-colors hover:bg-pulse-bright disabled:opacity-60"
                >
                  Add
                </button>
              </div>
            )}

        <div className="flex flex-wrap gap-2">
          {deviceRules.length === 0 && <span className="text-[12.5px] text-ink-3">No per-device exclusions.</span>}
          {deviceRules.map(rule => (
            <span key={rule.id} className="mono inline-flex items-center gap-[9px] rounded-[8px] border border-edge-strong bg-chip py-[7px] pl-3 pr-2 text-[12.5px]">
              {rule.pattern}
              <span className="text-[10.5px] text-ink-3">{deviceLabel(rule.device_id)}</span>
              <RemoveButton onClick={() => remove.mutate(rule.id)} />
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3.5 rounded-[12px] border border-dashed border-edge-strong bg-chip px-[18px] py-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#717783" strokeWidth="1.7" className="flex-none">
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
        </svg>
        <p className="text-[12.5px] leading-[1.5] text-ink-2">
          Incognito windows are excluded by default, and no page content is ever captured — only domain, title and referrer.
        </p>
      </div>
    </div>
  )
}
