import type { ThesisConfig } from '../config/types'
import { fillTemplate, formatCompactUsd } from '../lib/format'

export function Thesis({ thesis }: { thesis: ThesisConfig }) {
  const marketCap = formatCompactUsd(thesis.unlockMarketCapUsd)
  return (
    <section id="thesis" className="thesis" aria-labelledby="thesis-heading">
      <div>
        <h2 id="thesis-heading">{thesis.heading}</h2>
      </div>
      <div className="thesis-body">
        {thesis.body.map((paragraph) => (
          <p key={paragraph}>{fillTemplate(paragraph, { marketCap })}</p>
        ))}
      </div>
    </section>
  )
}
