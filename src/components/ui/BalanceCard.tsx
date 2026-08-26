import { useStore } from '../../store/useStore'
import { formatNaira } from '../../lib/utils'
import { FinosIcon } from '../icons/FinosIcons'

export function BalanceCard() {
  const balanceHidden = useStore((s) => s.balanceHidden)
  const toggleBalance = useStore((s) => s.toggleBalance)
  const getTotalBalance = useStore((s) => s.getTotalBalance)
  const getAvailableBalance = useStore((s) => s.getAvailableBalance)
  const getReservedBalance = useStore((s) => s.getReservedBalance)

  const total = getTotalBalance()
  const available = getAvailableBalance()
  const reserved = getReservedBalance()

  const masked = '****'

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#013D7C] px-6 pt-7 pb-6 text-white">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/[0.03]" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#1E3A7A]/30" />
      <div className="absolute top-0 right-0 w-[1px] h-32 bg-gradient-to-b from-white/10 to-transparent" />

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-white/40 font-medium tracking-wide uppercase">Total Balance</span>
          <button
            onClick={toggleBalance}
            className="flex items-center justify-center w-8 h-8 -mr-2 rounded-xl text-white/30 hover:text-white/60 active:bg-white/5 transition-all duration-200"
            aria-label={balanceHidden ? 'Show balance' : 'Hide balance'}
          >
            <FinosIcon name={balanceHidden ? 'eye-off' : 'eye'} size={16} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-[36px] font-bold tracking-[-0.03em] tabular-nums leading-none">
            {balanceHidden ? masked : formatNaira(total)}
          </p>
        </div>

        <div className="flex gap-2.5">
          <div className="flex-1 bg-white/[0.06] rounded-2xl px-4 py-3.5">
            <span className="text-[10px] text-white/30 font-medium block mb-1 tracking-wide uppercase">Available</span>
            <p className="text-[14px] font-bold tabular-nums tracking-[-0.01em]">
              {balanceHidden ? masked : formatNaira(available)}
            </p>
          </div>
          <div className="flex-1 bg-white/[0.06] rounded-2xl px-4 py-3.5">
            <span className="text-[10px] text-white/30 font-medium block mb-1 tracking-wide uppercase">Reserved</span>
            <p className="text-[14px] font-bold tabular-nums tracking-[-0.01em]">
              {balanceHidden ? masked : formatNaira(reserved)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
