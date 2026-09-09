# Engineering handoff

The site is the original prelaunch design: `index.html` and `live-preview.html` at the repository
root, with `style.css`, `app.js` and `config.js` beside them. No build step, no dependencies. The
two `MYSE_*_Design.html` files in this folder are the superseded revision's self-contained previews,
kept as a record; they are not what the site serves.

All owner-editable public data is in `config.js`: launch status, verification flag, contract, chain
id, the record fields, the community and trading links, and the WalletConnect project id. Both
routes read the same config. `docs/launch-switch.md` is the order of operations at launch.

Initially `launchStatus` is `prelaunch` and `verified` is false, so the record section is hidden and
the page states no address. `live-preview.html` renders the token-live layout at any time without
claiming a launch. Going live requires all of: `launchStatus: 'live'`, `verified: true`, a nonzero
40-hex-digit `contract`, a valid `chainId` and an HTTPS `links.trade`. Explorer, trade and chart
controls stay disabled until then. Links are rejected unless they are HTTPS without embedded
credentials, so a bad value renders inert rather than dangerous.

The header and footer icon links and the hero, Chairman and closing buttons take their destinations
from `config.js`; the markup carries the same URLs so they work without JavaScript.

Wallet: a session only. The modal lists MetaMask first, then any other EIP-6963 injected wallet,
then Coinbase Wallet, then WalletConnect for phones when a project id is configured. When MetaMask
is absent the option is shown disabled beside an install link, so nothing pretends to be available.
Connecting requests `eth_requestAccounts` and `eth_chainId` and nothing else: no approvals, no
signatures, no transactions. Numeric `chainId` 4663 is compared as `0x1237` and a wallet on another
network is told so. Disconnect removes the listeners and clears the session; nothing is persisted.

Artwork: the delivered masters live under `assets/source/` and are not served. The files the page
loads are deterministic resizes and re-encodes of those masters, WebP with a palette PNG fallback,
each under 400 KB. `assets/manifest.json` records every id, source, size and alt text.

Verified chain source, checked 9 September 2026: https://docs.robinhood.com/chain/connecting/
The X and Telegram destinations were supplied by the owner; no account changes or messages were sent.

Validation: `node tests/site.test.cjs` covers the delivered markup, the announced destinations, the
served art budget, the prelaunch and live-preview states, the verification and chain gates, address
copying and its failure path, unsafe URLs, and the wallet's ordering, chain comparison, rejection,
missing-wallet and project-id paths. `node tests/wallet.test.cjs` is a source-level check that the
wallet code names no method outside the read-only allowlist and contains no signing or transaction
call. Browser QA was run headless at 1280 and 390 CSS pixels: no horizontal overflow at either
width, icons present in the header and footer, hero buttons pointing at the announced destinations,
and the modal opening with MetaMask first.
