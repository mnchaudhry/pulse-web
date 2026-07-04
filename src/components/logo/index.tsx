import { PulseLogo } from '@/components/pulse-logo'
import { cn } from '@/utils/cn'

interface LogoProps {
  /** Mark size in px. */
  size?: number
  /** `full` = mark + wordmark; `mark` = mark only. */
  variant?: 'full' | 'mark'
  /** `brand` = azure on light; `inverse` = white on dark surfaces. */
  tone?: 'brand' | 'inverse'
  /** Show the "Attention, honestly" tagline under the wordmark. */
  tagline?: boolean
  className?: string
}

// The single Pulse logo lockup used across the app. Wraps the PulseLogo mark
// with the wordmark + optional tagline so branding stays consistent everywhere.
export const Logo = ({ size = 26, variant = 'full', tone = 'brand', tagline = false, className }: LogoProps) => {
  const mark = tone === 'inverse'
    ? (
        <span
          className="flex flex-none items-center justify-center rounded-[11px] border border-white/20 bg-white/[.16]"
          style={{ width: size * 1.5, height: size * 1.5 }}
        >
          <PulseLogo variant="white" size={Math.round(size * 0.92)} />
        </span>
      )
    : <PulseLogo variant="tile" size={size} />

  if (variant === 'mark')
    return <span className={cn('inline-flex', className)}>{mark}</span>

  return (
    <span className={cn('inline-flex items-center gap-[11px]', className)}>
      {mark}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-bold tracking-[-.2px]',
            size >= 30 ? 'text-lg' : 'text-base',
            tone === 'inverse' ? 'text-white' : 'text-ink',
          )}
        >
          Pulse
        </span>
        {tagline && (
          <span className={cn('mt-[3px] text-[10.5px]', tone === 'inverse' ? 'text-white/70' : 'text-ink-3')}>
            Attention, honestly
          </span>
        )}
      </span>
    </span>
  )
}
