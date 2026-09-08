import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import type { Chain } from 'viem'
import { buildChain } from './chains'
import { siteConfig } from '../site.config'

export const targetChain = buildChain(siteConfig.network)

export function createWalletConfig(chain: Chain) {
  return createConfig({
    chains: [chain],
    // EIP-6963 discovery covers MetaMask, Rabby and Coinbase Wallet without a per-wallet SDK.
    connectors: [injected({ shimDisconnect: true })],
    multiInjectedProviderDiscovery: true,
    transports: { [chain.id]: http() },
  })
}

export const walletConfig = targetChain ? createWalletConfig(targetChain) : null
