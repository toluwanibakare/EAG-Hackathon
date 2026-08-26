import { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
        on ? 'bg-[#013D7C]' : 'bg-gray-200 dark:bg-gray-700'
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

export default function Privacy() {
  const [biometric, setBiometric] = useState(true)
  const [hideBalance, setHideBalance] = useState(false)

  return (
    <PageContainer>
      <Header title="Privacy & Security" showBack />
      <div className="pt-4">
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] overflow-hidden">
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gray-50 dark:bg-gray-800">
                <FinosIcon name="shield" size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white">Biometric Lock</span>
            </div>
            <Toggle on={biometric} onToggle={() => setBiometric(!biometric)} />
          </div>
          <button className="px-4 py-3.5 flex items-center justify-between w-full text-left border-b border-gray-50 dark:border-gray-700/50 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gray-50 dark:bg-gray-800">
                <FinosIcon name="lock" size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white">Change PIN</span>
            </div>
            <FinosIcon name="chevron-right" size={16} className="text-gray-300 dark:text-gray-600" />
          </button>
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-gray-50 dark:bg-gray-800">
                <FinosIcon name="eye" size={16} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white">Hide Balances by Default</span>
            </div>
            <Toggle on={hideBalance} onToggle={() => setHideBalance(!hideBalance)} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
