import type { ReactNode } from 'react'
import { useConnect, useConnection, useConnectors, useDisconnect, useSwitchChain } from 'wagmi'
import type { Connector } from 'wagmi'
import type { Chain } from 'viem'
import { targetChain, walletConfig } from './config'
import { truncateAddress } from '../lib/format'

function isUserRejection(error: unknown): boolean {
  let current: unknown = error
  for (let depth = 0; current && depth < 5; depth += 1) {
    const candidate = current as { name?: string; code?: number; cause?: unknown }
    if (candidate.name === 'UserRejectedRequestError' || candidate.code === 4001) return true
    current = candidate.cause
  }
  return false
}

const shell =
  'flex flex-col items-start gap-2 rounded-lg border border-ivory/20 bg-navy-deep/70 px-4 py-3 text-sm'

const button =
  'rounded-md border border-green px-3 py-1.5 text-sm font-semibold text-green hover:bg-green hover:text-ink disabled:cursor-not-allowed disabled:opacity-60'

function Notice({ children }: { children: ReactNode }) {
  return (
    <div className={shell} role="status">
      <span className="text-ivory-dim">{children}</span>
    </div>
  )
}

export function WalletPanel() {
  if (!walletConfig || !targetChain) {
    return <Notice>Network configuration pending verification. Wallet connection is disabled.</Notice>
  }
  return <ConnectedWalletPanel chain={targetChain} />
}

function ConnectedWalletPanel({ chain }: { chain: Chain }) {
  const connection = useConnection()
  const connectors = useConnectors()
  const { mutate: connect, isPending, error, reset } = useConnect()
  const { mutate: disconnect } = useDisconnect()
  const { mutate: switchChain, isPending: isSwitching, error: switchError } = useSwitchChain()

  const discovered = connectors.filter((candidate) => candidate.id !== 'injected')
  const hasWallet =
    discovered.length > 0 ||
    (typeof window !== 'undefined' && Boolean((window as Window & { ethereum?: unknown }).ethereum))
  const connector: Connector | undefined = discovered[0] ?? connectors[0]

  if (!hasWallet) {
    return (
      <Notice>
        No browser wallet detected. Install a wallet extension, or open this page in your wallet
        browser.
      </Notice>
    )
  }

  if (connection.status === 'connected') {
    const wrongNetwork = connection.chainId !== chain.id
    return (
      <div className={shell}>
        <span className="font-mono text-ivory">{truncateAddress(connection.address)}</span>
        <span className="text-ivory-dim">
          {wrongNetwork ? `Wrong network — connected to chain ${connection.chainId}` : chain.name}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {wrongNetwork ? (
            <button
              type="button"
              className={button}
              disabled={isSwitching}
              onClick={() => switchChain({ chainId: chain.id })}
            >
              {isSwitching ? 'Switching…' : `Switch to ${chain.name}`}
            </button>
          ) : null}
          <button
            type="button"
            className="rounded-md border border-ivory/30 px-3 py-1.5 text-sm text-ivory hover:border-pink hover:text-pink"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
        {switchError ? (
          <span role="status" aria-live="polite" className="text-ivory-dim">
            {isUserRejection(switchError)
              ? 'Network switch rejected in your wallet.'
              : `Could not switch network. Add ${chain.name} in your wallet, then try again.`}
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <div className={shell}>
      <button
        type="button"
        className={button}
        disabled={isPending || !connector}
        onClick={() => {
          reset()
          if (connector) connect({ connector })
        }}
      >
        {isPending ? 'Connecting…' : 'Connect wallet'}
      </button>
      <span className="text-xs text-ivory-dim">
        Reads your address only. No signature, approval or transaction is ever requested.
      </span>
      {error ? (
        <span role="status" aria-live="polite" className="text-ivory-dim">
          {isUserRejection(error)
            ? 'Connection rejected in your wallet.'
            : 'Could not connect. Unlock your wallet and try again.'}
        </span>
      ) : null}
    </div>
  )
}
