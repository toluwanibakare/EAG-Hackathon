import type { PoolAllocationResult } from '../../types'

interface AllocationCardProps {
  allocation: PoolAllocationResult
  onConfirm?: () => void
  onEdit?: () => void
}

export function AllocationCard({ allocation, onConfirm, onEdit }: AllocationCardProps) {
  return (
    <div className="bg-white dark:bg-[#1A2332] rounded-[16px] border border-gray-100 dark:border-gray-700/50 overflow-hidden mt-2">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Allocation Split</span>
      </div>

      <div className="p-4 space-y-3">
        {allocation.pools.map((pool, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-bold text-[#013D7C] dark:text-white truncate">{pool.name}</span>
                <span className="text-[13px] font-bold text-[#013D7C] dark:text-white tabular-nums ml-2">{pool.percentage}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pool.percentage}%`, backgroundColor: pool.color }}
                />
              </div>
              {pool.amount != null && (
                <span className="text-[11px] text-gray-400 font-medium mt-1 block">${pool.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-t border-gray-100 dark:border-gray-700/50">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 py-3 text-[13px] font-bold text-gray-400 active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors duration-150"
          >
            Edit
          </button>
        )}
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-[13px] font-bold text-[#013D7C] dark:text-[#E8B931] active:bg-gray-50 dark:active:bg-gray-800/50 transition-colors duration-150 border-l border-gray-100 dark:border-gray-700/50"
          >
            Apply to Vault
          </button>
        )}
      </div>
    </div>
  )
}
