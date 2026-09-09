# Launch switch

Everything the owner changes at launch is in `config.js` at the repository root. It holds public
values only; no secrets belong in it. Edit the file, commit, push to `main`, and the Pages workflow
redeploys the site.

## Fields

| Field | What it does |
| --- | --- |
| `contract` | Token contract address. Shown, and copyable, only when it is a nonzero 40-hex-digit address and `verified` is true. Otherwise the row reads `Not yet published`. |
| `poolAddress` | Pool address, gated the same way. It must differ from `contract`; an identical value keeps the copy button disabled. |
| `links.explorer` | Exact explorer destination for the verified token. Rendered as a link only over HTTPS, with no embedded credentials, and only once the token is verified. |
| `links.trade` | Exact trade destination, rendered as a record link rather than a buy button, under the same rules. |
| `verified` | Set true only after reading both addresses back against the explorer, character by character. Until then every address row stays `Not yet published`. |
| `launchStatus` | `prelaunch` or `live`. `live` changes the headline and the launched-yet answer, and it takes effect only when the token is verified, the chain id is valid and `links.trade` is a valid HTTPS URL. |
| `siteURL` | Canonical HTTPS origin, `https://mewyork.xyz`. It drives the absolute social-card URL that `app.js` stamps into the metadata; the same absolute URLs are already written into both HTML heads for crawlers that do not run scripts. |
| `walletConnectProjectId` | WalletConnect Cloud project id. Empty means the mobile option in the connect modal stays visibly disabled and no WalletConnect code is fetched. |

`chainId` is 4663 and the wallet code derives `0x1237` from it. `utilityMarketCapUSD` is the
owner-supplied milestone that the page prints; nothing measures or unlocks it.

## Order at launch

1. Deploy the contract, copy the address from the deployment transaction, not from a message.
2. Paste `contract` and `poolAddress`, leaving `verified` false, push, and read both back on the live page against the explorer.
3. Set `links.explorer` and `links.trade`.
4. Set `verified: true`, push, and confirm both copy buttons produce the full addresses.
5. Set `launchStatus: 'live'` last, and only after step 4 is confirmed on the live site.

## Rollback

Set `launchStatus` back to `'prelaunch'` and `verified` back to `false`, commit and push. The rows
return to `Not yet published` and the coming-soon headline comes back.

If an address itself is wrong, blank `contract` and `poolAddress` in the same commit as the status
change, so a later flip cannot republish a bad address. Do not correct the address while leaving
live mode on. If the deploy pipeline is the problem rather than the content, re-run the last green
Pages deployment from the Actions history.
