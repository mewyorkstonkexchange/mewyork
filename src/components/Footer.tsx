import type { BrandConfig, LinksConfig } from '../config/types'
import { SocialLinks } from './SocialLinks'

export function Footer({
  brand,
  links,
  disclosures,
}: {
  brand: BrandConfig
  links: LinksConfig
  disclosures: string[]
}) {
  return (
    <footer>
      <div className="footer-main">
        <div className="brand">
          {brand.shortName}
          <small>{brand.fullName}</small>
        </div>
        {disclosures.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
      <div className="footer-side">
        <SocialLinks links={links} />
      </div>
    </footer>
  )
}
