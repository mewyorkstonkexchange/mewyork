import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { WalletProvider } from '../wallet/WalletProvider'
import { WalletSheet } from '../wallet/WalletSheet'

function setInjectedProvider(value: unknown) {
  Object.defineProperty(window, 'ethereum', { value, configurable: true, writable: true })
}

beforeEach(() => {
  setInjectedProvider(undefined)
})

afterEach(() => {
  setInjectedProvider(undefined)
})

function openSheet() {
  render(
    <WalletProvider>
      <WalletSheet />
    </WalletProvider>,
  )
  fireEvent.click(screen.getByText('Connect wallet'))
}

describe('connect sheet with no injected provider', () => {
  it('keeps the modal heading from the design', () => {
    openSheet()
    expect(screen.getByText('Take a seat.')).toBeTruthy()
  })

  it('explains the mobile route instead of dead-ending', () => {
    openSheet()
    expect(
      screen.getByText(/Open this page inside your wallet.s browser, or use WalletConnect/),
    ).toBeTruthy()
  })

  it('offers Coinbase Wallet, which needs no injected provider', () => {
    openSheet()
    const button = screen.getByText('Coinbase Wallet').closest('button')
    expect(button?.disabled).toBe(false)
  })

  it('shows WalletConnect disabled rather than hidden while the project id is unset', () => {
    openSheet()
    const button = screen.getByText('Mobile wallets: available soon').closest('button')
    expect(button).not.toBeNull()
    expect(button?.disabled).toBe(true)
  })

  it('offers no injected option when the browser exposes none', () => {
    openSheet()
    expect(screen.queryByText('Browser wallet')).toBeNull()
  })
})
