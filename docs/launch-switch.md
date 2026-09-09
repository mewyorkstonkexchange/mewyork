# Launch switch

The site renders coming-soon until every item below is true. Setting a date, or setting
`launchMode: 'live'` on its own, does nothing: `resolveLaunchGate` in
`src/config/launch.ts` fails closed and returns coming-soon with a list of blockers.

## What the page shows before the switch

The contract-address section renders in both modes, with the same five rows. Every row
whose config value is still null shows the placeholder `Not yet published`, and the copy
button on an unpublished address row is disabled:

| Row | Source | Before the switch |
| --- | --- | --- |
| Token contract | `token.contractAddress` | `Not yet published`, copy disabled |
| Pool address | `token.poolAddress` | `Not yet published`, copy disabled |
| Network | `network.label` + `network.chainId` | Robinhood Chain (chain id 4663) — verified |
| Explorer | `links.explorer` | `Not yet published` |
| Trade | `links.tradeVenue` | `Not yet published` |

The placeholder is the only thing an unfilled row ever prints. No mock, example or partial
address reaches the published page; the labelled mock values in `src/config/mock.ts` exist
only for the dev-only live preview and are compiled out of a production build.

## Gate

Live mode renders only when all of these hold:

1. `token.contractAddress` is set, is a 20-byte hex address, and is not the zero address.
2. `network.verified` is `true`.
3. `network.chainId`, `network.rpcUrl`, `network.explorerUrl` and `network.nativeCurrency` are all set.
4. `links.tradeVenue` is set.

`npm test` covers each of these refusals.

## Checklist

Before flipping the switch:

- [ ] Contract deployed, address copied from the deployment transaction, not from a message.
- [ ] Address pasted into `token.contractAddress` and read back character by character against the explorer. The Token contract row stops showing `Not yet published`.
- [ ] Pool address pasted into `token.poolAddress`, so the Pool address row stops showing `Not yet published`. It must be a different address; validation rejects a match.
- [ ] `links.explorer` set to the explorer base URL, so the Explorer row links out instead of showing `Not yet published`.
- [ ] `links.tradeVenue` set to the venue page for this token, so the Trade row links out instead of showing `Not yet published`.
- [ ] `token.name`, `token.symbol`, `token.chain`, `token.totalSupply`, `token.pairingAsset`, `token.venue` filled in or deliberately left null.
- [ ] `links.x` and `links.telegram` set if those accounts exist.
- [ ] `thesis.unlockMarketCapUsd` still matches the figure the founder is stating publicly.
- [ ] `npm test` passes, including the validation suite.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes and `dist/` is inspected locally with `npx vite preview`.
- [ ] Both address rows checked on the built page: the copy buttons are enabled, and each copied address pasted back into the explorer matches exactly.
- [ ] Every claim on the page still matches what is true: no exchange, no backing, no redemption, no index, no affiliation.
- [ ] `launchMode` set to `'live'` in `src/site.config.ts`.
- [ ] `VITE_ALLOW_LIVE_PREVIEW` is unset in the production build environment.

## Rollback

Reverting is a one-line change plus a deploy:

1. Set `launchMode: 'coming-soon'` in `src/site.config.ts`.
2. Commit and push. Pages rebuilds; the token block disappears and the coming-soon status line returns.

If the contract address itself is wrong, roll back first and correct second. Blank the
`token.contractAddress` field as well as the mode, so a later mode flip cannot republish a
bad address, and so the row returns to `Not yet published` rather than showing the wrong
value. Do not edit only the address and leave live mode on.

If the deploy pipeline is the problem rather than the content, the previous artifact can be
restored by re-running the last green Pages deployment from the Actions history.
