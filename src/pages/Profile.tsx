import { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'
import { useStore } from '../store/useStore'

export default function Profile() {
  const { userName, walletAddress, setUserName } = useStore()
  const [name, setName] = useState(userName)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setUserName(name)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageContainer>
      <Header title="Profile" showBack />

      <div className="pt-4 space-y-4">
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#013D7C] to-[#0256B0] dark:from-[#E8B931] dark:to-[#F1D06A] shadow-xl shadow-[#013D7C]/20 dark:shadow-[#E8B931]/20">
              <FinosIcon name="user" size={40} className="text-white dark:text-[#013D7C]" />
            </div>
            <button className="absolute bottom-0 right-0 flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-[#1A2332] shadow-lg border border-gray-100 dark:border-gray-700 active:scale-95 transition-all">
              <FinosIcon name="edit" size={16} className="text-[#013D7C] dark:text-gray-300" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Tap to change photo</p>
        </div>

        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-5 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-[12px] px-4 py-3 text-[14px] font-semibold text-[#013D7C] dark:text-white outline-none focus:ring-2 focus:ring-[#013D7C]/20 transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Wallet Address</label>
            <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-[12px] px-4 py-3 text-[14px] font-mono text-[#013D7C] dark:text-white opacity-70">
              {walletAddress || 'Not connected'}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-[14px] text-[14px] font-bold transition-all duration-300 ${
            saved
              ? 'bg-[#2E7D32] text-white'
              : 'bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] active:scale-[0.97]'
          }`}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </PageContainer>
  )
}
