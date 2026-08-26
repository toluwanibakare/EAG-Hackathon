import { FinosIcon } from '../icons/FinosIcons'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
      <div className="flex items-center justify-center w-16 h-16 rounded-[20px] bg-gray-100 dark:bg-gray-800 mb-5">
        <FinosIcon name={icon} size={28} className="text-gray-300 dark:text-gray-600" />
      </div>
      <h3 className="text-[15px] font-bold text-[#013D7C] dark:text-white mb-1.5">{title}</h3>
      <p className="text-[13px] text-gray-400 font-medium leading-relaxed max-w-[260px] mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-[#013D7C] text-white text-[13px] font-bold rounded-xl active:scale-[0.97] transition-all duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
