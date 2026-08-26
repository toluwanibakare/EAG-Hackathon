import { useNavigate } from 'react-router-dom'
import { FinosIcon } from '../icons/FinosIcons'

interface HeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: React.ReactNode
  className?: string
  transparent?: boolean
}

export function Header({ title, showBack = false, onBack, rightAction, className = '', transparent = false }: HeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/80 dark:bg-[#1A2332]/80 backdrop-blur-2xl'
      } ${className}`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between h-[52px] px-4 max-w-lg mx-auto">
        <div className="flex items-center w-10">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-9 h-9 -ml-1 rounded-xl text-[#013D7C] dark:text-white active:bg-black/5 dark:active:bg-white/10 transition-colors duration-150"
              aria-label="Go back"
            >
              <FinosIcon name="chevron-left" size={20} />
            </button>
          )}
        </div>

        <h1 className="text-[15px] font-bold text-[#013D7C] dark:text-white tracking-[-0.01em] truncate">
          {title}
        </h1>

        <div className="flex items-center justify-end w-10">
          {rightAction}
        </div>
      </div>
    </header>
  )
}
