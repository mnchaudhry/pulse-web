'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { renameDevice } from '@/services/devices/rename-device'
import { primaryBtn } from '../../styles'

interface StageNameDeviceProps {
  deviceId: string
  defaultLabel: string
  onConfirmed: () => void
}

// Onboarding Stage 4 (onboarding-flow.md) — pre-filled and selected so typing
// immediately replaces it; accepting the default is a one-click no-op, so
// there's no separate "skip" action.
export const StageNameDevice = ({ deviceId, defaultLabel, onConfirmed }: StageNameDeviceProps) => {
  const queryClient = useQueryClient()
  const [label, setLabel] = useState(defaultLabel)

  const confirm = useMutation({
    mutationFn: () => renameDevice(deviceId, label.trim() || defaultLabel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-by-client'] })
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      onConfirmed()
    },
  })

  return (
    <div className="w-full max-w-[520px]">
      <div className="mb-[26px] flex flex-col items-center">
        <Logo variant="mark" size={44} />
        <h1 className="mb-1.5 mt-[18px] text-[22px] font-semibold tracking-[-.3px]">Name this device</h1>
        <p className="max-w-[420px] text-center text-[13.5px] text-ink-2">
          Helps you tell it apart on the Devices page — you can always rename it later.
        </p>
      </div>
      <input
        value={label}
        onChange={e => setLabel(e.target.value)}
        onFocus={e => e.target.select()}
        autoFocus
        className="mono w-full rounded-[11px] border border-edge bg-chip px-[15px] py-3 text-center text-sm text-ink outline-none focus:border-pulse"
      />
      <button
        type="button"
        onClick={() => confirm.mutate()}
        disabled={confirm.isPending || !label.trim()}
        className={`mt-[18px] ${primaryBtn}`}
      >
        {confirm.isPending ? 'Saving…' : 'Looks good'}
      </button>
    </div>
  )
}
