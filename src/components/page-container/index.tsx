import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PageContainerProps {
  children: ReactNode
  // `default` = standard dashboard width (Overview, Insights, Devices).
  // `narrow`  = reading-width surfaces (Settings).
  size?: 'default' | 'narrow'
  className?: string
}

// Single source of truth for dashboard page framing — width, centering and the
// 34/26/60px page padding. Keeps every scrolling page aligned. (Bot uses its own
// full-height chat layout and intentionally opts out.)
export const PageContainer = ({ children, size = 'default', className }: PageContainerProps) => {
  return (
    <div
      className={cn(
        'mx-auto w-full px-[34px] pb-[60px] pt-[26px]',
        size === 'narrow' ? 'max-w-[820px]' : 'max-w-[1180px]',
        className,
      )}
    >
      {children}
    </div>
  )
}
