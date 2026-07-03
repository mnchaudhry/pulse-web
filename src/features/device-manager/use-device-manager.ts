'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listDevices } from '@/services/devices/list-devices'
import { removeDevice } from '@/services/devices/remove-device'
import { renameDevice } from '@/services/devices/rename-device'

// US-09..12: list devices, rename, remove.
export const useDeviceManager = () => {
  const queryClient = useQueryClient()
  const devicesQuery = useQuery({ queryKey: ['devices'], queryFn: listDevices })
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['devices'] })

  const rename = useMutation({
    mutationFn: ({ id, label }: { id: string, label: string }) => renameDevice(id, label),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => removeDevice(id),
    onSuccess: invalidate,
  })

  return { devicesQuery, rename, remove }
}
