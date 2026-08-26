import { useRef, useState, useCallback, type ReactNode, type TouchEvent } from 'react'
import { FinosIcon } from '../icons/FinosIcons'

interface SwipeableCardProps {
  children: ReactNode
  onEdit?: () => void
  onDelete?: () => void
}

export function SwipeableCard({ children, onEdit, onDelete }: SwipeableCardProps) {
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)
  const startY = useRef(0)
  const locked = useRef<'x' | 'y' | null>(null)
  const maxSwipe = (onEdit ? 60 : 0) + (onDelete ? 60 : 0)

  const onTouchStart = useCallback((e: TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    locked.current = null
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    if (!locked.current) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) locked.current = 'x'
      else if (Math.abs(dy) > 8) locked.current = 'y'
    }

    if (locked.current === 'x') {
      const clamped = Math.min(0, Math.max(-maxSwipe, dx))
      setOffset(clamped)
    }
  }, [maxSwipe])

  const onTouchEnd = useCallback(() => {
    const threshold = maxSwipe / 2
    setOffset((o) => (o < -threshold ? -maxSwipe : 0))
  }, [maxSwipe])

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-end rounded-[20px] overflow-hidden">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center justify-center h-full w-[60px] bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] shrink-0"
          >
            <FinosIcon name="edit" size={18} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center justify-center h-full w-[60px] bg-[#C62828] text-white shrink-0"
          >
            <FinosIcon name="trash" size={18} />
          </button>
        )}
      </div>
      <div
        className="relative z-10 transition-transform duration-200 will-change-transform"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
