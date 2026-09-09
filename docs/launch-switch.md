# Launch switch

Everything the owner changes at launch is in `config.js` at the repository root. It holds public
values only; no secrets belong in it. Edit the file, commit, push to `main`, and the Pages workflow
redeploys the site.

## Fields

| Field | What it does |
| --- | --- |
| `contract` | Token contract address. The record section stays hidden until it is a nonzero 40-hex-digit address, `verified` is true, `launchStatus` is `live` and `links.trade` is a valid HTTPS URL. |
| `verified` | Set true only after reading the address back against the explorer, character by character. Until then the page shows no address anywhere. |
| `launchStatus` | `prelaunch` or `live`. `live` reveals the record section and changes the launch line and the launched-yet answer, and only when every condition above holds. |
| `links.trade` | Exact trade destination. Rendered as a record link rather than a buy button, over HTTPS only, with no embedded credentials. |
| `links.explorer`, `links.chart` | Same rules. Both stay disabled until the launch is verified. |
| `links.x`, `links.telegram` | The announced community destinations. They drive the header and footer icons and the hero, Chairman and closing buttons. A non-HTTPS value makes those links inert rather than broken. |
| `tokenName`, `supply`, `pairing`, `venue`, `fees`, `founderDisclosure` | Free text shown in the record grid once the launch is verified. Empty values keep the delivered placeholder text. |
| `chainId` | 4663. The wallet code derives `0x1237` from it and warns when a connected wallet reports another network. |
| `walletConnectProjectId` | WalletConnect Cloud project id. Empty means the mobile option in the connect modal stays visibly disabled and no WalletConnect code is fetched. |

`live-preview.html` renders the token-live layout at any time using the same config, so the launch
layout can be reviewed without claiming a launch.

## Order at launch

1. Deploy the contract, copy the address from the deployment transaction, not from a message.
2. Paste `contract`, leaving `verified` false, push, and read it back on `live-preview.html` against the explorer.
3. Set `links.explorer`, `links.trade` and, if there is one, `links.chart`.
4. Set `verified: true`, push, and confirm the copy button produces the full address.
5. Set `launchStatus: 'live'` last, and only after step 4 is confirmed on the live site.

## Rollback

Set `launchStatus` back to `'prelaunch'` and `verified` back to `false`, commit and push. The record
section disappears and the coming-soon line comes back.

If an address itself is wrong, blank `contract` in the same commit as the status change, so a later
flip cannot republish a bad address. Do not correct the address while leaving live mode on. If the
deploy pipeline is the problem rather than the content, re-run the last green Pages deployment from
the Actions history.
