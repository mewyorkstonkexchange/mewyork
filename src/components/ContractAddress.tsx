import { useEffect, useState } from 'react'
import { copyText } from '../lib/clipboard'

type ContractAddressProps = {
  label: string
  /** Null until the address is published. The row still renders, showing the placeholder. */
  address: string | null
  placeholder: string
  explorerUrl?: string | null
}

const FEEDBACK_MS = 2500

export function ContractAddress({ label, address, placeholder, explorerUrl }: ContractAddressProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => setStatus('idle'), FEEDBACK_MS)
    return () => clearTimeout(timer)
  }, [status])

  async function handleCopy() {
    if (address === null) return
    setStatus((await copyText(address)) === 'copied' ? 'copied' : 'failed')
  }

  return (
    <div className="record-row">
      <dt>{label}</dt>
      <dd>
        <code className={address === null ? 'record-value is-empty' : 'record-value'}>
          {address ?? placeholder}
        </code>
        <span className="record-actions">
          <button type="button" onClick={handleCopy} disabled={address === null}>
            Copy {label.toLowerCase()}
          </button>
          {address !== null && explorerUrl ? (
            <a
              href={`${explorerUrl.replace(/\/$/, '')}/address/${address}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              View on explorer <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          <span role="status" aria-live="polite">
            {status === 'copied'
              ? 'Copied'
              : status === 'failed'
                ? 'Copy failed — select the address and copy it manually'
                : ''}
          </span>
        </span>
      </dd>
    </div>
  )
}
