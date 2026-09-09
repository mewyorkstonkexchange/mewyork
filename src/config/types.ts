export type LaunchMode = 'coming-soon' | 'live'

export type AnalyticsProvider = 'none' | 'plausible' | 'umami'

export type NativeCurrency = {
  name: string
  symbol: string
  decimals: number
}

export type NetworkConfig = {
  /** Display label used in the UI. */
  label: string
  chainId: number | null
  rpcUrl: string | null
  explorerUrl: string | null
  nativeCurrency: NativeCurrency | null
  /** True only when every field above was confirmed against official sources. */
  verified: boolean
  /** Where the values came from, or why they are still null. */
  verificationNote: string
}

export type TokenConfig = {
  name: string | null
  symbol: string | null
  /** Chain label the token is deployed on. Kept separate from the wallet network. */
  chain: string | null
  contractAddress: string | null
  /** Liquidity pool address. Deliberately distinct from contractAddress. */
  poolAddress: string | null
  totalSupply: string | null
  pairingAsset: string | null
  venue: string | null
}

export type LinksConfig = {
  x: string | null
  telegram: string | null
  explorer: string | null
  tradeVenue: string | null
}

export type BrandConfig = {
  shortName: string
  fullName: string
  /** First half of the page headline. */
  headlineLead: string
  /** Second half of the page headline, carried in the accent colour. */
  headlineEmphasis: string
  tagline: string
  supportLine: string
}

export type ThesisConfig = {
  heading: string
  /** Market cap at which utility unlocks, in whole US dollars. */
  unlockMarketCapUsd: number
  /** Paragraphs. `{marketCap}` is replaced with the formatted figure. */
  body: string[]
}

/** The contract-address record. Its rows render in both modes; the button uses links.x. */
export type ContractSectionConfig = {
  heading: string
  lead: string
  ctaLabel: string
  /** Shown in place of any row value that is still null. */
  placeholder: string
}

export type ChairmanConfig = {
  line: string
  imageAlt: string
}

export type FaqEntry = {
  id: string
  question: string
  answer: string
}

export type AnalyticsConfig = {
  provider: AnalyticsProvider
  scriptUrl: string | null
  siteId: string | null
  respectDoNotTrack: boolean
}

export type WalletConfig = {
  /**
   * WalletConnect/Reown project id. Free, not a secret, compiled into the public bundle.
   * When it is null the WalletConnect option renders disabled instead of disappearing.
   */
  walletConnectProjectId: string | null
}

export type SiteConfig = {
  launchMode: LaunchMode
  brand: BrandConfig
  thesis: ThesisConfig
  contractSection: ContractSectionConfig
  chairman: ChairmanConfig
  network: NetworkConfig
  token: TokenConfig
  links: LinksConfig
  faq: FaqEntry[]
  disclosures: string[]
  analytics: AnalyticsConfig
  wallet: WalletConfig
}
