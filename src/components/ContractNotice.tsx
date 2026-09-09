import type { ContractNoticeConfig, LinksConfig } from '../config/types'

export function ContractNotice({
  notice,
  links,
}: {
  notice: ContractNoticeConfig
  links: LinksConfig
}) {
  return (
    <section id="contract-address" className="notice" aria-labelledby="contract-notice-heading">
      <div className="notice-panel">
        <h2 id="contract-notice-heading">{notice.heading}</h2>
        <p className="notice-body">{notice.body}</p>
        {links.x ? (
          <a className="primary" href={links.x} target="_blank" rel="noopener noreferrer">
            {notice.ctaLabel} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </section>
  )
}
