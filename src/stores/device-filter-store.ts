import { create } from 'zustand'

// TODO: selected device / 'combined' for the whole dashboard (US-42,43), mirrored to ?device=
interface DeviceFilterState {
  deviceId: string | 'combined'
  setDeviceId: (deviceId: string | 'combined') => void
}

export const useDeviceFilterStore = create<DeviceFilterState>(set => ({
  deviceId: 'combined',
  setDeviceId: deviceId => set({ deviceId }),
}))
