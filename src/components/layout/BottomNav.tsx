import { useLocation, useNavigate } from 'react-router-dom'
import { FinosIcon } from '../icons/FinosIcons'

interface Tab {
  name: string
  label: string
  icon: string
  path: string
}

const tabs: Tab[] = [
  { name: 'home', label: 'Home', icon: 'home', path: '/' },
  { name: 'money', label: 'Money', icon: 'wallet', path: '/money' },
  { name: 'goals', label: 'Goals', icon: 'target', path: '/goals' },
  { name: 'activity', label: 'Activity', icon: 'receipt', path: '/activity' },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#1A2332]/90 backdrop-blur-xl border-t border-black/[0.04] dark:border-white/[0.08]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-[68px] max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-[3px] transition-all duration-300 ${
                active ? 'text-[#013D7C] dark:text-white' : 'text-gray-400'
              }`}
              aria-label={tab.label}
            >
              <FinosIcon
                name={tab.icon}
                size={21}
                className={active ? 'text-[#013D7C] dark:text-[#E8B931]' : 'text-gray-400'}
              />
              <span
                className={`text-[10px] leading-none transition-all duration-300 ${
                  active ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
