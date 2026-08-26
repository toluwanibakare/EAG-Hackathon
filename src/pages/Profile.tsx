import { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'
import { userProfile } from '../data/mockData'

export default function Profile() {
  const [name, setName] = useState(userProfile.name)
  const [email, setEmail] = useState('tolu@email.com')
  const [phone, setPhone] = useState('+234 800 000 0000')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageContainer>
      <Header title="Profile" showBack />

      <div className="pt-4 space-y-4">
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#013D7C] dark:bg-[#E8B931]">
              <FinosIcon name="user" size={40} className="text-white dark:text-[#013D7C]" />
            </div>
            <button className="absolute -bottom-1 -right-1 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1A2332] shadow-md border border-gray-100 dark:border-gray-700">
              <FinosIcon name="edit" size={14} className="text-[#013D7C] dark:text-[#E8B931]" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">Tap to change photo</p>
        </div>

        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-5 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-[12px] px-4 py-3 text-[14px] font-semibold text-[#013D7C] dark:text-white outline-none focus:ring-2 focus:ring-[#013D7C]/20 transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-[12px] px-4 py-3 text-[14px] font-semibold text-[#013D7C] dark:text-white outline-none focus:ring-2 focus:ring-[#013D7C]/20 transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 rounded-[12px] px-4 py-3 text-[14px] font-semibold text-[#013D7C] dark:text-white outline-none focus:ring-2 focus:ring-[#013D7C]/20 transition-all"
            />
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
