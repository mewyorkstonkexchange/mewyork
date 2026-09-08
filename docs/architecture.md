# Architecture

## Stack

Vite + React + TypeScript + Tailwind, built to static files. The site is a single page
with a handful of config-driven sections, so a static bundle on GitHub Pages needs no
server, no runtime secrets and no build-time API. React earns its place because the wallet
libraries are React-first; TypeScript because the launch gate and the token config are the
two places a mistake is expensive. Tailwind v4 carries the palette as CSS custom
properties, so the colours live in one block in `src/index.css`.

Wallet: `wagmi` + `viem`, injected connectors only, with EIP-6963 discovery so MetaMask,
Rabby and Coinbase Wallet appear without a per-wallet SDK. The connection is session-only:
address, chain, disconnect. No signing or transaction API is imported anywhere; a test
(`src/test/walletSafety.test.ts`) fails the build if one appears.

Tests: vitest with jsdom. The three consequential paths — launch-mode gating, contract
copying, config validation — are covered, plus the asset manifest shape.

## Layout

```
src/site.config.ts        content, links, token, network, FAQ, disclosures
src/config/launch.ts      launch gate + dev-only live-preview gate
src/config/validate.ts    config validation
src/config/mock.ts        labelled mock data for the live preview
src/wallet/               chain construction, wagmi config, wallet UI
src/components/           presentational pieces, all config-driven
assets/manifest.json      asset contract with Astra
```

`CNAME` and `.nojekyll` stay at the repo root and are copied into `dist/` by a small Vite
plugin, so either Pages mode (branch root, or an Actions-built artifact) works.

## Robinhood Chain metadata

Status: **verified**. `network.verified` is `true` in `src/site.config.ts`.

| Field | Value |
| --- | --- |
| Chain ID | 4663 (`0x1237`) |
| Public RPC | `https://rpc.mainnet.chain.robinhood.com` |
| Explorer | `https://robinhoodchain.blockscout.com` |
| Native currency | Ether / ETH / 18 |
| Stack | Arbitrum L2, settles to Ethereum, ETH gas |
| Testnet | chain id 46630, `https://rpc.testnet.chain.robinhood.com`, `https://explorer.testnet.chain.robinhood.com` |

Sources, checked 2026-09-08:

- `https://docs.robinhood.com/chain/connecting` — official network config table (chain ids, RPC, sequencer and explorer endpoints).
- `https://docs.robinhood.com/chain/add-network-to-wallet` — official manual add-network values for EVM wallets.
- `https://docs.robinhood.com/chain` — chain description, Arbitrum basis, ETH gas.
- `https://robinhood.com/us/en/support/articles/robinhood-chain-mainnet/` — official support article, same values.
- `https://robinhood.com/us/en/newsroom/robinhood-accelerates-global-expansion-robinhood-chain-mainnet-stock-tokens-agentic-trading/` — 2026-07-01, public mainnet launch.
- `https://robinhood.com/us/en/newsroom/robinhood-chain-launches-public-testnet/` — 2026-02-10, public testnet launch.
- `https://forum.arbitrum.foundation/t/arbitrumdao-factsheet-robinhood-chain-mainnet-launch/31041` — 2026-07-06, Arbitrum-side factsheet.
- `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-4663.json` — registry entry, status active.
- `https://chainlist.org/rpcs.json` — registry entry (the HTML search page renders client-side and returns nothing to a plain fetch).

Confirmed directly from this machine on 2026-09-08: a JSON-RPC `eth_chainId` POST to
`https://rpc.mainnet.chain.robinhood.com` returned `0x1237` (4663), and the explorer host
returned HTTP 200.

Note on the hex value: one automated page summary reported `0x123F`, which is 4671 and
wrong. The published value is decimal 4663; `0x1237` is what the chain itself returns.

## Verified vs pending

| Item | State |
| --- | --- |
| Network metadata (chain id, RPC, explorer, native currency) | verified |
| Token name, symbol, contract address, pool address, supply, pairing asset | pending — null, founder decision |
| Trade venue and explorer links | pending — null, founder decision |
| X and Telegram links | pending — accounts not created |
| WalletConnect / Reown connector | pending credential — needs a project id; adapter slot in `src/wallet/walletconnect.ts` |
| Analytics provider | pending decision — adapter is a no-op until `VITE_ANALYTICS_*` are set |
| All imagery | pending — placeholders only, see `docs/asset-requests.md` |
| Palette hex values | provisional — named colours from the brief, exact values pending Astra |

## Analytics

`src/lib/analytics.ts` is an adapter with a no-op default. It loads nothing unless a
provider, script URL and site id are all configured, and it returns the no-op when the
visitor sends Do Not Track. No cookies, no identifiers, no event payloads leave the page by
default. Plausible and Umami are the two shapes wired; both are self-describing script tags.

## Deployment

`npm run build` produces `dist/`. `.github/workflows/pages.yml` publishes that artifact to
GitHub Pages on a push to `main`. No repository, remote or deployment has been created yet.
