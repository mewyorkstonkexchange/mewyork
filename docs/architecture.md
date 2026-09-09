# Architecture

## Stack

Vite + React + TypeScript, built to static files. The site is a single page with a handful
of config-driven sections, so a static bundle on GitHub Pages needs no server, no runtime
secrets and no build-time API. React earns its place because the wallet libraries are
React-first; TypeScript because the launch gate and the token config are the two places a
mistake is expensive.

Styling is one hand-written stylesheet, `src/index.css`. It is a port of the creative
director's static design: her palette, serif display type, monospace section labels,
section rhythm and modal treatment, carried across as the same class names. There is no
CSS framework, so nothing between her stylesheet and the rendered page can drift.

Wallet: `wagmi` + `viem`. Three connectors, all read-only:

| Connector | Credential | Notes |
| --- | --- | --- |
| Injected + EIP-6963 discovery | none | MetaMask, Rabby and any other extension announce themselves |
| Coinbase Wallet SDK | none | reaches the Coinbase mobile app and smart wallet without an extension |
| WalletConnect | project id | loads only when `VITE_WALLETCONNECT_PROJECT_ID` is set |

The connection is session-only: address, chain, network switch, disconnect. No signing or
transaction API is imported anywhere; `src/test/walletSafety.test.ts` fails the build if
one appears, and also pins the connector set.

Tests: vitest with jsdom. The consequential paths — launch-mode gating, contract copying,
config validation, the connector set and the no-injected-provider connect sheet — are
covered, plus the asset manifest shape, the existence of every file it names and the 400 KB
ceiling on anything the page loads.

## Layout

```
src/site.config.ts        content, links, thesis and contract copy, FAQ, disclosure
src/config/launch.ts      launch gate + dev-only live-preview gate
src/config/validate.ts    config validation
src/config/mock.ts        labelled mock data for the live preview
src/wallet/               chain construction, connector set, connect sheet
src/components/           presentational pieces, all config-driven
src/index.css             the ported design system
assets/manifest.json      asset contract: every delivered file, its source and its status
assets/source/            delivered masters, not served
public/                   web derivatives that ship with the page
```

`CNAME` and `.nojekyll` stay at the repo root and are copied into `dist/` by a small Vite
plugin, so either Pages mode (branch root, or an Actions-built artifact) works.

## Page structure

Header (wordmark, X and Telegram icon links, connect button) → hero → thesis →
contract-address record → Chairman → FAQ → footer. The hero carries the largest type on the
page: the headline is "Coming soon. Only on Robinhood Chain."

The thesis section sits directly under the hero and states the positioning and the market
cap at which utility unlocks. The figure is rendered from `thesis.unlockMarketCapUsd`
through `formatCompactUsd`, so the number has one source.

The contract-address record is the anti-scam surface. It renders in both modes and always
shows the same five rows: token contract, pool address, network, explorer and trade. A row
whose config value is still null shows `Not yet published`, and an unpublished address row
has its copy button disabled, so the page never prints a stand-in address. The record names
one account, and `validateSiteConfig` refuses a config where `links.x` is null because of
it.

In live mode the token block is added below the record. Live mode is gated: see
`docs/launch-switch.md`.

## WalletConnect

The connector needs a free project id. The founder creates one:

1. Sign in at `https://cloud.reown.com`.
2. Create a project, type "AppKit", and copy its **Project ID**.
3. Put it in `.env` as `VITE_WALLETCONNECT_PROJECT_ID=<id>` and rebuild.

The id is public — it is compiled into the browser bundle by design — so it is not a
secret, but it is still a per-project value and belongs in `.env`, not in source.

Until it is set, `walletConnectConnector` returns null, the WalletConnect provider bundle is
never imported, and the connect sheet renders the option disabled and labelled "Mobile
wallets: available soon". The build does not break either way; the connector set is asserted
in both states by `src/test/walletSafety.test.ts`.

## Mobile

On a phone with no injected provider, the connect sheet still opens, still offers Coinbase
Wallet, and explains: "Open this page inside your wallet's browser, or use WalletConnect."
Once the project id is set, WalletConnect handles the deep link into an installed wallet.
`src/test/walletSheet.test.tsx` renders that state headlessly and asserts each part of it.

## Assets

Final Chairman artwork, signed off by the founder. Masters are in `assets/source/` and are
not served. `public/` carries the web derivatives, produced by deterministic resize, crop
and re-encode — no repainting.

| Slot | Served file | Fallback | Source |
| --- | --- | --- | --- |
| Hero (wide) and Chairman section | `public/hero-chairman.webp` 1600x900 | `public/hero-chairman.png` 1280x720 | `MYSE-Chairman-Web-Hero.png` |
| Hero on narrow viewports | `public/chairman-portrait.webp` 688x900 | `public/chairman-portrait.png` | crop of the same master at x=912 |
| `og:image` / `twitter:image` | `public/share-chairman.png` 1200x630 | `public/share-chairman.webp` | `MYSE-Chairman-Social-Card.png` |
| Favicon | `public/favicon.svg` | — | — |

The narrow-viewport crop exists because the wide hero puts the Chairman on the right; a
`cover` crop on a phone would drop him. The share image ships PNG-first because not every
link-preview crawler accepts WebP.

Every file the page loads is under 400 KB, asserted in `src/test/manifest.test.ts`.

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
| X and Telegram links | set — `x.com/MewYorkExchange`, `t.me/MewYorkExchange` |
| Imagery | delivered and signed off |
| Token name, symbol, contract address, pool address, supply, pairing asset | pending — null, founder decision |
| Trade venue and explorer links | pending — null, founder decision |
| WalletConnect connector | pending credential — needs a project id, see above |
| Analytics provider | pending decision — adapter is a no-op until `VITE_ANALYTICS_*` are set |

## Analytics

`src/lib/analytics.ts` is an adapter with a no-op default. It loads nothing unless a
provider, script URL and site id are all configured, and it returns the no-op when the
visitor sends Do Not Track. No cookies, no identifiers, no event payloads leave the page by
default. Plausible and Umami are the two shapes wired; both are self-describing script tags.

## Deployment

`npm run build` produces `dist/`. `.github/workflows/pages.yml` publishes that artifact to
GitHub Pages on a push to `main`. No repository, remote or deployment has been created yet.
