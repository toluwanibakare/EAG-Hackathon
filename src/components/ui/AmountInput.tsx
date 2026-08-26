import { useRef, useEffect } from 'react'

interface AmountInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function AmountInput({
  value,
  onChange,
  placeholder = '0.00',
  className = '',
  autoFocus = false,
}: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    const parts = raw.split('.')
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 2) return
    onChange(raw)
  }

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <span className="text-[32px] font-bold text-gray-200 dark:text-gray-700">{'\u20A6'}</span>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="text-[40px] font-bold text-[#013D7C] dark:text-white bg-transparent text-center outline-none w-full placeholder:text-gray-200 dark:placeholder:text-gray-700 tabular-nums tracking-[-0.03em] caret-[#013D7C] dark:caret-white"
        autoComplete="off"
      />
    </div>
  )
}
