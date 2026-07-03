import { cn } from '@/utils/cn'

const PATH = 'M6 20h6.5l3-8 5 18 4-13 2.5 5H34'

interface PulseLogoProps {
  size?: number
  variant?: 'tile' | 'white'
  className?: string
}

// The pulse-line mark. `tile` renders the azure line on a light rounded tile,
// `white` renders just the line for dark/brand surfaces.
export const PulseLogo = ({ size = 26, variant = 'tile', className }: PulseLogoProps) => {
  if (variant === 'white') {
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={cn(className)}>
        <path d={PATH} stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={cn(className)}>
      <rect width="40" height="40" rx="10" fill="#e8f2fb" />
      <path d={PATH} stroke="#005ea4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
