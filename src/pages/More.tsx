import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'

interface MenuItem {
  icon: string
  label: string
  path?: string
  action?: () => void
  badge?: number
}

export default function More() {
  const navigate = useNavigate()
  const notifications = useStore((s) => s.notifications)
  const lock = useStore((s) => s.lock)
  const unreadCount = notifications.filter((n) => !n.read).length

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        { icon: 'bell', label: 'Notifications', path: '/notifications', badge: unreadCount },
        { icon: 'shuffle', label: 'Allocation Policy', path: '/allocation-policy' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { icon: 'shield', label: 'Privacy & Security', path: '/settings/privacy' },
        { icon: 'settings', label: 'Preferences', path: '/settings/preferences' },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: 'info', label: 'About RUNDA', path: '/settings/about' },
        { icon: 'file-text', label: 'Terms of Service', path: '/settings/terms' },
        { icon: 'globe', label: 'Website', path: '/settings/website' },
      ],
    },
  ]

  return (
    <PageContainer>
      <Header title="More" />

      <div className="pt-4">
        {menuSections.map((section, si) => (
          <div
            key={section.title}
            className="mb-5 animate-fade-in"
            style={{ animationDelay: `${(si + 1) * 60}ms` }}
          >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-white dark:bg-[#1A2332] rounded-[20px] overflow-hidden">
              {section.items.map((item, ii) => {
                const isLast = ii === section.items.length - 1
                return (
                  <button
                    key={item.label}
                    onClick={() => item.path && navigate(item.path)}
                    className={`flex items-center gap-3 w-full px-4 py-3.5 text-left active:bg-gray-50 dark:active:bg-gray-800 transition-colors duration-150 ${
                      !isLast ? 'border-b border-gray-50 dark:border-gray-700/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gray-50 dark:bg-gray-800">
                      <FinosIcon name={item.icon} size={16} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="flex-1 text-[13px] font-semibold text-[#013D7C] dark:text-white">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.badge && item.badge > 0 && (
                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#C62828] text-white text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                      <FinosIcon name="chevron-right" size={16} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <button
          onClick={lock}
          className="flex items-center gap-3 w-full bg-white dark:bg-[#1A2332] rounded-[20px] px-4 py-3.5 active:bg-gray-50 dark:active:bg-gray-800 transition-colors duration-150 mb-3"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gray-50 dark:bg-gray-800">
            <FinosIcon name="lock" size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <span className="flex-1 text-[13px] font-semibold text-[#013D7C] dark:text-white">Lock App</span>
          <FinosIcon name="chevron-right" size={16} className="text-gray-300 dark:text-gray-600" />
        </button>

        <a
          href="https://www.tmb.it.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 mb-6"
        >
          <span className="text-[10px] text-gray-300 dark:text-gray-600 font-medium">Built by</span>
          <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">TMB</span>
        </a>
      </div>
    </PageContainer>
  )
}
