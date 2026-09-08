import type { LinksConfig } from '../config/types'

const LABELS: Record<keyof LinksConfig, string> = {
  x: 'X',
  telegram: 'Telegram',
  explorer: 'Explorer',
  tradeVenue: 'Trade venue',
}

type CommunityLinksProps = {
  links: LinksConfig
  /** Keys to render. Unconfigured keys are shown as unavailable rather than hidden. */
  show: (keyof LinksConfig)[]
}

export function CommunityLinks({ links, show }: CommunityLinksProps) {
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {show.map((key) => {
        const href = links[key]
        return (
          <li key={key}>
            {href ? (
              <a
                className="inline-block rounded-md border border-ivory/30 px-3 py-1.5 text-sm text-ivory hover:border-pink hover:text-pink"
                href={href}
                rel="noreferrer noopener"
                target="_blank"
              >
                {LABELS[key]}
              </a>
            ) : (
              <span className="inline-block rounded-md border border-ivory/15 px-3 py-1.5 text-sm text-ivory-dim/70">
                {LABELS[key]} — not announced yet
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
