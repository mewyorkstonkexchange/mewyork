import { createConfig, http } from 'wagmi'
import { coinbaseWallet, injected } from 'wagmi/connectors'
import type { CreateConnectorFn } from 'wagmi'
import type { Chain } from 'viem'
import { buildChain } from './chains'
import { walletConnectConnector } from './walletconnect'
import { siteConfig } from '../site.config'
import type { WalletConfig } from '../config/types'

export const targetChain = buildChain(siteConfig.network)

export type ConnectorKey = 'injected' | 'coinbase' | 'walletConnect'

export type ConnectorSlot = {
  key: ConnectorKey
  connector: CreateConnectorFn
}

/**
 * EIP-6963 discovery covers MetaMask, Rabby and any other injected wallet. Coinbase
 * Wallet needs its own SDK to reach the mobile app and the smart wallet. WalletConnect
 * appears only when a project id exists.
 */
export function buildConnectorSlots(wallet: WalletConfig): ConnectorSlot[] {
  const slots: ConnectorSlot[] = [
    { key: 'injected', connector: injected({ shimDisconnect: true }) },
    { key: 'coinbase', connector: coinbaseWallet({ appName: 'Mew York Stock Exchange' }) },
  ]
  const walletConnect = walletConnectConnector(wallet)
  if (walletConnect) slots.push({ key: 'walletConnect', connector: walletConnect })
  return slots
}

export function createWalletConfig(chain: Chain) {
  return createConfig({
    chains: [chain],
    connectors: buildConnectorSlots(siteConfig.wallet).map((slot) => slot.connector),
    multiInjectedProviderDiscovery: true,
    transports: { [chain.id]: http() },
  })
}

export const walletConfig = targetChain ? createWalletConfig(targetChain) : null
