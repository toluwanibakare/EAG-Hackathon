import type { Transaction } from '../../types'
import { formatNaira, formatDateShort } from '../../lib/utils'
import { FinosIcon } from '../icons/FinosIcons'

interface TransactionRowProps {
  transaction: Transaction
  onClick?: (txn: Transaction) => void
}

const typeConfig: Record<string, { icon: string; sign: string; color: string; bg: string }> = {
  income: { icon: 'arrow-down-left', sign: '+', color: 'text-[#2E7D32]', bg: 'bg-[#E8F5E9]' },
  expense: { icon: 'arrow-up-right', sign: '-', color: 'text-[#C62828]', bg: 'bg-[#FFEBEE]' },
  allocation: { icon: 'shuffle', sign: '', color: 'text-[#1565C0]', bg: 'bg-[#E3F2FD]' },
  transfer: { icon: 'arrow-left-right', sign: '', color: 'text-gray-500', bg: 'bg-gray-100' },
  withdrawal: { icon: 'arrow-up-right', sign: '-', color: 'text-[#C62828]', bg: 'bg-[#FFEBEE]' },
}

export function TransactionRow({ transaction, onClick }: TransactionRowProps) {
  const config = typeConfig[transaction.type] || typeConfig.expense
  const isCredit = transaction.type === 'income'
  const amountColor = isCredit ? 'text-[#2E7D32]' : 'text-[#013D7C]'

  return (
    <button
      onClick={() => onClick?.(transaction)}
      className="flex items-center gap-3 w-full bg-white dark:bg-[#1A2332] py-3.5 px-1 text-left transition-colors duration-150 active:bg-gray-50 dark:active:bg-gray-800"
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-[12px] shrink-0 ${config.bg}`}>
        <FinosIcon name={config.icon} size={17} className={config.color} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#013D7C] dark:text-white truncate tracking-[-0.01em]">
          {transaction.description}
        </p>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
          {transaction.poolName || transaction.category || formatDateShort(transaction.date)}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-[14px] font-bold tabular-nums tracking-[-0.01em] ${amountColor}`}>
          {config.sign}{formatNaira(transaction.amount)}
        </p>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
          {formatDateShort(transaction.date)}
        </p>
      </div>
    </button>
  )
}
