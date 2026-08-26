import { FinosIcon } from '../icons/FinosIcons'

interface QuickActionProps {
  icon: string
  label: string
  onClick?: () => void
  className?: string
}

const actionConfig: Record<string, { bg: string; iconColor: string; icon: string }> = {
  'arrow-down-left': { bg: 'bg-[#E8F5E9]', iconColor: 'text-[#2E7D32]', icon: 'arrow-down-left' },
  'arrow-up-right': { bg: 'bg-[#FFEBEE]', iconColor: 'text-[#C62828]', icon: 'arrow-up-right' },
  'arrow-left-right': { bg: 'bg-[#E3F2FD]', iconColor: 'text-[#1565C0]', icon: 'arrow-left-right' },
  'shuffle': { bg: 'bg-[#EDE7F6]', iconColor: 'text-[#4527A0]', icon: 'shuffle' },
}

export function QuickAction({ icon, label, onClick, className = '' }: QuickActionProps) {
  const config = actionConfig[icon] || { bg: 'bg-gray-100', iconColor: 'text-gray-500', icon }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2.5 ${className}`}
    >
      <div
        className={`flex items-center justify-center w-[52px] h-[52px] rounded-[16px] ${config.bg} transition-all duration-200 active:scale-90`}
      >
        <FinosIcon name={config.icon} size={22} className={config.iconColor} />
      </div>
      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 leading-tight text-center">
        {label}
      </span>
    </button>
  )
}
