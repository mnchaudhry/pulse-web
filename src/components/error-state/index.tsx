import { cn } from '@/utils/cn'

interface ErrorStateProps {
  message?: string
  onRetry: () => void
  className?: string
}

// Every data-fetching surface needs a way out of a failed load — always a retry, never a dead end.
export const ErrorState = ({ message = 'Couldn’t load this. Check your connection and try again.', onRetry, className }: ErrorStateProps) => (
  <div className={cn('flex flex-col items-center gap-3 rounded-[14px] border border-danger-edge bg-danger-bg p-6 text-center text-[13px] text-danger-deep', className)}>
    <p>{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="rounded-[8px] border border-danger-edge px-3.5 py-1.5 text-[12.5px] font-medium text-danger-deep transition-colors hover:bg-danger-soft/30"
    >
      Try again
    </button>
  </div>
)
