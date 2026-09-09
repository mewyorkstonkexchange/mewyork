import type { AnalyticsProvider, SiteConfig } from './config/types'

export const siteConfig: SiteConfig = {
  launchMode: 'coming-soon',

  brand: {
    shortName: 'MYSE',
    fullName: 'MEW YORK STOCK EXCHANGE',
    headlineLead: 'Coming soon.',
    headlineEmphasis: 'Only on Robinhood Chain.',
    tagline: 'From the binder to the trading floor.',
    supportLine: 'The next evolution of trading culture.',
  },

  thesis: {
    heading: 'The thesis',
    unlockMarketCapUsd: 5_000_000,
    body: [
      'MYSE is designed as a utility coin, not a pure memecoin.',
      'Utility unlocks at {marketCap} market cap. That is when the roadmap opens and the Chairman evolves.',
      'Until then: coming soon. Only on Robinhood Chain.',
    ],
  },

  contractSection: {
    heading: 'Contract address',
    lead: 'Published only on X, on @MewYorkExchange. Any address posted anywhere else is fake.',
    ctaLabel: 'Follow @MewYorkExchange',
    placeholder: 'Not yet published',
  },

  chairman: {
    line: 'The Chairman will see you soon.',
    imageAlt:
      'The Chairman, a pink cat in a black pinstripe suit, resting his cheek on his paw at an exchange desk beside a brass bell.',
  },

  network: {
    label: 'Robinhood Chain',
    chainId: 4663,
    rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
    explorerUrl: 'https://robinhoodchain.blockscout.com',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    verified: true,
    verificationNote:
      'Confirmed 2026-09-08 against docs.robinhood.com/chain/connecting, the Robinhood Chain mainnet support article, ethereum-lists/chains eip155-4663, and a live eth_chainId call returning 0x1237. See docs/architecture.md.',
  },

  token: {
    name: null,
    symbol: null,
    chain: null,
    contractAddress: null,
    poolAddress: null,
    totalSupply: null,
    pairingAsset: null,
    venue: null,
  },

  links: {
    x: 'https://x.com/MewYorkExchange',
    telegram: 'https://t.me/MewYorkExchange',
    explorer: null,
    tradeVenue: null,
  },

  faq: [
    {
      id: 'what-is-myse',
      question: 'What is MYSE?',
      answer:
        'Mew York Stock Exchange is a utility coin on Robinhood Chain, presented as a fictional financial institution led by the Chairman. Utility unlocks at $5M market cap, when the roadmap opens.',
    },
    {
      id: 'launched',
      question: 'Has the token launched?',
      answer:
        'Not yet. The contract address will be published only on X, on @MewYorkExchange, and shown on this page at the same time.',
    },
    {
      id: 'wallet',
      question: 'What happens when I connect a wallet?',
      answer:
        'A wallet session only. No purchase, token approval, signature, whitelist entry or airdrop registration. Reading the site never requires a wallet.',
    },
    {
      id: 'robinhood',
      question: 'Is this an official Robinhood project?',
      answer:
        'No. MYSE is independent. “Only on Robinhood Chain” describes the intended network; it does not mean endorsement or a Robinhood brokerage listing.',
    },
  ],

  disclosures: [
    'Independent project. Not affiliated with or endorsed by Robinhood, Pokémon or NYSE. Artwork is conceptual and does not represent assets held.',
  ],

  analytics: {
    provider: (import.meta.env.VITE_ANALYTICS_PROVIDER as AnalyticsProvider) || 'none',
    scriptUrl: import.meta.env.VITE_ANALYTICS_SCRIPT_URL || null,
    siteId: import.meta.env.VITE_ANALYTICS_SITE_ID || null,
    respectDoNotTrack: true,
  },

  wallet: {
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || null,
  },
}
