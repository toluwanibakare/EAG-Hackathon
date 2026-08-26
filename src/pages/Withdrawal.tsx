import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatNaira, generateId } from '../lib/utils'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { AmountInput } from '../components/ui/AmountInput'
import { FinosIcon } from '../components/icons/FinosIcons'

type Step = 'select-pool' | 'enter-amount' | 'enter-destination' | 'confirm' | 'processing' | 'success' | 'failed'

export default function Withdrawal() {
  const navigate = useNavigate()
  const { pools, addTransaction } = useStore()

  const [step, setStep] = useState<Step>('select-pool')
  const [selectedPoolId, setSelectedPoolId] = useState('')
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')
  const [destinationName, setDestinationName] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const numAmount = parseFloat(amount) || 0
  const selectedPool = pools.find((p) => p.id === selectedPoolId)
  const availablePools = pools.filter((p) => p.restriction === 'available' && p.balance > 0 && !p.parentId)

  const handleSelectPool = (poolId: string) => {
    setSelectedPoolId(poolId)
    setStep('enter-amount')
  }

  const handleAmountConfirm = () => {
    if (!selectedPool) return
    if (numAmount <= 0) {
      setError('Enter a valid amount')
      return
    }
    if (numAmount > selectedPool.balance) {
      setError('Insufficient balance')
      return
    }
    if (selectedPool.requiresReason && reason.trim().length === 0) {
      setError('A reason is required for this pool')
      return
    }
    setError('')
    setStep('enter-destination')
  }

  const handleDestinationConfirm = () => {
    if (!destination.trim()) {
      setError('Enter a destination')
      return
    }
    setError('')
    setStep('confirm')
  }

  const handleConfirm = async () => {
    setStep('processing')
    await new Promise((r) => setTimeout(r, 2000))

    const success = Math.random() > 0.1
    if (success) {
      addTransaction({
        id: generateId(),
        type: 'withdrawal',
        amount: numAmount,
        description: `Withdrawal to ${destinationName || destination}`,
        poolId: selectedPool?.id,
        poolName: selectedPool?.name,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        status: 'completed',
        reference: `WDW-${Date.now()}`,
        reason: reason.trim() || undefined,
      })
      setStep('success')
    } else {
      setStep('failed')
    }
  }

  const handleBack = () => {
    if (step === 'enter-amount') setStep('select-pool')
    else if (step === 'enter-destination') setStep('enter-amount')
    else if (step === 'confirm') setStep('enter-destination')
  }

  return (
    <PageContainer>
      <Header
        title={
          step === 'processing' ? 'Processing' :
          step === 'success' ? 'Successful' :
          step === 'failed' ? 'Failed' :
          'Withdrawal'
        }
        showBack
        onBack={step === 'processing' ? undefined : handleBack}
      />

      <div className="pt-6 space-y-6">
        {step === 'select-pool' && (
          <div className="animate-fade-in">
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white mb-1 tracking-[-0.01em]">Select a pool</p>
            <p className="text-[12px] text-gray-400 font-medium mb-4">Choose where to withdraw from</p>
            <div className="space-y-2">
              {availablePools.map((pool) => (
                <button
                  key={pool.id}
                  onClick={() => handleSelectPool(pool.id)}
                  className="flex items-center gap-3 w-full p-4 bg-white dark:bg-[#1A2332] rounded-[16px] active:scale-[0.98] transition-all duration-200"
                >
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-[14px] shrink-0"
                    style={{ backgroundColor: pool.color + '10' }}
                  >
                    <span style={{ color: pool.color }}>
                      <FinosIcon name={pool.icon} size={20} />
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-bold text-[#013D7C] dark:text-white">{pool.name}</p>
                  </div>
                  <span className="text-[14px] font-bold text-[#013D7C] dark:text-white tabular-nums">{formatNaira(pool.balance)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'enter-amount' && (
          <div className="animate-fade-in">
            <p className="text-[11px] text-gray-400 font-medium text-center mb-1 uppercase tracking-wide">Withdrawing from {selectedPool?.name}</p>
            <AmountInput value={amount} onChange={(v) => { setAmount(v); setError('') }} autoFocus />
            <p className="text-center text-[12px] text-gray-400 font-medium mt-2">Available: {formatNaira(selectedPool?.balance || 0)}</p>
            {error && (
              <p className="text-center text-[12px] text-[#C62828] font-semibold mt-2">{error}</p>
            )}
            {selectedPool?.requiresReason && (
              <div className="mt-6">
                <label className="text-[10px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Reason <span className="text-[#C62828]">*</span></label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setError('') }}
                  placeholder="Enter reason for withdrawal"
                  className="w-full bg-white dark:bg-[#1A2332] rounded-[12px] px-4 py-3 text-[13px] text-[#013D7C] dark:text-white outline-none border border-gray-100 dark:border-gray-700/50 focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                />
              </div>
            )}
            <button
              onClick={handleAmountConfirm}
              disabled={numAmount <= 0}
              className="w-full mt-6 bg-[#013D7C] text-white text-[14px] font-bold py-3.5 rounded-[14px] active:scale-[0.98] transition-all duration-200 disabled:opacity-30"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'enter-destination' && (
          <div className="animate-fade-in space-y-4">
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white mb-1 tracking-[-0.01em]">Destination</p>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Bank Account or Wallet</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setError('') }}
                placeholder="e.g. 0123456789 - GTBank"
                className="w-full bg-white dark:bg-[#1A2332] rounded-[12px] px-4 py-3 text-[13px] text-[#013D7C] dark:text-white outline-none border border-gray-100 dark:border-gray-700/50 focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Recipient Name (optional)</label>
              <input
                type="text"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                placeholder="e.g. Toluwani"
                className="w-full bg-white dark:bg-[#1A2332] rounded-[12px] px-4 py-3 text-[13px] text-[#013D7C] dark:text-white outline-none border border-gray-100 dark:border-gray-700/50 focus:border-gray-300 dark:focus:border-gray-600 transition-colors duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600"
              />
            </div>
            {error && <p className="text-[12px] text-[#C62828] font-semibold">{error}</p>}
            <button
              onClick={handleDestinationConfirm}
              className="w-full bg-[#013D7C] text-white text-[14px] font-bold py-3.5 rounded-[14px] active:scale-[0.98] transition-all duration-200"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-5">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">Withdrawal Summary</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400 font-medium">Amount</span>
                  <span className="text-[15px] font-bold text-[#013D7C] dark:text-white tabular-nums">{formatNaira(numAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400 font-medium">From Pool</span>
                  <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white">{selectedPool?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-400 font-medium">Destination</span>
                  <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white text-right max-w-[60%] break-words">{destination}</span>
                </div>
                {destinationName && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-400 font-medium">Recipient</span>
                    <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white">{destinationName}</span>
                  </div>
                )}
                {reason && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-400 font-medium">Reason</span>
                    <span className="text-[13px] font-semibold text-[#013D7C] dark:text-white text-right max-w-[60%] break-words">{reason}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 dark:border-gray-700/50 pt-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Remaining</span>
                  <span className="text-[13px] font-bold text-[#013D7C] dark:text-white tabular-nums">
                    {formatNaira((selectedPool?.balance || 0) - numAmount)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full bg-[#013D7C] text-white text-[14px] font-bold py-3.5 rounded-[14px] active:scale-[0.98] transition-all duration-200"
            >
              Confirm Withdrawal
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <FinosIcon name="loader" size={28} className="text-[#013D7C] dark:text-white animate-spin" />
            </div>
            <p className="text-[14px] font-bold text-[#013D7C] dark:text-white">Processing your withdrawal</p>
            <p className="text-[12px] text-gray-400 font-medium mt-1">Please wait...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-4">
              <FinosIcon name="check-circle" size={32} className="text-[#2E7D32]" />
            </div>
            <p className="text-[16px] font-bold text-[#013D7C] dark:text-white">Withdrawal Successful</p>
            <p className="text-[13px] text-gray-400 font-medium mt-1">
              {formatNaira(numAmount)} sent to {destinationName || destination}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-8 w-full max-w-[280px] bg-[#013D7C] text-white text-[14px] font-bold py-3.5 rounded-[14px] active:scale-[0.98] transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        )}

        {step === 'failed' && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#FFEBEE] flex items-center justify-center mb-4">
              <FinosIcon name="x-circle" size={32} className="text-[#C62828]" />
            </div>
            <p className="text-[16px] font-bold text-[#013D7C] dark:text-white">Withdrawal Failed</p>
            <p className="text-[13px] text-gray-400 font-medium mt-1">Something went wrong. Please try again.</p>
            <div className="flex gap-3 mt-8 w-full max-w-[280px]">
              <button
                onClick={() => { setStep('confirm'); setError('') }}
                className="flex-1 bg-[#013D7C] text-white text-[13px] font-bold py-3 rounded-[12px] active:scale-[0.98] transition-all duration-200"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-white dark:bg-[#1A2332] text-gray-600 dark:text-gray-400 text-[13px] font-bold py-3 rounded-[12px] border border-gray-200 dark:border-gray-700/50 active:bg-gray-50 dark:active:bg-gray-800 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
