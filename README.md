# mewyork

Static site for mewyork.xyz: `index.html` and `live-preview.html` at the repository root, with
`style.css`, `app.js` and `config.js` beside them and no build step. Every public value the owner
edits — contract, pool address, explorer and trade links, launch status, verification flag and
canonical site URL — lives in `config.js`; see `docs/launch-switch.md`. Pushing to `main` deploys
the repository root to GitHub Pages through `.github/workflows/pages.yml`. Run the checks with
`node tests/revision.test.cjs` and `node tests/wallet.test.cjs`.
