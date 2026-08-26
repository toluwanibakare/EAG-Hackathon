import { useRef, useState, useCallback, type ReactNode, type TouchEvent } from 'react'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const threshold = 70

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (refreshing) return
    const el = containerRef.current
    if (el && el.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      setPulling(true)
    }
  }, [refreshing])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!pulling || refreshing) return
    const dy = e.touches[0].clientY - startY.current
    if (dy > 0) {
      setPullDistance(Math.min(dy * 0.5, 100))
    }
  }, [pulling, refreshing])

  const onTouchEnd = useCallback(async () => {
    if (!pulling) return
    setPulling(false)
    if (pullDistance > threshold) {
      setRefreshing(true)
      setPullDistance(threshold)
      await onRefresh()
      setRefreshing(false)
    }
    setPullDistance(0)
  }, [pulling, pullDistance, onRefresh])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overscroll-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {(pullDistance > 0 || refreshing) && (
        <div
          className="flex items-center justify-center overflow-hidden transition-all"
          style={{ height: refreshing ? 48 : pullDistance }}
        >
          {refreshing ? (
            <div className="w-6 h-6 border-2 border-gray-300 border-t-[#013D7C] rounded-full animate-spin" />
          ) : (
            <div className={`transition-transform ${pullDistance > threshold ? 'rotate-180' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
