import { useEffect, useRef, useState } from 'react'
import { useConnect, useConnection, useConnectors, useDisconnect, useSwitchChain } from 'wagmi'
import type { Connector } from 'wagmi'
import type { Chain } from 'viem'
import { targetChain, walletConfig } from './config'
import { WALLETCONNECT_UNAVAILABLE_LABEL } from './walletconnect'
import { truncateAddress } from '../lib/format'

const NO_PROVIDER_HELP =
  'No browser wallet was detected. Open this page inside your wallet’s browser, or use WalletConnect.'

function isUserRejection(error: unknown): boolean {
  let current: unknown = error
  for (let depth = 0; current && depth < 5; depth += 1) {
    const candidate = current as { name?: string; code?: number; cause?: unknown }
    if (candidate.name === 'UserRejectedRequestError' || candidate.code === 4001) return true
    current = candidate.cause
  }
  return false
}

export function WalletSheet() {
  if (!walletConfig || !targetChain) {
    return (
      <button type="button" className="wallet" disabled>
        Wallet unavailable
      </button>
    )
  }
  return <ConnectedWalletSheet chain={targetChain} />
}

function ConnectedWalletSheet({ chain }: { chain: Chain }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  const connection = useConnection()
  const connectors = useConnectors()
  const { mutate: connect, isPending, error, reset } = useConnect()
  const { mutate: disconnect } = useDisconnect()
  const { mutate: switchChain, isPending: isSwitching, error: switchError } = useSwitchChain()

  useEffect(() => {
    const element = dialogRef.current
    if (!element) return
    if (open && !element.open && typeof element.showModal === 'function') element.showModal()
    if (!open && element.open) element.close()
  }, [open])

  const discovered = connectors.filter(
    (candidate) => candidate.type === 'injected' && candidate.id !== 'injected',
  )
  const fallbackInjected = connectors.find((candidate) => candidate.id === 'injected')
  const coinbase = connectors.find((candidate) => candidate.id === 'coinbaseWalletSDK')
  const walletConnect = connectors.find((candidate) => candidate.id === 'walletConnect')

  const hasInjected =
    discovered.length > 0 ||
    (typeof window !== 'undefined' && Boolean((window as Window & { ethereum?: unknown }).ethereum))

  const injectedOptions: Connector[] = discovered.length
    ? discovered
    : hasInjected && fallbackInjected
      ? [fallbackInjected]
      : []

  return (
    <>
      <button
        type="button"
        className="wallet"
        onClick={() => {
          reset()
          setOpen(true)
        }}
      >
        {connection.status === 'connected'
          ? truncateAddress(connection.address)
          : 'Connect wallet'}
      </button>

      <dialog ref={dialogRef} onClose={() => setOpen(false)} aria-labelledby="wallet-sheet-heading">
        <button
          type="button"
          className="dialog-close"
          aria-label="Close wallet panel"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <p className="eyebrow">WALLET SESSION</p>
        <h2 id="wallet-sheet-heading">Take a seat.</h2>

        {connection.status === 'connected' ? (
          <>
            <p>This site holds a read-only session. It never asks for a signature or a transaction.</p>
            <p className="wallet-account">{connection.address}</p>
            <p className="wallet-status" role="status">
              {connection.chainId === chain.id
                ? `Network: ${chain.name}.`
                : `Wrong network — connected to chain ${connection.chainId}.`}
            </p>
            <div className="actions">
              {connection.chainId === chain.id ? null : (
                <button
                  type="button"
                  className="primary"
                  disabled={isSwitching}
                  onClick={() => switchChain({ chainId: chain.id })}
                >
                  {isSwitching ? 'Switching…' : `Switch to ${chain.name}`}
                </button>
              )}
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  disconnect()
                  setOpen(false)
                }}
              >
                Disconnect this site session
              </button>
            </div>
            {switchError ? (
              <p className="wallet-status" role="status">
                {isUserRejection(switchError)
                  ? 'Network switch declined in your wallet.'
                  : `Could not switch network. Add ${chain.name} in your wallet, then try again.`}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <p>Connect an available wallet. This requests your public address only.</p>
            <div className="providers">
              {injectedOptions.map((candidate) => (
                <button
                  key={candidate.uid}
                  type="button"
                  className="secondary"
                  disabled={isPending}
                  onClick={() => connect({ connector: candidate })}
                >
                  {candidate.name}
                </button>
              ))}
              {coinbase ? (
                <button
                  type="button"
                  className="secondary"
                  disabled={isPending}
                  onClick={() => connect({ connector: coinbase })}
                >
                  Coinbase Wallet
                </button>
              ) : null}
              {walletConnect ? (
                <button
                  type="button"
                  className="secondary"
                  disabled={isPending}
                  onClick={() => connect({ connector: walletConnect })}
                >
                  WalletConnect — scan or open a mobile wallet
                </button>
              ) : (
                <button type="button" className="secondary" disabled>
                  {WALLETCONNECT_UNAVAILABLE_LABEL}
                </button>
              )}
            </div>
            {hasInjected ? null : (
              <p className="wallet-status" role="status">
                {NO_PROVIDER_HELP}
              </p>
            )}
            {error ? (
              <p className="wallet-status" role="status">
                {isUserRejection(error)
                  ? 'Connection declined. You can try again.'
                  : 'Could not connect. Unlock your wallet and try again.'}
              </p>
            ) : null}
          </>
        )}

        <p className="small">
          No seed phrase, signature or transaction is ever requested. The session ends when you
          close the page.
        </p>
      </dialog>
    </>
  )
}
