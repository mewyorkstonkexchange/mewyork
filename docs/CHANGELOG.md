# Changelog

## 9 September 2026 — the Chairman is revealed

- The hero and the Chairman portrait now serve the revealed Chairman, from the reveal-pack masters
  under `assets/source/`. Same slots, same layout, same copy; WebP with a palette PNG fallback,
  each under 400 KB.
- The portrait caption reads "THE CHAIRMAN". It said "PORTRAIT WITHHELD", which no longer describes
  what the reader can see.
- The hero crop moved right at the two narrow breakpoints so the Chairman's head stays whole. The
  old values framed a composition whose subject sat further left.
- `og:image` and `twitter:image` now name the Chairman social card. The page had no share image
  before.
- The favicon is unchanged: it is the wordmark, so the reveal did not touch it.
- Removed the design-preview bar and its prelaunch / token-live toggle, from both pages, with the
  styles that only served it. `live-preview.html` is still there and still works; the public page
  no longer links to it.
- The concealed-Chairman art stays in the repository, superseded and no longer loaded.

## 9 September 2026 — the original prelaunch design is live

- Reverted `index.html`, `style.css` and `config.js` to the original prelaunch design. Same copy, same sections, same order.
- Added the announced destinations: X and Telegram icon links in the header and footer, and the hero, Chairman and closing buttons now open t.me/MewYorkExchange and x.com/MewYorkExchange in a new tab. The line saying community links would appear when announced is gone, because they are announced.
- Added the wallet session to the original "Take a seat" panel: MetaMask first, other injected wallets, Coinbase Wallet, and WalletConnect for phones. It requests `eth_requestAccounts` and `eth_chainId` only, compares chain 4663 as `0x1237`, and never asks for a signature, an approval or a transaction.
- The delivered hero, portrait and favicon artwork from the original package is served again, as WebP with a palette PNG fallback under 400 KB each. Masters stay under `assets/source/`.
- Nothing else changed. The revision's thesis section, address records and FAQ rewrites are not part of this design.

## 8 September 2026 — revision, superseded by the above

- Chairman visible throughout prelaunch; approved hero and social card integrated, PFP used as favicon.
- “Coming soon. Only on Robinhood Chain.” is now the largest headline. Both taglines sit beneath it.
- Added the utility-coin thesis and config-driven $5M milestone, without announcing utility mechanics.
- Page order reduced to header → hero → thesis → contract address → Chairman → four FAQs → footer.
- Added always-visible, distinct token and pool records with verified-value copy controls. Empty records say “Not yet published.”
- Activated supplied X/Telegram destinations in header/footer icon links and hero buttons.
- Retained the palette, type, section spacing, original background-image hero treatment, wallet modal and exact footer disclaimer.
- Token-live preview remains separate and uses the same config; no invented token values or buy buttons.
