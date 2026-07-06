import { Skeleton } from '.'

const CARD = 'rounded-[14px] border border-edge bg-surface p-5 shadow-[0_4px_16px_rgba(15,23,42,.05)]'

export const OverviewSkeleton = () => (
  <div>
    <div className="mb-4 grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-[14px] border border-edge bg-surface p-[18px] pb-4 shadow-[0_4px_16px_rgba(15,23,42,.05)]">
          <Skeleton className="mb-3.5 h-3 w-20" />
          <Skeleton className="h-[26px] w-16" />
          <Skeleton className="mt-[9px] h-3 w-28" />
        </div>
      ))}
    </div>

    <div className="mb-4 grid grid-cols-[1.55fr_1fr] gap-4 max-lg:grid-cols-1">
      <div className={CARD}>
        <Skeleton className="mb-[18px] h-4 w-32" />
        <Skeleton className="h-[180px] w-full" />
      </div>
      <div className={CARD}>
        <Skeleton className="mb-1 h-4 w-24" />
        <Skeleton className="mt-1 h-3 w-40" />
        <div className="flex flex-1 items-center justify-center py-3.5">
          <Skeleton className="h-[168px] w-[168px] rounded-full" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-[1.55fr_1fr] gap-4 max-lg:grid-cols-1">
      <div className={CARD}>
        <Skeleton className="mb-4 h-4 w-40" />
        <Skeleton className="h-[200px] w-full" />
      </div>
      <div className={CARD}>
        <Skeleton className="mb-4 h-4 w-44" />
        <div className="flex flex-col gap-3.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-2 w-2 flex-none rounded-full" />
              <Skeleton className="h-3.5 flex-1" />
              <Skeleton className="h-3.5 w-10 flex-none" />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className={`mt-4 ${CARD}`}>
      <Skeleton className="mb-[18px] h-4 w-28" />
      <div className="flex flex-col gap-[11px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3.5">
            <Skeleton className="h-3.5 w-[180px] flex-none" />
            <Skeleton className="h-3 w-24 flex-none" />
            <Skeleton className="h-2 flex-1" />
            <Skeleton className="h-3.5 w-[60px] flex-none" />
          </div>
        ))}
      </div>
    </div>
  </div>
)
