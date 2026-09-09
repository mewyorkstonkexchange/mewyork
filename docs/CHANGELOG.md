# Changelog

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
