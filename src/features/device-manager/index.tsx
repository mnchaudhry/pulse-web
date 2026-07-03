'use client'

import type { DeviceRow as Device } from '@/lib/supabase/database.types'
import { PageContainer } from '@/components/page-container'
import { DeviceRow } from './components/device-row'
import { useDeviceManager } from './use-device-manager'

export const DeviceManager = () => {
  const { devicesQuery, rename, remove } = useDeviceManager()
  const devices = devicesQuery.data ?? []

  const onRename = (device: Device) => {
    const label = window.prompt('Rename device', device.label)?.trim()
    if (label && label !== device.label)
      rename.mutate({ id: device.id, label })
  }

  const onRemove = (device: Device) => {
    if (window.confirm(`Remove “${device.label}”? It stops contributing new data. Existing data is kept.`))
      remove.mutate(device.id)
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-[-.4px]">Devices</h1>
        <p className="mt-1.5 text-[13.5px] text-ink-2">
          Every Chrome profile and machine reporting to your account. Removing one stops it contributing new data.
        </p>
      </div>

      {devicesQuery.isLoading && (
        <div className="rounded-[14px] border border-edge bg-surface p-6 text-[13px] text-ink-3">Loading devices…</div>
      )}

      {!devicesQuery.isLoading && devices.length === 0 && (
        <div className="rounded-[14px] border border-dashed border-edge-strong bg-chip p-8 text-center text-[13px] text-ink-2">
          No devices yet. Install the Pulse extension and log in — this profile will register automatically.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {devices.map(device => (
          <DeviceRow key={device.id} device={device} onRename={onRename} onRemove={onRemove} />
        ))}
      </div>

      {devices.length > 0 && (
        <p className="mt-5 text-xs text-ink-3">
          Reinstalling the extension on a profile registers a fresh device — old and new aren’t merged.
        </p>
      )}
    </PageContainer>
  )
}
