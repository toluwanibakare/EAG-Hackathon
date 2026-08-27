import { useRef, useState, useCallback, useEffect, type ReactNode, type TouchEvent } from 'react'
import { FinosIcon } from '../icons/FinosIcons'

interface SwipeableCardProps {
  children: ReactNode
  onEdit?: () => void
  onDelete?: () => void
}

export function SwipeableCard({ children, onEdit, onDelete }: SwipeableCardProps) {
  const [offset, setOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const locked = useRef<'x' | 'y' | null>(null)
  
  // Make the buttons a bit wider for better touch targets
  const buttonWidth = 70
  const maxSwipe = (onEdit ? buttonWidth : 0) + (onDelete ? buttonWidth : 0)

  const onTouchStart = useCallback((e: TouchEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    locked.current = null
    setIsDragging(true)
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current

    if (!locked.current) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
        locked.current = 'x'
        // If it was already swiped open and we swipe right, allow it to close
      } else if (Math.abs(dy) > 8) {
        locked.current = 'y'
      }
    }

    if (locked.current === 'x') {
      // Allow swiping left (negative dx) and closing (positive dx if already offset)
      const currentOffset = offset === -maxSwipe ? -maxSwipe + dx : dx
      const clamped = Math.min(0, Math.max(-maxSwipe - 20, currentOffset)) // allow slight overscroll
      setOffset(clamped)
    }
  }, [maxSwipe, isDragging, offset])

  const onTouchEnd = useCallback(() => {
    setIsDragging(false)
    const threshold = maxSwipe / 3 // Easier to snap open
    if (offset < -threshold) {
      setOffset(-maxSwipe)
    } else {
      setOffset(0)
    }
  }, [maxSwipe, offset])

  // Handle outside clicks to close the card
  useEffect(() => {
    if (offset === 0) return
    const closeCard = () => {
      setOffset(0)
    }
    document.addEventListener('touchstart', closeCard)
    document.addEventListener('mousedown', closeCard)
    return () => {
      document.removeEventListener('touchstart', closeCard)
      document.removeEventListener('mousedown', closeCard)
    }
  }, [offset])

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOffset(0)
    onEdit?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOffset(0)
    onDelete?.()
  }

  return (
    <div className="relative rounded-[20px] bg-gray-50 dark:bg-[#1A2332]/50">
      <div className="absolute inset-0 flex items-center justify-end rounded-[20px] overflow-hidden pr-2 gap-1 py-1">
        {onEdit && (
          <button
            onClick={handleEdit}
            style={{ width: buttonWidth - 8 }}
            className="flex flex-col items-center justify-center h-full rounded-[14px] bg-[#013D7C]/10 dark:bg-[#E8B931]/10 text-[#013D7C] dark:text-[#E8B931] shrink-0 active:scale-95 transition-transform"
          >
            <FinosIcon name="edit" size={20} className="mb-1" />
            <span className="text-[10px] font-semibold">Edit</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            style={{ width: buttonWidth - 8 }}
            className="flex flex-col items-center justify-center h-full rounded-[14px] bg-red-50 dark:bg-red-900/20 text-red-600 shrink-0 active:scale-95 transition-transform"
          >
            <FinosIcon name="trash" size={20} className="mb-1" />
            <span className="text-[10px] font-semibold">Delete</span>
          </button>
        )}
      </div>
      <div
        className={`relative z-10 will-change-transform bg-white dark:bg-[#0B1320] rounded-[20px] shadow-sm ${!isDragging ? 'transition-transform duration-300 ease-out' : ''}`}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          if (offset !== 0) {
            e.stopPropagation()
            setOffset(0)
          }
        }}
      >
        {children}
      </div>
    </div>
  )
}
