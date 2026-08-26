export const USD_TO_NGN = 1550

export function formatUsd(amount: number): string {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatUsdShort(amount: number): string {
  if (amount >= 1_000_000) return '$' + (amount / 1_000_000).toFixed(1) + 'M'
  if (amount >= 1_000) return '$' + (amount / 1_000).toFixed(0) + 'K'
  return formatUsd(amount)
}

export function formatNgn(amount: number): string {
  return '\u20A6' + amount.toLocaleString('en-NG')
}

export function usdToNgn(usd: number): number {
  return Math.round(usd * USD_TO_NGN)
}

export function ngnToUsd(ngn: number): number {
  return Math.round((ngn / USD_TO_NGN) * 100) / 100
}
