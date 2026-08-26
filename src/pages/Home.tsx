import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { userProfile } from '../data/mockData'
import { getGreeting, formatNaira, getProgressPercent } from '../lib/utils'
import { PageContainer } from '../components/layout/PageContainer'
import { BalanceCard } from '../components/ui/BalanceCard'
import { QuickAction } from '../components/ui/QuickAction'
import { PoolCard } from '../components/ui/PoolCard'
import { SwipeableCard } from '../components/ui/SwipeableCard'
import { TransactionRow } from '../components/ui/TransactionRow'
import { FinosIcon } from '../components/icons/FinosIcons'
import { PullToRefresh } from '../components/ui/PullToRefresh'

export default function Home() {
  const navigate = useNavigate()
  const darkMode = useStore((s) => s.darkMode)
  const pools = useStore((s) => s.pools)
  const transactions = useStore((s) => s.transactions)
  const goals = useStore((s) => s.goals)
  const removePool = useStore((s) => s.removePool)
  const recentTxns = transactions.slice(0, 3)
  const activeGoals = goals.filter((g) => g.state === 'active').slice(0, 2)
  const topLevelPools = pools.filter((p) => !p.parentId)

  return (
    <PageContainer padded={false}>
      <PullToRefresh onRefresh={() => Promise.resolve()}>
        <div className="sticky top-0 z-40 bg-[#F7F8FB] dark:bg-[#0B1320] overflow-hidden" style={{ height: '88px' }}>
          <div className="flex justify-center items-end h-full pb-1">
            <img src={darkMode ? "/logo_white.PNG" : "/logo.PNG"} alt="RUNDA" className="w-[100px] h-[100px] rounded-[22px] object-contain" />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-2">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#013D7C] dark:bg-[#E8B931] active:scale-95 transition-all duration-150 shrink-0"
            >
              <FinosIcon name="user" size={16} className="text-white dark:text-[#013D7C]" />
            </button>
            <div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">{getGreeting()}</p>
              <p className="text-[17px] font-bold text-[#013D7C] dark:text-white tracking-[-0.02em] leading-none">{userProfile.name}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors duration-150"
          >
            <FinosIcon name="bell" size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <section className="px-4 animate-fade-in" style={{ animationDelay: '0ms' }}>
          <BalanceCard />
        </section>

        <section className="mt-7 px-4 animate-fade-in" style={{ animationDelay: '80ms' }}>
          <div className="grid grid-cols-4 gap-2">
            <QuickAction icon="arrow-down-left" label="Income" onClick={() => navigate('/add-income')} />
            <QuickAction icon="arrow-up-right" label="Expense" onClick={() => navigate('/add-expense')} />
            <QuickAction icon="arrow-left-right" label="Transfer" onClick={() => navigate('/withdrawal')} />
            <QuickAction icon="shuffle" label="Allocate" onClick={() => navigate('/allocation-policy')} />
          </div>
        </section>

        <section className="mt-8 px-4 animate-fade-in" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-[#013D7C] dark:text-white tracking-[-0.01em]">Pools</h2>
            <button onClick={() => navigate('/money')} className="text-[12px] font-bold text-[#013D7C] dark:text-white opacity-40">
              See all
            </button>
          </div>
          <div className="space-y-2.5">
            {topLevelPools.map((pool) => (
              <SwipeableCard
                key={pool.id}
                onEdit={() => navigate(`/pool/${pool.id}`)}
                onDelete={() => removePool(pool.id)}
              >
                <PoolCard pool={pool} onClick={() => navigate(`/pool/${pool.id}`)} />
              </SwipeableCard>
            ))}
          </div>
        </section>

        <section className="mt-8 px-4 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[14px] font-bold text-[#013D7C] dark:text-white tracking-[-0.01em]">Recent Activity</h2>
            <button onClick={() => navigate('/activity')} className="text-[12px] font-bold text-[#013D7C] dark:text-white opacity-40">
              See all
            </button>
          </div>
          <div className="bg-white dark:bg-[#1A2332] rounded-[20px] divide-y divide-gray-100 dark:divide-gray-700/50 overflow-hidden">
            {recentTxns.map((txn) => (
              <TransactionRow key={txn.id} transaction={txn} onClick={() => navigate(`/transaction/${txn.id}`)} />
            ))}
          </div>
        </section>

        {activeGoals.length > 0 && (
          <section className="mt-6 px-4 mb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-bold text-[#013D7C] dark:text-white tracking-[-0.01em]">Goals</h2>
              <button onClick={() => navigate('/goals')} className="text-[12px] font-bold text-[#013D7C] dark:text-white opacity-40">
                See all
              </button>
            </div>
            <div className="space-y-2.5">
              {activeGoals.map((goal) => {
                const percent = getProgressPercent(goal.currentAmount, goal.targetAmount)
                return (
                  <button
                    key={goal.id}
                    onClick={() => navigate(`/goal/${goal.id}`)}
                    className="flex items-center gap-3.5 w-full bg-white dark:bg-[#1A2332] rounded-[16px] px-4 py-3.5 text-left active:scale-[0.98] transition-all duration-200"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-[#013D7C] shrink-0">
                      <FinosIcon name="target" size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-bold text-[#013D7C] dark:text-white truncate">{goal.name}</span>
                        <span className="text-[11px] font-bold text-gray-400 tabular-nums ml-2">{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-[#013D7C] transition-all duration-700" style={{ width: `${percent}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-gray-400 font-medium">{formatNaira(goal.currentAmount)}</span>
                        <span className="text-[10px] text-gray-300 dark:text-gray-600 font-medium">of {formatNaira(goal.targetAmount)}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </PullToRefresh>
    </PageContainer>
  )
}
