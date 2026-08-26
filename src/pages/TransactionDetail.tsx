import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatNaira, formatDate, formatTime } from '../lib/utils'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'
import { EmptyState } from '../components/ui/EmptyState'

const statusConfig: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  completed: { label: 'Completed', icon: 'check-circle', color: 'text-[#2E7D32]', bg: 'bg-[#E8F5E9]' },
  pending: { label: 'Pending', icon: 'clock', color: 'text-[#E65100]', bg: 'bg-[#FFF8E1]' },
  processing: { label: 'Processing', icon: 'loader', color: 'text-[#1565C0]', bg: 'bg-[#E3F2FD]' },
  failed: { label: 'Failed', icon: 'x-circle', color: 'text-[#C62828]', bg: 'bg-[#FFEBEE]' },
}

const typeLabels: Record<string, string> = {
  income: 'Income',
  expense: 'Expense',
  allocation: 'Allocation',
  transfer: 'Transfer',
  withdrawal: 'Withdrawal',
}

const sourceLabels: Record<string, string> = {
  salary: 'Salary',
  freelance: 'Freelance',
  business: 'Business',
  investment: 'Investment',
  gift: 'Gift',
  other: 'Other',
}

export default function TransactionDetail() {
  const { transactionId } = useParams<{ transactionId: string }>()
  const navigate = useNavigate()
  const transactions = useStore((s) => s.transactions)

  const txn = transactions.find((t) => t.id === transactionId)

  if (!txn) {
    return (
      <PageContainer>
        <Header title="Transaction" showBack />
        <EmptyState
          icon="receipt"
          title="Transaction not found"
          description="This transaction does not exist or has been removed."
        />
      </PageContainer>
    )
  }

  const isCredit = txn.type === 'income'
  const status = statusConfig[txn.status]
  const relatedIncome = txn.relatedIncomeId
    ? transactions.find((t) => t.id === txn.relatedIncomeId)
    : null

  return (
    <PageContainer>
      <Header title="Transaction" showBack />

      <div className="pt-4 space-y-4">
        {/* Amount header */}
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-6 text-center animate-fade-in">
          <p className={`text-[32px] font-bold tracking-[-0.03em] tabular-nums ${isCredit ? 'text-[#2E7D32]' : 'text-[#013D7C] dark:text-white'}`}>
            {isCredit ? '+' : txn.type === 'allocation' ? '' : '-'}{formatNaira(txn.amount)}
          </p>
          <p className="text-[13px] text-gray-400 font-medium mt-1">{txn.description}</p>
          <div className="flex items-center justify-center mt-3">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-[8px] ${status.color} ${status.bg}`}>
              <FinosIcon name={status.icon} size={12} />
              {status.label}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] overflow-hidden animate-fade-in" style={{ animationDelay: '80ms' }}>
          <div className="px-5 pt-4 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Details</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            <DetailRow label="Type" value={typeLabels[txn.type] || txn.type} />
            {txn.category && <DetailRow label="Category" value={txn.category} />}
            {txn.poolName && (
              <DetailRow
                label="Pool"
                value={txn.poolName}
                onClick={() => txn.poolId && navigate(`/pool/${txn.poolId}`)}
              />
            )}
            {txn.source && <DetailRow label="Source" value={sourceLabels[txn.source] || txn.source} />}
            {txn.merchant && <DetailRow label="Merchant" value={txn.merchant} />}
            {txn.reason && <DetailRow label="Reason" value={txn.reason} />}
            {txn.note && <DetailRow label="Note" value={txn.note} />}
          </div>
        </div>

        {/* Info */}
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] overflow-hidden animate-fade-in" style={{ animationDelay: '160ms' }}>
          <div className="px-5 pt-4 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Info</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            <DetailRow label="Date" value={formatDate(txn.date)} />
            <DetailRow label="Time" value={formatTime(txn.time)} />
            <DetailRow label="Reference" value={txn.reference} />
          </div>
        </div>

        {/* Related income */}
        {relatedIncome && (
          <div className="animate-fade-in" style={{ animationDelay: '240ms' }}>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Related Income
            </h3>
            <button
              onClick={() => navigate(`/transaction/${relatedIncome.id}`)}
              className="w-full bg-white dark:bg-[#1A2332] rounded-[16px] p-4 text-left active:bg-gray-50 dark:active:bg-gray-800 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#E8F5E9] shrink-0">
                  <FinosIcon name="arrow-down-left" size={16} className="text-[#2E7D32]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#013D7C] dark:text-white">{relatedIncome.description}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{relatedIncome.reference}</p>
                </div>
                <span className="text-[13px] font-bold text-[#2E7D32] tabular-nums">
                  +{formatNaira(relatedIncome.amount)}
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

function DetailRow({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-3.5 ${onClick ? 'active:bg-gray-50 dark:active:bg-gray-800 cursor-pointer' : ''} transition-colors duration-150`}
      onClick={onClick}
    >
      <span className="text-[12px] text-gray-400 font-medium">{label}</span>
      <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white text-right max-w-[60%] break-words">
        {value}
        {onClick && <FinosIcon name="chevron-right" size={14} className="text-gray-300 dark:text-gray-600 ml-1 inline" />}
      </span>
    </div>
  )
}
