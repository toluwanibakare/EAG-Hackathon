import type { Pool } from '../../types'
import { formatNaira, formatPercent } from '../../lib/utils'
import { FinosIcon } from '../icons/FinosIcons'

interface PoolCardProps {
  pool: Pool
  onClick?: (pool: Pool) => void
}

export function PoolCard({ pool, onClick }: PoolCardProps) {
  return (
    <button
      onClick={() => onClick?.(pool)}
      className="flex items-center gap-3.5 w-full bg-white dark:bg-[#1A2332] rounded-[20px] px-4 py-4 text-left transition-all duration-200 active:scale-[0.97]"
    >
      <div
        className="flex items-center justify-center w-11 h-11 rounded-[14px] shrink-0"
        style={{ backgroundColor: pool.color + '10' }}
      >
        <span style={{ color: pool.color }}>
          <FinosIcon name={pool.icon} size={20} className="shrink-0" />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-[#013D7C] dark:text-white truncate tracking-[-0.01em]">{pool.name}</span>
        </div>
        <span className="text-[11px] text-gray-400 font-medium mt-0.5 block">
          {formatPercent(pool.allocationPercentage)} allocation
        </span>
      </div>

      <span className="text-[15px] font-bold text-[#013D7C] dark:text-white tabular-nums whitespace-nowrap tracking-[-0.01em]">
        {formatNaira(pool.balance)}
      </span>
    </button>
  )
}
