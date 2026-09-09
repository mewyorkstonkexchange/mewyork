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
    setStatus((await copyText(address)) === 'copied' ? 'copied' : 'failed')
  }

  return (
    <>
      <div className="contract">
        <div>
          <span className="eyebrow">{label.toUpperCase()}</span>
          <code>{address}</code>
        </div>
        <button type="button" onClick={handleCopy}>
          Copy {label.toLowerCase()}
        </button>
      </div>
      <p className="contract-actions">
        {explorerUrl ? (
          <a
            href={`${explorerUrl.replace(/\/$/, '')}/address/${address}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            View on explorer ↗
          </a>
        ) : null}
        <span role="status" aria-live="polite">
          {status === 'copied'
            ? 'Copied'
            : status === 'failed'
              ? 'Copy failed — select the address and copy it manually'
              : ''}
        </span>
      </p>
    </>
  )
}
