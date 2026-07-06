'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

interface ModalProps {
  onClose: () => void
  ariaLabel: string
  children: ReactNode
  maxWidthClassName?: string
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Shared overlay shell (domain drilldown + onboarding, P1.5) — dialog
// semantics, a focus trap, Escape-to-close, and focus restore on close so
// keyboard and screen-reader users aren't stranded behind the backdrop.
export const Modal = ({ onClose, ariaLabel, children, maxWidthClassName = 'max-w-[560px]' }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const trigger = document.activeElement
    const dialog = dialogRef.current
    dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialog)
        return

      const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (nodes.length === 0)
        return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
      else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (trigger instanceof HTMLElement)
        trigger.focus()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(15_23_42/0.45)] p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          'relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-edge bg-base p-7 shadow-[0_24px_60px_rgba(0,40,80,.25)]',
          maxWidthClassName,
        )}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-chip hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
