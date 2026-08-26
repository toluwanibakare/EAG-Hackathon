import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { Pool } from '../types'
import { formatNaira, generateId } from '../lib/utils'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { AmountInput } from '../components/ui/AmountInput'
import { FinosIcon } from '../components/icons/FinosIcons'

const categories = [
  'Food', 'Transport', 'Education', 'Entertainment', 'Health',
  'Shopping', 'Utilities', 'Housing', 'Other',
]

export default function AddExpense() {
  const navigate = useNavigate()
  const { pools, addTransaction } = useStore()

  const [amount, setAmount] = useState('')
  const [selectedPoolId, setSelectedPoolId] = useState('')
  const [category, setCategory] = useState('')
  const [merchant, setMerchant] = useState('')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const numAmount = parseFloat(amount) || 0
  const selectedPool = pools.find((p) => p.id === selectedPoolId)
  const availablePools = pools.filter((p) => p.restriction === 'available' && !p.parentId)
  const restrictedPools = pools.filter((p) => p.restriction !== 'available' && !p.parentId)

  const remainingBalance = selectedPool ? selectedPool.balance - numAmount : 0
  const isInsufficient = selectedPool ? numAmount > selectedPool.balance : false
  const requiresReason = selectedPool?.requiresReason ?? false
  const canSubmit = numAmount > 0 && selectedPoolId.length > 0 && category.length > 0 && (!requiresReason || reason.trim().length > 0) && !isInsufficient

  const handleSubmit = () => {
    if (!canSubmit || !selectedPool) return

    addTransaction({
      id: generateId(),
      type: 'expense',
      amount: numAmount,
      description: category,
      category,
      poolId: selectedPool.id,
      poolName: selectedPool.name,
      merchant: merchant.trim() || undefined,
      reason: reason.trim() || undefined,
      note: note.trim() || undefined,
      date,
      time: new Date().toTimeString().slice(0, 5),
      status: 'completed',
      reference: `EXP-${Date.now()}`,
    })

    navigate('/')
  }

  return (
    <PageContainer>
      <Header title="Add Expense" showBack />

      <div className="pt-4 space-y-6">
        <div className="animate-fade-in">
          <AmountInput value={amount} onChange={setAmount} autoFocus />
          <p className="text-center text-[11px] text-gray-400 font-medium mt-2 uppercase tracking-wide">Enter amount</p>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '60ms' }}>
          <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-wider">Select Pool</label>
          <div className="space-y-2">
            {availablePools.length > 0 && (
              <div className="space-y-2">
                {availablePools.map((pool) => (
                  <PoolSelectItem
                    key={pool.id}
                    pool={pool}
                    selected={selectedPoolId === pool.id}
                    onSelect={() => setSelectedPoolId(pool.id)}
                  />
                ))}
              </div>
            )}
            {restrictedPools.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Restricted Pools</p>
                {restrictedPools.map((pool) => (
                  <PoolSelectItem
                    key={pool.id}
                    pool={pool}
                    selected={selectedPoolId === pool.id}
                    onSelect={() => setSelectedPoolId(pool.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedPool && (
          <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-gray-400 font-medium">Available in {selectedPool.name}</span>
              <span className="text-[13px] font-bold text-[#013D7C] dark:text-white tabular-nums">{formatNaira(selectedPool.balance)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-medium">Being spent</span>
              <span className="text-[13px] font-bold text-[#C62828] tabular-nums">{numAmount > 0 ? '-' + formatNaira(numAmount) : '-'}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700/50 mt-2 pt-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Remaining</span>
              <span className={`text-[14px] font-bold tabular-nums ${isInsufficient ? 'text-[#C62828]' : 'text-[#013D7C] dark:text-white'}`}>
                {formatNaira(remainingBalance)}
              </span>
            </div>
            {isInsufficient && (
              <p className="text-[11px] text-[#C62828] font-semibold mt-2">Insufficient balance in this pool.</p>
            )}
          </div>
        )}

        <div className="animate-fade-in" style={{ animationDelay: '120ms' }}>
          <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase tracking-wider">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 rounded-[10px] text-[12px] font-bold border transition-all duration-200 ${
                  category === cat
                    ? 'bg-[#013D7C] text-white border-[#013D7C]'
                    : 'bg-white dark:bg-[#1A2332] text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700/50 active:border-gray-200 dark:active:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '180ms' }}>
          <div>
            <label className="text-[10px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Merchant (optional)</label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Shoprite"
              className="w-full bg-white dark:bg-[#1A2332] rounded-[12px] px-4 py-3 text-[13px] text-[#013D7C] dark:text-white outline-none border border-gray-100 dark:border-gray-700/50 focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
          </div>
          {requiresReason && (
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">
                Reason <span className="text-[#C62828]">*</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Required for this pool"
                className="w-full bg-white dark:bg-[#1A2332] rounded-[12px] px-4 py-3 text-[13px] text-[#013D7C] dark:text-white outline-none border border-gray-100 dark:border-gray-700/50 focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>
          )}
          <div>
            <label className="text-[10px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any additional details..."
              rows={2}
              className="w-full bg-white dark:bg-[#1A2332] rounded-[12px] px-4 py-3 text-[13px] text-[#013D7C] dark:text-white outline-none border border-gray-100 dark:border-gray-700/50 focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white dark:bg-[#1A2332] rounded-[12px] px-4 py-3 text-[13px] text-[#013D7C] dark:text-white outline-none border border-gray-100 dark:border-gray-700/50 focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-[#013D7C] text-white text-[14px] font-bold py-3.5 rounded-[14px] active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed animate-fade-in"
          style={{ animationDelay: '240ms' }}
        >
          Add Expense
        </button>
      </div>
    </PageContainer>
  )
}

function PoolSelectItem({ pool, selected, onSelect }: { pool: Pool; selected: boolean; onSelect: () => void }) {
  const isRestricted = pool.restriction !== 'available'
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-3 w-full p-3 rounded-[14px] border transition-all duration-200 ${
        selected
          ? 'border-[#013D7C] bg-[#F0F4FF]'
          : 'border-gray-100 dark:border-gray-700/50 bg-white dark:bg-[#1A2332] active:border-gray-200 dark:active:border-gray-700'
      }`}
    >
      <div
        className="flex items-center justify-center w-9 h-9 rounded-[10px] shrink-0"
        style={{ backgroundColor: pool.color + '10' }}
      >
        <span style={{ color: pool.color }}>
          <FinosIcon name={pool.icon} size={18} />
        </span>
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[13px] font-bold text-[#013D7C] dark:text-white">{pool.name}</p>
        {isRestricted && (
          <p className="text-[10px] text-[#E65100] font-bold uppercase tracking-wide">{pool.restriction.replace('_', ' ')}</p>
        )}
      </div>
      <span className="text-[12px] font-bold text-[#013D7C] dark:text-white tabular-nums">{formatNaira(pool.balance)}</span>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-[#013D7C] flex items-center justify-center shrink-0">
          <FinosIcon name="check" size={12} className="text-white" />
        </div>
      )}
    </button>
  )
}
