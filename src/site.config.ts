import type { AnalyticsProvider, SiteConfig } from './config/types'

export const siteConfig: SiteConfig = {
  launchMode: 'coming-soon',

  brand: {
    shortName: 'MYSE',
    fullName: 'MEW YORK STOCK EXCHANGE',
    tagline: 'From the binder to the trading floor.',
    supportLine: 'The next evolution of trading culture.',
    statusLine: 'Coming soon. Only on Robinhood Chain.',
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
    x: null,
    telegram: null,
    explorer: null,
    tradeVenue: null,
  },

  faq: [
    {
      id: 'token',
      question: 'Is there a token yet?',
      answer:
        'No. No contract address has been announced. Any address presented as MYSE today is not ours.',
    },
    {
      id: 'chain',
      question: 'Which network will it be on?',
      answer: 'Robinhood Chain.',
    },
    {
      id: 'what-it-is',
      question: 'What is MYSE?',
      answer:
        'A community project. It is not an exchange, a broker, a fund, or a financial product, and it does not hold or redeem any asset.',
    },
    {
      id: 'wallet',
      question: 'Why is there a wallet button before launch?',
      answer:
        'To confirm your wallet can reach the network. Connecting reads your address only. It never requests a signature, an approval, or a transaction.',
    },
  ],

  disclosures: [
    'MYSE is a community project. It is not an exchange, a broker, a fund, or a financial product.',
    'MYSE is not affiliated with, endorsed by, or connected to Robinhood, the New York Stock Exchange, Pokemon, zcat, or Doodles.',
    'No token, contract address, supply, or launch date has been announced.',
    'Nothing on this site is financial advice or an offer to sell anything.',
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
