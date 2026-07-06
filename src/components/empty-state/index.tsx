import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  body: ReactNode
  action?: ReactNode
  className?: string
}

// Single shape for "nothing here yet" across pages — icon, title, body, optional CTA.
export const EmptyState = ({ icon, title, body, action, className }: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center rounded-[14px] border border-dashed border-edge-strong bg-chip px-6 py-12 text-center', className)}>
    <div className="flex h-12 w-12 items-center justify-center rounded-[13px] border border-edge bg-surface">
      {icon}
    </div>
    <h2 className="mb-1.5 mt-4 text-[15px] font-semibold">{title}</h2>
    <p className={cn('max-w-[360px] text-[13px] leading-[1.5] text-ink-2', action && 'mb-5')}>{body}</p>
    {action}
  </div>
)
