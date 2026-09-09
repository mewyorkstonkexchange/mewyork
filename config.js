// Public configuration only. Do not put secrets here.
window.MYSE_CONFIG = {
  launchStatus: 'prelaunch',
  verified: false, // Set true only after confirming published addresses and destinations.
  networkName: 'Robinhood Chain',
  chainId: 4663, // Wallet code derives hexadecimal 0x1237 from this value.
  utilityMarketCapUSD: 5000000, // Owner-supplied milestone; no market-cap feed or automatic unlock.
  contract: '',
  poolAddress: '',
  xHandle: '@MewYorkExchange',
  siteURL: 'https://mewyork.xyz', // Canonical HTTPS origin. Also emits absolute social-card metadata.
  walletConnectProjectId: '2460adfcc9ff3cbf205d4a7bbd1bf51f', // Public WalletConnect Cloud project id. Empty keeps the modal's mobile option disabled and loads no WalletConnect code.
  links: {
    x: 'https://x.com/MewYorkExchange',
    telegram: 'https://t.me/MewYorkExchange',
    explorer: '', // Exact verified token explorer destination.
    trade: '' // Exact verified trade destination; displayed as a record link, not a buy button.
  }
};
