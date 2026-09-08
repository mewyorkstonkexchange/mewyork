import type { SiteConfig } from './types'

/**
 * Values for the dev-only live preview. Every field is obviously fake so a screenshot
 * of the preview can never be mistaken for launch data.
 */
export const MOCK_CONTRACT_ADDRESS = '0x000000000000000000000000000000000000dEaD'
export const MOCK_POOL_ADDRESS = '0x000000000000000000000000000000000000bEEF'

export function withMockLiveData(config: SiteConfig): SiteConfig {
  return {
    ...config,
    launchMode: 'live',
    token: {
      name: 'MOCK — token name',
      symbol: 'MOCK',
      chain: config.network.label,
      contractAddress: MOCK_CONTRACT_ADDRESS,
      poolAddress: MOCK_POOL_ADDRESS,
      totalSupply: 'MOCK — supply not decided',
      pairingAsset: 'MOCK — pairing asset not decided',
      venue: 'MOCK — venue not decided',
    },
    links: {
      ...config.links,
      explorer: config.network.explorerUrl,
      tradeVenue: 'https://mock-trade-venue.invalid/',
    },
  }
}
