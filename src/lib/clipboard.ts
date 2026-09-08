export type CopyResult = 'copied' | 'failed'

/** Writes the exact string given. Callers must pass the full address, never a truncation. */
export async function copyText(text: string): Promise<CopyResult> {
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return 'failed'
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}
