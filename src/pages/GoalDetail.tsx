import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import {
  formatNaira,
  formatDate,
  getProgressPercent,
  getEstimatedCompletion,
} from '../lib/utils'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { ProgressIndicator } from '../components/ui/ProgressIndicator'
import { EmptyState } from '../components/ui/EmptyState'
import { FinosIcon } from '../components/icons/FinosIcons'

const stateConfig: Record<string, { label: string; color: string; textColor: string }> = {
  active: { label: 'Active', color: '#013D7C', textColor: 'text-[#2E7D32]' },
  completed: { label: 'Completed', color: '#2E7D32', textColor: 'text-[#1565C0]' },
  paused: { label: 'Paused', color: '#E65100', textColor: 'text-[#E65100]' },
  cancelled: { label: 'Cancelled', color: '#9CA3AF', textColor: 'text-gray-400' },
}

export default function GoalDetail() {
  const { goalId } = useParams<{ goalId: string }>()
  const navigate = useNavigate()
  const goals = useStore((s) => s.goals)
  const transactions = useStore((s) => s.transactions)

  const goal = goals.find((g) => g.id === goalId)

  if (!goal) {
    return (
      <PageContainer>
        <Header title="Goal" showBack />
        <EmptyState
          icon="target"
          title="Goal not found"
          description="This goal does not exist or has been removed."
        />
      </PageContainer>
    )
  }

  const percent = getProgressPercent(goal.currentAmount, goal.targetAmount)
  const stateInfo = stateConfig[goal.state]
  const estimated = getEstimatedCompletion(
    goal.currentAmount,
    goal.targetAmount,
    goal.contributionRate
  )
  const remaining = goal.targetAmount - goal.currentAmount
  const goalTransactions = transactions.filter((t) => t.poolId === goal.poolId).slice(0, 10)

  return (
    <PageContainer>
      <Header title={goal.name} showBack />

      <div className="pt-4 space-y-4">
        {/* Goal header */}
        <div className="bg-[#013D7C] rounded-[24px] p-6 text-white relative overflow-hidden animate-fade-in">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/[0.03]" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#1E3A7A]/30" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] text-white/40 font-medium tracking-wide uppercase">Progress</p>
                <p className="text-[28px] font-bold tracking-[-0.03em] tabular-nums mt-0.5">{percent}%</p>
              </div>
              <span className={`text-[10px] font-bold tracking-wide uppercase ${stateInfo.textColor}`}>
                {stateInfo.label}
              </span>
            </div>
            <ProgressIndicator
              percent={percent}
              color={stateInfo.color}
              height={8}
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-[10px] text-white/30 font-medium tracking-wide uppercase">Saved</p>
                <p className="text-[15px] font-bold tabular-nums">{formatNaira(goal.currentAmount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/30 font-medium tracking-wide uppercase">Target</p>
                <p className="text-[15px] font-bold tabular-nums">{formatNaira(goal.targetAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 animate-fade-in" style={{ animationDelay: '80ms' }}>
          <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4">
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mb-1">Remaining</p>
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tabular-nums tracking-[-0.01em]">
              {remaining > 0 ? formatNaira(remaining) : 'Achieved'}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4">
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mb-1">Monthly Rate</p>
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tabular-nums tracking-[-0.01em]">
              {formatNaira(goal.contributionRate)}/mo
            </p>
          </div>
          <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4">
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mb-1">Est. Completion</p>
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tracking-[-0.01em]">
              {goal.state === 'completed' ? 'Completed' : estimated}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4">
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mb-1">Created</p>
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white tracking-[-0.01em]">{formatDate(goal.createdAt)}</p>
          </div>
        </div>

        {/* Deadline */}
        {goal.deadline && (
          <div className="bg-white dark:bg-[#1A2332] rounded-[16px] p-4 flex items-center gap-3 animate-fade-in" style={{ animationDelay: '160ms' }}>
            <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#E3F2FD] shrink-0">
              <FinosIcon name="calendar" size={16} className="text-[#1565C0]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Deadline</p>
              <p className="text-[13px] font-bold text-[#013D7C] dark:text-white">{formatDate(goal.deadline)}</p>
            </div>
          </div>
        )}

        {/* Recent activity */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-[13px] font-bold text-[#013D7C] dark:text-white mb-3 tracking-[-0.01em]">Recent Activity</h3>
          {goalTransactions.length === 0 ? (
            <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-8 text-center">
              <p className="text-[13px] text-gray-400 font-medium">No transactions linked to this goal yet.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1A2332] rounded-[20px] overflow-hidden">
              {goalTransactions.map((txn) => (
                <button
                  key={txn.id}
                  onClick={() => navigate(`/transaction/${txn.id}`)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left border-b border-gray-50 dark:border-gray-700/50 last:border-0 active:bg-gray-50 dark:active:bg-gray-800 transition-colors duration-150"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#013D7C] dark:text-white truncate">{txn.description}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{formatDate(txn.date)}</p>
                  </div>
                  <span className="text-[12px] font-bold text-[#013D7C] dark:text-white tabular-nums">
                    {formatNaira(txn.amount)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
