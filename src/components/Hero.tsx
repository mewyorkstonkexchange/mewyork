import type { ChairmanConfig, BrandConfig, LinksConfig } from '../config/types'

export function Hero({
  brand,
  chairman,
  links,
}: {
  brand: BrandConfig
  chairman: ChairmanConfig
  links: LinksConfig
}) {
  return (
    <section className="hero">
      <picture className="hero-art">
        <source srcSet="/hero-chairman.webp" type="image/webp" />
        <img src="/hero-chairman.png" alt="" aria-hidden="true" fetchPriority="high" />
      </picture>

      <div className="hero-copy">
        <picture className="hero-portrait">
          <source srcSet="/chairman-portrait.webp" type="image/webp" />
          <img src="/chairman-portrait.png" alt={chairman.imageAlt} width={688} height={900} />
        </picture>

        <p className="lockup">
          <strong>{brand.shortName}</strong>
          <span>{brand.fullName}</span>
        </p>

        <h1>
          {brand.headlineLead}
          <br />
          <em>{brand.headlineEmphasis}</em>
        </h1>

        <p className="support">{brand.tagline}</p>
        <p className="support-alt">{brand.supportLine}</p>

        <div className="actions">
          {links.x ? (
            <a className="primary" href={links.x} target="_blank" rel="noopener noreferrer">
              Follow on X <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {links.telegram ? (
            <a className="secondary" href={links.telegram} target="_blank" rel="noopener noreferrer">
              Join Telegram <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
