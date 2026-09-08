# Launch switch

The site renders coming-soon until every item below is true. Setting a date, or setting
`launchMode: 'live'` on its own, does nothing: `resolveLaunchGate` in
`src/config/launch.ts` fails closed and returns coming-soon with a list of blockers.

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
- [ ] Address pasted into `token.contractAddress` and read back character by character against the explorer.
- [ ] Pool address pasted into `token.poolAddress`. It must be a different address; validation rejects a match.
- [ ] `token.name`, `token.symbol`, `token.chain`, `token.totalSupply`, `token.pairingAsset`, `token.venue` filled in or deliberately left null.
- [ ] `links.explorer` set to the explorer base URL, `links.tradeVenue` set to the venue page for this token.
- [ ] `links.x` and `links.telegram` set if those accounts exist.
- [ ] `npm test` passes, including the validation suite.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes and `dist/` is inspected locally with `npx vite preview`.
- [ ] Contract address on the built page copied with the copy button and pasted back into the explorer. It must match exactly.
- [ ] Every claim on the page still matches what is true: no exchange, no backing, no redemption, no index, no affiliation.
- [ ] `launchMode` set to `'live'` in `src/site.config.ts`.
- [ ] `VITE_ALLOW_LIVE_PREVIEW` is unset in the production build environment.

## Rollback

Reverting is a one-line change plus a deploy:

1. Set `launchMode: 'coming-soon'` in `src/site.config.ts`.
2. Commit and push. Pages rebuilds; the token block disappears and the coming-soon status line returns.

If the contract address itself is wrong, roll back first and correct second. Blank the
`token.contractAddress` field as well as the mode, so a later mode flip cannot republish a
bad address. Do not edit only the address and leave live mode on.

If the deploy pipeline is the problem rather than the content, the previous artifact can be
restored by re-running the last green Pages deployment from the Actions history.
