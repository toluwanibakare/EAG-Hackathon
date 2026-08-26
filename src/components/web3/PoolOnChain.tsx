import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import { POOL_VAULT_ABI, USDT_ADDRESS, formatUsdt, parseUsdt } from '../../lib/hsk'
import { formatUsd } from '../../lib/currency'

interface PoolOnChainProps {
  poolId: string
  poolName: string
}

export function PoolOnChain({ poolId, poolName }: PoolOnChainProps) {
  const { address, isConnected } = useAccount()
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')

  const { data: balance, refetch } = useReadContract({
    address: USDT_ADDRESS,
    abi: POOL_VAULT_ABI,
    functionName: 'getPoolBalance',
    args: [poolId as `0x${string}`],
    query: { enabled: isConnected },
  })

  const { writeContract, data: txHash, isPending } = useWriteContract()

  const { isLoading: txLoading } = useWaitForTransactionReceipt({ hash: txHash })

  const handleDeposit = () => {
    if (!depositAmount) return
    writeContract({
      address: USDT_ADDRESS,
      abi: POOL_VAULT_ABI,
      functionName: 'deposit',
      args: [poolId as `0x${string}`, parseUsdt(depositAmount)],
    })
    setDepositAmount('')
    setTimeout(() => refetch(), 3000)
  }

  const handleWithdraw = () => {
    if (!withdrawAmount) return
    writeContract({
      address: USDT_ADDRESS,
      abi: POOL_VAULT_ABI,
      functionName: 'withdraw',
      args: [poolId as `0x${string}`, parseUsdt(withdrawAmount)],
    })
    setWithdrawAmount('')
    setTimeout(() => refetch(), 3000)
  }

  if (!isConnected) return null

  const balanceFormatted = balance ? formatUsdt(balance as bigint) : '$0.00'

  return (
    <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{poolName} (On-Chain)</span>
        <span className="text-[16px] font-bold text-[#013D7C] dark:text-white tabular-nums">{balanceFormatted}</span>
      </div>

      <div className="flex gap-2 mt-3">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2">
          <span className="text-[12px] text-gray-400 font-bold">$</span>
          <input
            type="number"
            placeholder="0.00"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="flex-1 bg-transparent text-[14px] font-bold text-[#013D7C] dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 tabular-nums min-w-0"
          />
          <button
            onClick={handleDeposit}
            disabled={!depositAmount || isPending || txLoading}
            className="flex items-center gap-1 bg-green-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg disabled:opacity-40 active:scale-95 transition-all duration-150 shrink-0"
          >
            <ArrowDownToLine size={12} />
            <span>Deposit</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2">
          <span className="text-[12px] text-gray-400 font-bold">$</span>
          <input
            type="number"
            placeholder="0.00"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="flex-1 bg-transparent text-[14px] font-bold text-[#013D7C] dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 tabular-nums min-w-0"
          />
          <button
            onClick={handleWithdraw}
            disabled={!withdrawAmount || isPending || txLoading}
            className="flex items-center gap-1 bg-[#013D7C] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg disabled:opacity-40 active:scale-95 transition-all duration-150 shrink-0"
          >
            <ArrowUpFromLine size={12} />
            <span>Withdraw</span>
          </button>
        </div>
      </div>
    </div>
  )
}
