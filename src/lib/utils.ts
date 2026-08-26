export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG')
}

export function formatNairaShort(amount: number): string {
  if (amount >= 1000000) {
    return '₦' + (amount / 1000000).toFixed(1) + 'M'
  }
  if (amount >= 1000) {
    return '₦' + (amount / 1000).toFixed(0) + 'K'
  }
  return formatNaira(amount)
}

export function formatPercent(value: number): string {
  return value + '%'
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return d.toLocaleDateString('en-NG', { weekday: 'long' })
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function getProgressPercent(current: number, target: number): number {
  if (target <= 0) return 0
  return Math.min(Math.round((current / target) * 100), 100)
}

export function getEstimatedCompletion(current: number, target: number, monthlyRate: number): string {
  if (monthlyRate <= 0 || current >= target) return 'Completed'
  const remaining = target - current
  const months = Math.ceil(remaining / monthlyRate)
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })
}
