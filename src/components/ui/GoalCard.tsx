import type { SavingsGoal } from '../../types'
import { formatNaira, getProgressPercent, getEstimatedCompletion } from '../../lib/utils'
import { ProgressIndicator } from './ProgressIndicator'

interface GoalCardProps {
  goal: SavingsGoal
  onClick?: (goal: SavingsGoal) => void
}

const stateConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'text-[#2E7D32]' },
  completed: { label: 'Done', className: 'text-[#1565C0]' },
  paused: { label: 'Paused', className: 'text-[#E65100]' },
  cancelled: { label: 'Cancelled', className: 'text-gray-400' },
}

const stateColors: Record<string, string> = {
  active: '#013D7C',
  completed: '#2E7D32',
  paused: '#E65100',
  cancelled: '#9CA3AF',
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const percent = getProgressPercent(goal.currentAmount, goal.targetAmount)
  const stateInfo = stateConfig[goal.state]
  const color = stateColors[goal.state]
  const estimated = getEstimatedCompletion(goal.currentAmount, goal.targetAmount, goal.contributionRate)

  return (
    <button
      onClick={() => onClick?.(goal)}
      className="w-full bg-white dark:bg-[#1A2332] rounded-[20px] px-5 py-5 text-left transition-all duration-200 active:scale-[0.97]"
    >
      <div className="flex items-start justify-between mb-3.5">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-[#013D7C] dark:text-white truncate tracking-[-0.01em]">{goal.name}</h3>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
            Target: {formatNaira(goal.targetAmount)}
          </p>
        </div>
        <span className={`text-[10px] font-bold tracking-wide uppercase ${stateInfo.className}`}>
          {stateInfo.label}
        </span>
      </div>

      <ProgressIndicator percent={percent} color={color} height={6} className="mb-3.5" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[16px] font-bold text-[#013D7C] dark:text-white tabular-nums tracking-[-0.02em]">{formatNaira(goal.currentAmount)}</p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">{percent}% saved</p>
        </div>
        <div className="text-right">
          {goal.deadline && (
            <p className="text-[11px] text-gray-400 font-medium">
              {goal.state === 'completed' ? 'Completed' : `Est. ${estimated}`}
            </p>
          )}
          <p className="text-[11px] text-gray-400 font-medium">
            {formatNaira(goal.contributionRate)}/mo
          </p>
        </div>
      </div>
    </button>
  )
}
