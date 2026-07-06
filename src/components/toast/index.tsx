'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  onDismiss: () => void
  durationMs?: number
}

// Calm, self-dismissing notice — no action required, never reopens itself
// (brand-direction.md: quiet, not naggy).
export const Toast = ({ message, onDismiss, durationMs = 4000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs)
    return () => clearTimeout(timer)
  }, [onDismiss, durationMs])

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[11px] border border-edge bg-base px-4 py-3 text-[13px] font-medium text-ink shadow-[0_12px_32px_rgba(15,23,42,.15)]">
      {message}
    </div>
  )
}
