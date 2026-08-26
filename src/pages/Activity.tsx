import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { TransactionType } from '../types'
import { formatDate } from '../lib/utils'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { TransactionRow } from '../components/ui/TransactionRow'
import { EmptyState } from '../components/ui/EmptyState'
import { FinosIcon } from '../components/icons/FinosIcons'

const filterTabs: { key: TransactionType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expenses' },
  { key: 'allocation', label: 'Allocations' },
  { key: 'transfer', label: 'Transfers' },
]

export default function Activity() {
  const navigate = useNavigate()
  const transactions = useStore((s) => s.transactions)
  const [activeFilter, setActiveFilter] = useState<TransactionType | 'all'>('all')
  const [showDateFilter, setShowDateFilter] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filtered = useMemo(() => {
    let result = transactions
    if (activeFilter !== 'all') {
      result = result.filter((t) => t.type === activeFilter)
    }
    if (startDate) {
      result = result.filter((t) => t.date >= startDate)
    }
    if (endDate) {
      result = result.filter((t) => t.date <= endDate)
    }
    return result
  }, [transactions, activeFilter, startDate, endDate])

  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {}
    for (const txn of filtered) {
      const key = txn.date
      if (!groups[key]) groups[key] = []
      groups[key].push(txn)
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  const hasActiveFilters = activeFilter !== 'all' || startDate || endDate

  const clearFilters = () => {
    setActiveFilter('all')
    setStartDate('')
    setEndDate('')
  }

  return (
    <PageContainer>
      <Header title="Activity" />

      <div className="pt-4">
        <div className="flex items-center gap-2 mb-3 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`shrink-0 px-3.5 py-2 rounded-[10px] text-[12px] font-bold transition-all duration-200 ${
                activeFilter === tab.key
                  ? 'bg-[#013D7C] text-white'
                  : 'bg-white dark:bg-[#1A2332] text-gray-500 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[12px] font-bold transition-all duration-200 ${
              showDateFilter ? 'bg-[#013D7C] text-white' : 'bg-white dark:bg-[#1A2332] text-gray-500 dark:text-gray-400'
            }`}
          >
            <FinosIcon name="calendar" size={14} />
            Date
          </button>
        </div>

        {showDateFilter && (
          <div className="flex gap-3 mb-4 animate-slide-down px-1">
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 font-medium block mb-1 uppercase tracking-wide">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white dark:bg-[#1A2332] rounded-[12px] px-3 py-2.5 text-[13px] text-[#013D7C] dark:text-white outline-none border border-gray-100 dark:border-gray-700/50 focus:border-gray-300 transition-colors duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 font-medium block mb-1 uppercase tracking-wide">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white dark:bg-[#1A2332] rounded-[12px] px-3 py-2.5 text-[13px] text-[#013D7C] dark:text-white outline-none border border-gray-100 dark:border-gray-700/50 focus:border-gray-300 transition-colors duration-200"
              />
            </div>
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-3 py-2.5 text-[12px] font-bold text-[#C62828] bg-[#FFEBEE] rounded-[12px] active:bg-red-100 transition-colors duration-150"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        {grouped.length === 0 ? (
          <EmptyState
            icon="receipt"
            title="No transactions"
            description="Your transactions will appear here once you start using your pools."
          />
        ) : (
          <div className="space-y-4">
            {grouped.map(([date, txns]) => (
              <div key={date}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-1">
                  {formatDate(date)}
                </p>
                <div className="bg-white dark:bg-[#1A2332] rounded-[20px] divide-y divide-gray-100 dark:divide-gray-700/50 overflow-hidden">
                  {txns.map((txn) => (
                    <TransactionRow
                      key={txn.id}
                      transaction={txn}
                      onClick={() => navigate(`/transaction/${txn.id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
