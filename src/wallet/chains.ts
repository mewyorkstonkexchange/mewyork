import { defineChain } from 'viem'
import type { Chain } from 'viem'
import type { NetworkConfig } from '../config/types'

/**
 * Returns null when the network metadata has not been verified. The wallet stack is not
 * mounted in that case, so the app can never point a wallet at guessed RPC details.
 */
export function buildChain(network: NetworkConfig): Chain | null {
  if (!network.verified) return null
  const { chainId, rpcUrl, explorerUrl, nativeCurrency, label } = network
  if (chainId == null || !rpcUrl || !nativeCurrency) return null

  return defineChain({
    id: chainId,
    name: label,
    nativeCurrency,
    rpcUrls: { default: { http: [rpcUrl] } },
    ...(explorerUrl ? { blockExplorers: { default: { name: `${label} explorer`, url: explorerUrl } } } : {}),
  })
}
