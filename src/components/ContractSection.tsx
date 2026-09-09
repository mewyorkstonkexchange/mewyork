import type { SiteConfig } from '../config/types'
import { ContractAddress } from './ContractAddress'

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="record-row">
      <dt>{label}</dt>
      <dd>
        <span className="record-value">{value}</span>
      </dd>
    </div>
  )
}

function LinkRow({
  label,
  url,
  placeholder,
}: {
  label: string
  url: string | null
  placeholder: string
}) {
  return (
    <div className="record-row">
      <dt>{label}</dt>
      <dd>
        {url ? (
          <a className="record-value record-link" href={url} target="_blank" rel="noopener noreferrer">
            {url} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="record-value is-empty">{placeholder}</span>
        )}
      </dd>
    </div>
  )
}

export function ContractSection({ config }: { config: SiteConfig }) {
  const { contractSection, token, network, links } = config
  const { placeholder } = contractSection
  const networkValue =
    network.chainId == null ? network.label : `${network.label} (chain id ${network.chainId})`

  return (
    <section id="contract-address" className="record" aria-labelledby="contract-heading">
      <div className="record-panel">
        <h2 id="contract-heading">{contractSection.heading}</h2>
        <p className="record-lead">{contractSection.lead}</p>
        <dl className="record-rows">
          <ContractAddress
            label="Token contract"
            address={token.contractAddress}
            placeholder={placeholder}
            explorerUrl={links.explorer}
          />
          <ContractAddress
            label="Pool address"
            address={token.poolAddress}
            placeholder={placeholder}
            explorerUrl={links.explorer}
          />
          <FactRow label="Network" value={networkValue} />
          <LinkRow label="Explorer" url={links.explorer} placeholder={placeholder} />
          <LinkRow label="Trade" url={links.tradeVenue} placeholder={placeholder} />
        </dl>
        {links.x ? (
          <a className="primary" href={links.x} target="_blank" rel="noopener noreferrer">
            {contractSection.ctaLabel} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </section>
  )
}
