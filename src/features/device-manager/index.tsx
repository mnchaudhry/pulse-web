'use client'

import type { DeviceRow as Device } from '@/lib/supabase/database.types'
import Link from 'next/link'
import { useState } from 'react'
import { EmptyState } from '@/components/empty-state'
import { ErrorState } from '@/components/error-state'
import { Modal } from '@/components/modal'
import { PageContainer } from '@/components/page-container'
import { ListSkeleton } from '@/components/skeleton/list-skeleton'
import { routes } from '@/constants/routes'
import { DeviceRow } from './components/device-row'
import { useDeviceManager } from './use-device-manager'

export const DeviceManager = () => {
  const { devicesQuery, rename, remove } = useDeviceManager()
  const devices = devicesQuery.data ?? []
  const [removeTarget, setRemoveTarget] = useState<Device | null>(null)

  const onRename = (device: Device, label: string) => {
    rename.mutate({ id: device.id, label })
  }

  const confirmRemove = () => {
    if (!removeTarget)
      return
    remove.mutate(removeTarget.id)
    setRemoveTarget(null)
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-[-.4px]">Devices</h1>
        <p className="mt-1.5 text-[13.5px] text-ink-2">
          Every Chrome profile and machine reporting to your account. Removing one stops it contributing new data.
        </p>
      </div>

      {devicesQuery.isError && (
        <ErrorState message="Couldn’t load your devices. Check your connection and try again." onRetry={() => devicesQuery.refetch()} />
      )}

      {devicesQuery.isLoading && <ListSkeleton rows={3} />}

      {!devicesQuery.isLoading && !devicesQuery.isError && devices.length === 0 && (
        <EmptyState
          icon={(
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B6B87" strokeWidth="1.6">
              <rect x="2" y="4" width="20" height="13" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          )}
          title="No devices yet"
          body="Add the Pulse extension to this Chrome profile and it registers here automatically — then your activity starts flowing in."
          action={(
            <Link
              href={routes.connectExtension}
              className="rounded-[10px] bg-pulse px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-pulse-bright"
            >
              Set up the extension
            </Link>
          )}
        />
      )}

      <div className="flex flex-col gap-3">
        {devices.map(device => (
          <DeviceRow key={device.id} device={device} onRename={onRename} onRequestRemove={setRemoveTarget} />
        ))}
      </div>

      {devices.length > 0 && (
        <p className="mt-5 text-xs text-ink-3">
          Reinstalling the extension on a profile registers a fresh device — old and new aren’t merged.
        </p>
      )}

      {removeTarget && (
        <Modal onClose={() => setRemoveTarget(null)} ariaLabel="Remove device" maxWidthClassName="max-w-[420px]">
          <h2 className="mb-1.5 pr-6 text-[15px] font-semibold">
            Remove “
            {removeTarget.label}
            ”?
          </h2>
          <p className="mb-5 text-[13px] leading-normal text-ink-2">
            It stops contributing new data. Existing data is kept.
          </p>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setRemoveTarget(null)}
              className="rounded-[9px] border border-edge px-4 py-2 text-[13px] font-medium text-ink-2 transition-colors hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmRemove}
              className="rounded-[9px] bg-danger px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:opacity-90"
            >
              Remove device
            </button>
          </div>
        </Modal>
      )}
    </PageContainer>
  )
}
