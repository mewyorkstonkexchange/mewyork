# mewyork

Static site for mewyork.xyz: `index.html` and `live-preview.html` at the repository root, with
`style.css`, `app.js` and `config.js` beside them and no build step. The page is the original
prelaunch design, with the announced X and Telegram destinations and a read-only wallet session
added to it. Every public value the owner edits — launch status, verification flag, contract, chain
id, record fields and the community, explorer and trade links — lives in `config.js`; see
`docs/launch-switch.md`. Pushing to `main` deploys the repository root to GitHub Pages through
`.github/workflows/pages.yml`. Run the checks with `node tests/site.test.cjs` and
`node tests/wallet.test.cjs`.
