import type { SiteConfig } from '../config/types'

function Cell({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      {label}
      <strong>{value ?? 'Not announced'}</strong>
    </div>
  )
}

export function TokenFacts({ config }: { config: SiteConfig }) {
  const { token, network, links } = config
  return (
    <section id="token" className="token-section" aria-labelledby="token-heading">
      <p className="section-label">THE OFFICIAL RECORD</p>
      <h2 id="token-heading">The bell has rung.</h2>
      <div className="token-grid">
        <Cell label="Token" value={token.name} />
        <Cell label="Symbol" value={token.symbol} />
        <Cell label="Network" value={token.chain ?? network.label} />
        <Cell label="Supply" value={token.totalSupply} />
        <Cell label="Pairing" value={token.pairingAsset} />
        <Cell label="Venue" value={token.venue} />
      </div>
      {links.tradeVenue ? (
        <div className="actions">
          <a className="primary" href={links.tradeVenue} target="_blank" rel="noopener noreferrer">
            Trade {token.symbol ?? config.brand.shortName} <span aria-hidden="true">↗</span>
          </a>
          {links.explorer ? (
            <a className="secondary" href={links.explorer} target="_blank" rel="noopener noreferrer">
              Explorer <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
