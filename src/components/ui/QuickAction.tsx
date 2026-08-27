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
        className={`flex items-center justify-center w-[56px] h-[56px] rounded-[20px] bg-white dark:bg-[#1A2332] shadow-sm shadow-gray-200/50 dark:shadow-none transition-all duration-200 active:scale-95`}
      >
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${config.bg}`}>
          <FinosIcon name={config.icon} size={18} className={config.iconColor} />
        </div>
      </div>
      <span className="text-[12px] font-bold text-[#013D7C] dark:text-gray-300 leading-tight text-center tracking-tight">
        {label}
      </span>
    </button>
  )
}
