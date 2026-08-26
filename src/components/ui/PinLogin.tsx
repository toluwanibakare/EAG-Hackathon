import { useState, useCallback } from 'react'
import { useStore } from '../../store/useStore'

export function PinLogin() {
  const { pin, setPin, unlock } = useStore()
  const darkMode = useStore((s) => s.darkMode)
  const hasPin = pin.length > 0
  const [digits, setDigits] = useState('')
  const [confirmDigits, setConfirmDigits] = useState('')
  const [error, setError] = useState(false)
  const [confirming, setConfirming] = useState(!hasPin)
  const [success, setSuccess] = useState(false)

  const handleDigit = useCallback((d: string) => {
    if (digits.length >= 4) return
    const next = digits + d
    setDigits(next)
    setError(false)

    if (next.length === 4) {
      if (!hasPin) {
        if (!confirming) {
          if (next === confirmDigits) {
            setPin(next)
            setSuccess(true)
          } else {
            setError(true)
            setTimeout(() => {
              setDigits('')
              setConfirmDigits('')
              setConfirming(true)
              setError(false)
            }, 800)
          }
        } else {
          setConfirmDigits(next)
          setConfirming(false)
          setDigits('')
        }
      } else {
        if (unlock(next)) {
          setSuccess(true)
        } else {
          setError(true)
          setTimeout(() => {
            setDigits('')
            setError(false)
          }, 800)
        }
      }
    }
  }, [digits, confirmDigits, confirming, hasPin, setPin, unlock])

  const handleDelete = useCallback(() => {
    setDigits((d) => d.slice(0, -1))
    setError(false)
  }, [])

  const dots = Array.from({ length: 4 }, (_, i) => i < digits.length)

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-500 ${
      darkMode ? 'bg-[#0B1320]' : 'bg-white'
    }`}>
      <div className={`flex flex-col items-center transition-all duration-500 ${success ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="mb-8">
          <img src={darkMode ? "/logo_white.PNG" : "/logo.PNG"} alt="RUNDA" className="w-[120px] h-[120px] rounded-[28px] object-contain" />
        </div>

        <p className={`text-[14px] font-medium mb-1 animate-fade-in ${
          darkMode ? 'text-white/50' : 'text-gray-500'
        }`}>
          {hasPin ? 'Enter your PIN' : !confirming ? 'Confirm your PIN' : 'Create a 4-digit PIN'}
        </p>

        <div className="flex items-center gap-5 my-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
          {dots.map((filled, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                error
                  ? 'bg-[#C62828] animate-pulse'
                  : filled
                  ? 'bg-[#E8B931] scale-110'
                  : darkMode ? 'bg-white/15' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-[260px]">
          {['1','2','3','4','5','6','7','8','9','','0','del'].map((key) => {
            if (key === '') return <div key="empty" />
            if (key === 'del') {
              return (
                <button
                  key="del"
                  onClick={handleDelete}
                  className="flex items-center justify-center h-16 rounded-2xl text-gray-400 active:text-gray-800 active:bg-gray-100 transition-all duration-150 text-[14px] font-semibold"
                >
                  Del
                </button>
              )
            }
            return (
              <button
                key={key}
                onClick={() => handleDigit(key)}
                className="flex items-center justify-center h-16 rounded-2xl bg-gray-100 dark:bg-white/[0.06] text-gray-800 dark:text-white text-[22px] font-semibold active:bg-[#E8B931] active:text-[#013D7C] transition-all duration-150 active:scale-95"
              >
                {key}
              </button>
            )
          })}
        </div>

        {error && (
          <p className="text-[12px] text-[#C62828] font-medium mt-4 animate-fade-in">
            {hasPin ? 'Wrong PIN. Try again.' : 'PINs do not match. Try again.'}
          </p>
        )}
      </div>
    </div>
  )
}
