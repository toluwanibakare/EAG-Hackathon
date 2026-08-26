import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { FinosIcon } from '../icons/FinosIcons'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function BottomSheet({ isOpen, onClose, title, children, className = '' }: BottomSheetProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1A2332] rounded-t-[28px] max-h-[85vh] flex flex-col animate-slide-up ${className}`}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="w-8" />
          {title && (
            <h2 className="text-[15px] font-bold text-[#013D7C] dark:text-white">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 active:bg-gray-200 dark:active:bg-gray-700 transition-colors duration-150"
            aria-label="Close"
          >
            <FinosIcon name="x" size={15} />
          </button>
        </div>

        <div className="w-8 h-[3px] bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3" />

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
