import type { Notification } from '../../types'
import { formatDate } from '../../lib/utils'
import { FinosIcon } from '../icons/FinosIcons'

interface NotificationItemProps {
  notification: Notification
  onClick?: (n: Notification) => void
}

const typeIcons: Record<string, string> = {
  income: 'arrow-down-left',
  goal: 'target',
  restriction: 'alert-circle',
  withdrawal: 'arrow-up-right',
  system: 'info',
}

const typeStyles: Record<string, { icon: string; bg: string }> = {
  income: { icon: 'text-[#2E7D32]', bg: 'bg-[#E8F5E9]' },
  goal: { icon: 'text-[#1565C0]', bg: 'bg-[#E3F2FD]' },
  restriction: { icon: 'text-[#E65100]', bg: 'bg-[#FFF3E0]' },
  withdrawal: { icon: 'text-[#C62828]', bg: 'bg-[#FFEBEE]' },
  system: { icon: 'text-gray-500', bg: 'bg-gray-100' },
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const icon = typeIcons[notification.type] || 'info'
  const style = typeStyles[notification.type] || typeStyles.system

  return (
    <button
      onClick={() => onClick?.(notification)}
      className={`flex items-start gap-3 w-full py-4 px-1 text-left transition-colors duration-150 active:bg-gray-50 dark:active:bg-gray-800 ${
        !notification.read ? 'bg-[#F0F4FF]/40 dark:bg-[#E8B931]/10' : ''
      }`}
    >
      <div className={`flex items-center justify-center w-9 h-9 rounded-[10px] shrink-0 ${style.bg}`}>
        <FinosIcon name={icon} size={16} className={style.icon} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-[13px] leading-snug ${!notification.read ? 'font-bold text-[#013D7C] dark:text-white' : 'font-semibold text-gray-600 dark:text-gray-300'}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-[#013D7C] shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-[12px] text-gray-400 font-medium mt-0.5 line-clamp-2">
          {notification.body}
        </p>
        <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1.5 font-medium">
          {formatDate(notification.date)}
        </p>
      </div>
    </button>
  )
}
