import { Skeleton } from '.'

interface Props {
  rows?: number
  className?: string
}

// Reusable row skeleton — devices, category table, domain modal pages.
export const ListSkeleton = ({ rows = 4, className }: Props) => (
  <div className={className}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3.5 py-[11px]">
        <Skeleton className="h-2 w-2 flex-none rounded-full" />
        <Skeleton className="h-3.5 flex-1" />
        <Skeleton className="h-3.5 w-[60px] flex-none" />
      </div>
    ))}
  </div>
)
