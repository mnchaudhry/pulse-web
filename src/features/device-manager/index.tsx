'use client'

import type { DeviceRow as Device } from '@/lib/supabase/database.types'
import Link from 'next/link'
import { PageContainer } from '@/components/page-container'
import { routes } from '@/constants/routes'
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
        <div className="flex flex-col items-center rounded-[14px] border border-dashed border-edge-strong bg-chip px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-[13px] border border-edge bg-surface">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B6B87" strokeWidth="1.6">
              <rect x="2" y="4" width="20" height="13" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <h2 className="mb-1.5 mt-4 text-[15px] font-semibold">No devices yet</h2>
          <p className="mb-5 max-w-[360px] text-[13px] leading-[1.5] text-ink-2">
            Add the Pulse extension to this Chrome profile and it registers here automatically — then your activity starts flowing in.
          </p>
          <Link
            href={routes.connectExtension}
            className="rounded-[10px] bg-pulse px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-pulse-bright"
          >
            Set up the extension
          </Link>
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
