'use client'

import { useEffect, useRef, useState } from 'react'
import { useDeviceFilter } from '@/features/device-filter/use-device-filter'
import { cn } from '@/utils/cn'

// Scope pill + dropdown shown on Overview & Insights — blends devices (Combined)
// or narrows to one (US-42/43).
export const DeviceScopeSelector = () => {
  const { devices, deviceId, setDeviceId, currentLabel } = useDeviceFilter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const options = [{ id: 'combined' as const, label: 'Combined' }, ...devices.map(d => ({ id: d.id, label: d.label }))]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-[10px] border border-edge bg-surface px-[13px] py-[9px] text-[13px] text-ink transition-colors hover:border-pulse-soft"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-pulse" />
        {currentLabel}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#717783" strokeWidth="2.4">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1.5 min-w-[200px] overflow-hidden rounded-[10px] border border-edge bg-surface py-1 shadow-[0_12px_32px_rgba(15,23,42,.12)]">
          {options.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setDeviceId(option.id)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] transition-colors hover:bg-tint',
                option.id === deviceId ? 'text-ink' : 'text-ink-2',
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', option.id === deviceId ? 'bg-pulse' : 'bg-transparent')} />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
