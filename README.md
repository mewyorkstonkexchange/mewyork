# mewyork

Static site for mewyork.xyz.

```bash
npm install
npm run dev        # local dev server
npm test           # vitest
npx tsc --noEmit   # typecheck
npm run build      # -> dist/
```

The site renders coming-soon. Live mode is gated: see `docs/launch-switch.md`.
Content, links and copy live in `src/site.config.ts`. Artwork is delivered and recorded in
`assets/manifest.json`; see `docs/asset-requests.md`.

Wallet connection is read-only and session-only. WalletConnect needs a free project id in
`VITE_WALLETCONNECT_PROJECT_ID`; until it is set that option renders disabled. See
`docs/architecture.md`.

A development-only live preview with labelled mock data is available at
`?mode=live-preview`, and only when running `npm run dev` or when the build sets
`VITE_ALLOW_LIVE_PREVIEW=1`.

Deploys publish `dist/` to GitHub Pages via `.github/workflows/pages.yml`.
