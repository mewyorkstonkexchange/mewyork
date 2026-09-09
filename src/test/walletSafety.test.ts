import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildConnectorSlots } from '../wallet/config'
import { WALLETCONNECT_UNAVAILABLE_LABEL, walletConnectConnector } from '../wallet/walletconnect'

const srcDir = resolve(process.cwd(), 'src')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [full] : []
  })
}

// Connecting a wallet must never be able to move funds or produce a signature.
const FORBIDDEN = [
  'useSignMessage',
  'useSignTypedData',
  'useSendTransaction',
  'useWriteContract',
  'useSendCalls',
  'writeContract',
  'sendTransaction',
  'sendCalls',
  'signMessage',
  'signTypedData',
  'eth_sendTransaction',
  'eth_sign',
  'personal_sign',
  'eth_signTypedData',
  'wallet_watchAsset',
]

describe('wallet side effects', () => {
  it('never references a signing or transaction API', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(srcDir)) {
      const contents = readFileSync(file, 'utf8')
      for (const token of FORBIDDEN) {
        if (contents.includes(token)) offenders.push(`${file}: ${token}`)
      }
    }
    expect(offenders).toEqual([])
  })
})

describe('connector set', () => {
  it('registers injected and Coinbase Wallet with no credential configured', () => {
    const slots = buildConnectorSlots({ walletConnectProjectId: null })
    expect(slots.map((slot) => slot.key)).toEqual(['injected', 'coinbase'])
  })

  it('adds WalletConnect once a project id is configured', () => {
    const slots = buildConnectorSlots({ walletConnectProjectId: 'a'.repeat(32) })
    expect(slots.map((slot) => slot.key)).toEqual(['injected', 'coinbase', 'walletConnect'])
  })

  it('treats a blank project id as absent so the option renders disabled', () => {
    expect(walletConnectConnector({ walletConnectProjectId: '   ' })).toBeNull()
    expect(walletConnectConnector({ walletConnectProjectId: null })).toBeNull()
    expect(WALLETCONNECT_UNAVAILABLE_LABEL).toBe('Mobile wallets: available soon')
  })
})
