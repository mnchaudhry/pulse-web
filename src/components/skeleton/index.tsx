import { cn } from '@/utils/cn'

// Base loading block — every page skeleton composes from this.
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-[8px] bg-raised', className)} />
)
