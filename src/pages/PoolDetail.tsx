import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatNaira, formatPercent } from '../lib/utils'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'
import { TransactionRow } from '../components/ui/TransactionRow'
import { EmptyState } from '../components/ui/EmptyState'

export default function PoolDetail() {
  const { poolId } = useParams<{ poolId: string }>()
  const navigate = useNavigate()
  const pools = useStore((s) => s.pools)
  const transactions = useStore((s) => s.transactions)
  const goals = useStore((s) => s.goals)
  const getSubPools = useStore((s) => s.getSubPools)

  const pool = pools.find((p) => p.id === poolId)

  if (!pool) {
    return (
      <PageContainer>
        <Header title="Pool" showBack />
        <EmptyState
          icon="alert-circle"
          title="Pool not found"
          description="This pool does not exist or has been removed."
        />
      </PageContainer>
    )
  }

  const subPools = getSubPools(pool.id)
  const poolTxns = transactions.filter((t) => t.poolId === pool.id).slice(0, 10)
  const linkedGoal = goals.find((g) => g.poolId === pool.id)
  const isRestricted = pool.restriction !== 'available'

  return (
    <PageContainer>
      <Header title={pool.name} showBack />

      <div className="pt-4 space-y-5">
        {/* Pool header */}
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-5 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-[16px] shrink-0"
              style={{ backgroundColor: pool.color + '10' }}
            >
              <span style={{ color: pool.color }}>
                <FinosIcon name={pool.icon} size={28} />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-bold text-[#013D7C] dark:text-white tracking-[-0.02em]">{pool.name}</h2>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                {formatPercent(pool.allocationPercentage)} of income
              </p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Balance</p>
            <p className="text-[28px] font-bold text-[#013D7C] dark:text-white tracking-[-0.03em] tabular-nums">
              {formatNaira(pool.balance)}
            </p>
          </div>
        </div>

        {/* Restriction notice */}
        {isRestricted && (
          <div
            className="bg-[#FFF8E1] rounded-[16px] p-4 animate-fade-in"
            style={{ animationDelay: '60ms' }}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-[#FFF3E0] shrink-0 mt-0.5">
                <FinosIcon name="alert-circle" size={16} className="text-[#E65100]" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#E65100]">Restricted Pool</p>
                <p className="text-[12px] text-[#BF360C] mt-0.5 leading-relaxed font-medium">
                  {pool.restrictionMessage || 'This pool has withdrawal restrictions.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Linked goal */}
        {linkedGoal && (
          <div
            className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4 animate-fade-in"
            style={{ animationDelay: '120ms' }}
          >
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Linked Goal</p>
            <button
              onClick={() => navigate(`/goal/${linkedGoal.id}`)}
              className="flex items-center gap-3 w-full text-left"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#E3F2FD] shrink-0">
                <FinosIcon name="target" size={16} className="text-[#1565C0]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-[#013D7C] dark:text-white">{linkedGoal.name}</p>
                <p className="text-[11px] text-gray-400 font-medium">
                  {formatNaira(linkedGoal.currentAmount)} / {formatNaira(linkedGoal.targetAmount)}
                </p>
              </div>
              <FinosIcon name="chevron-right" size={16} className="text-gray-300 dark:text-gray-600" />
            </button>
          </div>
        )}

        {/* Sub-pools */}
        {subPools.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '180ms' }}>
            <h3 className="text-[13px] font-bold text-[#013D7C] dark:text-white mb-3 tracking-[-0.01em]">Sub-Pools</h3>
            <div className="bg-white dark:bg-[#1A2332] rounded-[20px] overflow-hidden">
              {subPools.map((sub, index) => (
                <button
                  key={sub.id}
                  onClick={() => navigate(`/pool/${sub.id}`)}
                  className={`flex items-center gap-3 w-full px-4 py-3.5 text-left active:bg-gray-50 dark:active:bg-gray-800 transition-colors duration-150 ${
                    index > 0 ? 'border-t border-gray-50 dark:border-gray-700/50' : ''
                  }`}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-[12px] shrink-0"
                    style={{ backgroundColor: sub.color + '10' }}
                  >
                    <span style={{ color: sub.color }}>
                      <FinosIcon name={sub.icon} size={20} />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#013D7C] dark:text-white truncate">{sub.name}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{formatNaira(sub.balance)}</p>
                  </div>
                  {sub.restriction !== 'available' && (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FFF3E0] shrink-0">
                      <FinosIcon name="alert-circle" size={12} className="text-[#E65100]" />
                    </div>
                  )}
                  <FinosIcon name="chevron-right" size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Transactions */}
        <div className="animate-fade-in" style={{ animationDelay: subPools.length > 0 ? '240ms' : '180ms' }}>
          <h3 className="text-[13px] font-bold text-[#013D7C] dark:text-white mb-3 tracking-[-0.01em]">Transactions</h3>
          {poolTxns.length === 0 ? (
            <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-8 text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-gray-50 dark:bg-gray-800 mx-auto mb-3">
                <FinosIcon name="receipt" size={18} className="text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-[13px] text-gray-400 font-medium">No transactions for this pool yet.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1A2332] rounded-[20px] divide-y divide-gray-100 dark:divide-gray-700/50 overflow-hidden">
              {poolTxns.map((txn) => (
                <TransactionRow
                  key={txn.id}
                  transaction={txn}
                  onClick={() => navigate(`/transaction/${txn.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
