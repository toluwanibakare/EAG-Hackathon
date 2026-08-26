import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatNaira, formatPercent } from '../lib/utils'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'
import { ProgressIndicator } from '../components/ui/ProgressIndicator'

export default function Money() {
  const navigate = useNavigate()
  const pools = useStore((s) => s.pools)
  const getTotalBalance = useStore((s) => s.getTotalBalance)
  const getAvailableBalance = useStore((s) => s.getAvailableBalance)
  const getReservedBalance = useStore((s) => s.getReservedBalance)
  const getMonthlyIncome = useStore((s) => s.getMonthlyIncome)
  const getMonthlySpending = useStore((s) => s.getMonthlySpending)

  const total = getTotalBalance()
  const available = getAvailableBalance()
  const reserved = getReservedBalance()
  const monthlyIncome = getMonthlyIncome()
  const monthlySpending = getMonthlySpending()
  const monthlySavings = monthlyIncome - monthlySpending

  const topLevelPools = pools.filter((p) => !p.parentId)
  const savingsPools = topLevelPools.filter((p) => p.type === 'savings' || p.type === 'emergency')
  const investmentPools = topLevelPools.filter((p) => p.type === 'investment')
  const savingsTotal = savingsPools.reduce((s, p) => s + p.balance, 0)
  const investmentTotal = investmentPools.reduce((s, p) => s + p.balance, 0)

  return (
    <PageContainer>
      <Header title="Money" />

      <div className="pt-4 space-y-4">
        {/* Balance summary */}
        <div className="bg-[#013D7C] rounded-[24px] p-6 text-white relative overflow-hidden animate-fade-in">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/[0.03]" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#1E3A7A]/30" />
          <div className="relative">
            <p className="text-[10px] text-white/40 font-medium tracking-wide uppercase mb-1">Total Balance</p>
            <p className="text-[32px] font-bold tracking-[-0.03em] tabular-nums mb-5">{formatNaira(total)}</p>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/[0.06] rounded-[16px] p-3.5">
                <span className="text-[10px] text-white/30 font-medium block mb-1 tracking-wide uppercase">Available</span>
                <p className="text-[14px] font-bold tabular-nums">{formatNaira(available)}</p>
              </div>
              <div className="bg-white/[0.06] rounded-[16px] p-3.5">
                <span className="text-[10px] text-white/30 font-medium block mb-1 tracking-wide uppercase">Reserved</span>
                <p className="text-[14px] font-bold tabular-nums">{formatNaira(reserved)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-3 gap-2.5 animate-fade-in" style={{ animationDelay: '80ms' }}>
          <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4">
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mb-1">Savings</p>
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tabular-nums tracking-[-0.01em]">{formatNaira(savingsTotal)}</p>
          </div>
          <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4">
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mb-1">Investments</p>
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tabular-nums tracking-[-0.01em]">{formatNaira(investmentTotal)}</p>
          </div>
          <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4">
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mb-1">Emergency</p>
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tabular-nums tracking-[-0.01em]">{formatNaira(50000)}</p>
          </div>
        </div>

        {/* Monthly summary */}
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-5 animate-fade-in" style={{ animationDelay: '160ms' }}>
          <h3 className="text-[13px] font-bold text-[#013D7C] dark:text-white mb-4 tracking-[-0.01em]">This Month</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#E8F5E9]">
                  <FinosIcon name="arrow-down-left" size={16} className="text-[#2E7D32]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Income</p>
                  <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tabular-nums">{formatNaira(monthlyIncome)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#FFEBEE]">
                  <FinosIcon name="arrow-up-right" size={16} className="text-[#C62828]" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Spending</p>
                  <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tabular-nums">{formatNaira(monthlySpending)}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F7F8FB] dark:bg-gray-800 rounded-[14px] p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-gray-400 font-medium">Net Savings</span>
                <span className="text-[12px] font-bold text-[#013D7C] dark:text-white tabular-nums">{formatNaira(monthlySavings)}</span>
              </div>
              <ProgressIndicator
                percent={monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0}
                color="#2E7D32"
                height={4}
              />
            </div>
          </div>
        </div>

        {/* All Pools */}
        <div className="animate-fade-in" style={{ animationDelay: '240ms' }}>
          <h3 className="text-[13px] font-bold text-[#013D7C] dark:text-white mb-3 tracking-[-0.01em]">All Pools</h3>
          <div className="bg-white dark:bg-[#1A2332] rounded-[20px] divide-y divide-gray-100 dark:divide-gray-700/50 overflow-hidden">
            {topLevelPools.map((pool) => (
              <button
                key={pool.id}
                onClick={() => navigate(`/pool/${pool.id}`)}
                className="flex items-center gap-3 w-full px-4 py-3.5 text-left active:bg-gray-50 dark:active:bg-gray-800 transition-colors duration-150"
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-[10px] shrink-0"
                  style={{ backgroundColor: pool.color + '10' }}
                >
                  <span style={{ color: pool.color }}>
                    <FinosIcon name={pool.icon} size={18} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#013D7C] dark:text-white truncate tracking-[-0.01em]">{pool.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{formatPercent(pool.allocationPercentage)} allocation</p>
                </div>
                <span className="text-[13px] font-bold text-[#013D7C] dark:text-white tabular-nums">
                  {formatNaira(pool.balance)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
