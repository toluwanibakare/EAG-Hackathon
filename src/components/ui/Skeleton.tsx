interface SkeletonProps {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`skeleton ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[20px] p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-8 w-40 mb-5" />
      <div className="flex gap-3">
        <div className="flex-1 rounded-2xl p-4">
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex-1 rounded-2xl p-4">
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonPoolRow() {
  return (
    <div className="flex items-center gap-3 bg-white rounded-[20px] p-4">
      <Skeleton className="w-11 h-11 rounded-[14px] shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3.5 w-20 mb-2" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

export function SkeletonTransactionRow() {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <Skeleton className="w-10 h-10 rounded-[12px] shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3.5 w-28 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="text-right">
        <Skeleton className="h-3.5 w-16 mb-2 ml-auto" />
        <Skeleton className="h-3 w-10 ml-auto" />
      </div>
    </div>
  )
}

export function SkeletonGoalCard() {
  return (
    <div className="bg-white rounded-[20px] p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full mb-3" />
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="text-right">
          <Skeleton className="h-3 w-16 mb-1 ml-auto" />
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>
      </div>
    </div>
  )
}
