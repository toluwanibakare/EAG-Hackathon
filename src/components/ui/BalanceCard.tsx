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
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#013D7C] via-[#0256B0] to-[#012A5E] dark:from-[#E8B931] dark:via-[#F1D06A] dark:to-[#B68C1C] px-6 pt-7 pb-6 text-white dark:text-[#013D7C] shadow-xl shadow-[#013D7C]/20 dark:shadow-[#E8B931]/20">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/[0.08] dark:bg-black/[0.05] blur-2xl" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#1E3A7A]/30 dark:bg-white/[0.15] blur-xl" />
      <div className="absolute top-0 right-0 w-full h-full bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-white/70 dark:text-[#013D7C]/70 font-semibold tracking-wide uppercase">Total Balance</span>
          <button
            onClick={toggleBalance}
            className="flex items-center justify-center w-8 h-8 -mr-2 rounded-xl text-white/50 dark:text-[#013D7C]/50 hover:text-white dark:hover:text-[#013D7C] active:bg-white/10 dark:active:bg-black/5 transition-all duration-200"
            aria-label={balanceHidden ? 'Show balance' : 'Hide balance'}
          >
            <FinosIcon name={balanceHidden ? 'eye-off' : 'eye'} size={16} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-[40px] font-extrabold tracking-tight tabular-nums leading-none">
            {balanceHidden ? masked : formatNaira(total)}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-white/[0.1] dark:bg-black/[0.06] backdrop-blur-md rounded-[20px] px-4 py-3.5 border border-white/[0.05] dark:border-black/[0.05]">
            <span className="text-[10px] text-white/70 dark:text-[#013D7C]/70 font-bold block mb-1 tracking-wider uppercase">Available</span>
            <p className="text-[15px] font-extrabold tabular-nums tracking-tight">
              {balanceHidden ? masked : formatNaira(available)}
            </p>
          </div>
          <div className="flex-1 bg-white/[0.1] dark:bg-black/[0.06] backdrop-blur-md rounded-[20px] px-4 py-3.5 border border-white/[0.05] dark:border-black/[0.05]">
            <span className="text-[10px] text-white/70 dark:text-[#013D7C]/70 font-bold block mb-1 tracking-wider uppercase">Reserved</span>
            <p className="text-[15px] font-extrabold tabular-nums tracking-tight">
              {balanceHidden ? masked : formatNaira(reserved)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
