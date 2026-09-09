import type { ChairmanConfig } from '../config/types'

export function Chairman({ chairman }: { chairman: ChairmanConfig }) {
  return (
    <section className="chairman" aria-labelledby="chairman-heading">
      <div className="portrait">
        <picture>
          <source srcSet="/hero-chairman.webp" type="image/webp" />
          <img src="/hero-chairman.png" alt={chairman.imageAlt} width={1600} height={900} loading="lazy" />
        </picture>
      </div>
      <h2 id="chairman-heading" className="chairman-line">
        {chairman.line}
      </h2>
    </section>
  )
}
