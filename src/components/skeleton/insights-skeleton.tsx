import { Skeleton } from '.'

export const InsightsSkeleton = () => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] gap-3.5 max-sm:grid-cols-1">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex overflow-hidden rounded-[14px] border border-edge bg-surface shadow-[0_4px_16px_rgba(15,23,42,.05)]">
        <Skeleton className="w-[3px] flex-none rounded-none" />
        <div className="flex-1 p-[18px] px-5">
          <div className="mb-2.5 flex items-center gap-2.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="ml-auto h-3 w-12" />
          </div>
          <Skeleton className="mb-1.5 h-4 w-3/4" />
          <Skeleton className="mb-3.5 h-3 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-[7px]" />
            <Skeleton className="h-6 w-16 rounded-[7px]" />
          </div>
        </div>
      </div>
    ))}
  </div>
)
