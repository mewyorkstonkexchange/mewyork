import type { SiteConfig } from '../config/types'
import { ContractAddress } from './ContractAddress'

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1 border-t border-ivory/10 py-3 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="font-mono text-[11px] uppercase tracking-widest text-ivory-dim sm:w-40 sm:shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-ivory">{value ?? 'Not announced'}</dd>
    </div>
  )
}

export function TokenFacts({ config }: { config: SiteConfig }) {
  const { token, network, links } = config
  return (
    <section aria-labelledby="token-heading" className="flex flex-col gap-4">
      <h2 id="token-heading" className="font-mono text-xs uppercase tracking-widest text-ivory-dim">
        Token
      </h2>
      <dl className="flex flex-col">
        <Row label="Name" value={token.name} />
        <Row label="Symbol" value={token.symbol} />
        <Row label="Chain" value={token.chain ?? network.label} />
        <Row label="Supply" value={token.totalSupply} />
        <Row label="Pairing asset" value={token.pairingAsset} />
        <Row label="Venue" value={token.venue} />
      </dl>
      {token.contractAddress ? (
        <ContractAddress label="Contract address" address={token.contractAddress} explorerUrl={links.explorer} />
      ) : null}
      {token.poolAddress ? (
        <ContractAddress label="Pool address" address={token.poolAddress} explorerUrl={links.explorer} />
      ) : null}
    </section>
  )
}
