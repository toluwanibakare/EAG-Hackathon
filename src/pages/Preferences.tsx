import { useState } from 'react'
import { useStore } from '../store/useStore'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
        on ? 'bg-[#013D7C] dark:bg-[#E8B931]' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
          on ? 'right-0.5' : 'left-0.5'
        }`}
      />
    </button>
  )
}

export default function Preferences() {
  const [pushNotif, setPushNotif] = useState(true)
  const [emailNotif, setEmailNotif] = useState(false)
  const { darkMode, toggleDarkMode } = useStore()

  return (
    <PageContainer>
      <Header title="Preferences" showBack />
      <div className="pt-4">
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] overflow-hidden transition-colors">
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gray-50 dark:bg-gray-800">
                <FinosIcon name="bell" size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white">Push Notifications</span>
            </div>
            <Toggle on={pushNotif} onToggle={() => setPushNotif(!pushNotif)} />
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gray-50 dark:bg-gray-800">
                <FinosIcon name="mail" size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white">Email Notifications</span>
            </div>
            <Toggle on={emailNotif} onToggle={() => setEmailNotif(!emailNotif)} />
          </div>
          <button className="px-4 py-3.5 flex items-center justify-between w-full text-left border-b border-gray-50 dark:border-gray-700/50 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gray-50 dark:bg-gray-800">
                <FinosIcon name="smartphone" size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white">Currency</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">NGN</span>
              <FinosIcon name="chevron-right" size={16} className="text-gray-300 dark:text-gray-600" />
            </div>
          </button>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gray-50 dark:bg-gray-800">
                <FinosIcon name="moon" size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white">Dark Mode</span>
            </div>
            <Toggle on={darkMode} onToggle={toggleDarkMode} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
