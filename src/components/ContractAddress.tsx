import { useEffect, useState } from 'react'
import { copyText } from '../lib/clipboard'

type ContractAddressProps = {
  label: string
  address: string
  explorerUrl?: string | null
}

const FEEDBACK_MS = 2500

export function ContractAddress({ label, address, explorerUrl }: ContractAddressProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => setStatus('idle'), FEEDBACK_MS)
    return () => clearTimeout(timer)
  }, [status])

  async function handleCopy() {
    setStatus(await copyText(address) === 'copied' ? 'copied' : 'failed')
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ivory-dim">{label}</span>
      <code className="block break-all rounded-md border border-purple/40 bg-navy-deep px-3 py-2 font-mono text-sm text-ivory">
        {address}
      </code>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-green px-3 py-1.5 text-sm font-semibold text-green hover:bg-green hover:text-ink"
        >
          Copy {label.toLowerCase()}
        </button>
        {explorerUrl ? (
          <a
            className="text-sm text-pink underline underline-offset-4"
            href={`${explorerUrl.replace(/\/$/, '')}/address/${address}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            View on explorer
          </a>
        ) : null}
        <span role="status" aria-live="polite" className="text-sm text-ivory-dim">
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed — select the address and copy it manually' : ''}
        </span>
      </div>
    </div>
  )
}
