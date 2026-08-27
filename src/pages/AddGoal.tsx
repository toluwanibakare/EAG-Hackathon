import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'
import { AmountInput } from '../components/ui/AmountInput'

export default function AddGoal() {
  const navigate = useNavigate()
  const addGoal = useStore((s) => s.addGoal)
  
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')

  const handleSave = () => {
    if (!name || !targetAmount) return

    addGoal({
      id: `goal-${Date.now()}`,
      name,
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      state: 'active',
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      contributionRate: 0,
      poolId: '',
      createdAt: new Date().toISOString(),
    })
    
    navigate('/goals', { replace: true })
  }

  return (
    <PageContainer>
      <Header title="New Goal" showBack />
      
      <div className="pt-4 space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#013D7C]/10 dark:bg-[#E8B931]/10 flex items-center justify-center mb-4">
            <FinosIcon name="target" size={32} className="text-[#013D7C] dark:text-[#E8B931]" />
          </div>
          <AmountInput 
            value={targetAmount} 
            onChange={setTargetAmount} 
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
              Goal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New MacBook"
              className="w-full h-[52px] bg-white dark:bg-[#1A2332] rounded-[16px] px-4 text-[15px] font-medium text-[#013D7C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#013D7C]/20"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
              Target Date (Optional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-[52px] bg-white dark:bg-[#1A2332] rounded-[16px] px-4 text-[15px] font-medium text-[#013D7C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#013D7C]/20"
            />
          </div>
        </div>

        <div className="pt-8">
          <button
            onClick={handleSave}
            disabled={!name || !targetAmount}
            className="w-full h-[52px] bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] rounded-[16px] font-bold text-[15px] active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            Create Goal
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
