# Engineering handoff

Open MYSE_Prelaunch_Design.html for the updated self-contained design. Open MYSE_Token_Live_Design.html for the separate, explicitly labeled launch-layout preview. Use website/ as the editable source. No build dependency is required.

All owner-editable public data is in website/config.js: contract, poolAddress, networkName, chainId, utilityMarketCapUSD, xHandle, siteURL and social/explorer/trade links. Both routes use the same config. The markup contains initial values generated from that config for first paint; app.js updates the visible values and hrefs when config changes. Set the canonical HTTPS siteURL and stamp absolute og:image/twitter:image URLs into both HTML heads during the production build; client-side metadata updates alone are insufficient for many social crawlers. The approved social-card file is included. Local previews embed it for portability.

Initially launchStatus is prelaunch, verified is false, and all token/pool/explorer/trade values are empty. Copy buttons remain disabled. A nonzero 40-hex-digit address plus verified=true enables its corresponding copy action. Pool and token addresses cannot be identical. The full configured address is copied. Explorer/trade links require the verified token plus HTTPS URLs without embedded credentials. Changing launchStatus to live additionally requires a valid chain ID and trade URL before live copy appears. The live preview does not manufacture populated sample addresses.

The $5M milestone and utility/evolution statements are owner-supplied product copy, not verified implementation or a market-cap feed. No automatic unlock mechanism is implemented. Future engineering must define the milestone measurement and fulfillment separately. Until then, the site shows the requested announcement only.

Wallet modal and injected-wallet session behavior are retained. Numeric chainId 4663 is converted to hexadecimal 0x1237 for comparison. Connection requests only eth_requestAccounts and eth_chainId. No approvals, signatures or transactions. Mobile provider integration and real-wallet/browser testing remain outstanding. These files are not a deployment to the existing public site.

Verified chain source, checked 9 September 2026: https://docs.robinhood.com/chain/connecting/
The X and Telegram destinations were supplied by the owner; no account changes or messages were sent.

Validation: JavaScript syntax; exact section order; four FAQ entries; local assets; copy-address handling and failure states; verification gates; distinct token/pool values; unsafe URLs; config-driven milestone; wallet network comparison, rejection, missing wallet and disconnect cleanup. Run node tests/revision.test.cjs from the extracted package. No browser visual QA is claimed.
