import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { GoalState } from '../types'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { GoalCard } from '../components/ui/GoalCard'
import { SwipeableCard } from '../components/ui/SwipeableCard'
import { EmptyState } from '../components/ui/EmptyState'

const filterTabs: { key: GoalState | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'paused', label: 'Paused' },
]

export default function Goals() {
  const navigate = useNavigate()
  const goals = useStore((s) => s.goals)
  const updateGoal = useStore((s) => s.updateGoal)
  const [activeFilter, setActiveFilter] = useState<GoalState | 'all'>('all')

  const filtered = activeFilter === 'all'
    ? goals
    : goals.filter((g) => g.state === activeFilter)

  return (
    <PageContainer>
      <Header
        title="Goals"
        rightAction={
          <button
            onClick={() => navigate('/goals/new')}
            className="flex items-center justify-center w-9 h-9 -mr-1 rounded-xl text-[#013D7C] dark:text-white active:bg-black/5 dark:active:bg-white/10 transition-colors duration-150"
          >
            <span className="text-[22px] font-light leading-none">+</span>
          </button>
        }
      />

      <div className="pt-4">
        <div className="flex gap-2 mb-5 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`shrink-0 px-4 py-2 rounded-[10px] text-[12px] font-bold transition-all duration-200 ${
                activeFilter === tab.key
                  ? 'bg-[#013D7C] text-white'
                  : 'bg-white dark:bg-[#1A2332] text-gray-500 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="target"
            title="No goals yet"
            description="Set your first savings goal and start working towards it."
            actionLabel="Create Goal"
            onAction={() => navigate('/goals/new')}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((goal, i) => (
              <div
                key={goal.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <SwipeableCard
                  onEdit={() => navigate(`/goal/${goal.id}`)}
                  onDelete={() => updateGoal(goal.id, { state: 'cancelled' })}
                >
                  <GoalCard goal={goal} onClick={() => navigate(`/goal/${goal.id}`)} />
                </SwipeableCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
