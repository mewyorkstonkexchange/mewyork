export function truncateAddress(address: string, lead = 6, tail = 4): string {
  if (address.length <= lead + tail + 1) return address
  return `${address.slice(0, lead)}…${address.slice(-tail)}`
}

const UNITS = [
  { limit: 1_000_000_000, suffix: 'B' },
  { limit: 1_000_000, suffix: 'M' },
  { limit: 1_000, suffix: 'K' },
] as const

function trimZeros(value: number): string {
  return Number(value.toFixed(2)).toString()
}

export function formatCompactUsd(amount: number): string {
  for (const { limit, suffix } of UNITS) {
    if (amount >= limit) return `$${trimZeros(amount / limit)}${suffix}`
  }
  return `$${trimZeros(amount)}`
}

export function fillTemplate(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}
