'use client'

import { useQuery } from '@tanstack/react-query'
import { listDevices } from '@/services/devices/list-devices'
import { useDeviceFilterStore } from '@/stores/device-filter-store'

// US-42/43: the dashboard-wide device scope (Combined or one device).
export const useDeviceFilter = () => {
  const { deviceId, setDeviceId } = useDeviceFilterStore()
  const { data: devices = [] } = useQuery({ queryKey: ['devices'], queryFn: listDevices })

  const currentLabel = deviceId === 'combined'
    ? 'Combined'
    : devices.find(d => d.id === deviceId)?.label ?? 'Combined'

  return { devices, deviceId, setDeviceId, currentLabel }
}
