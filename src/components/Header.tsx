import type { BrandConfig, LinksConfig } from '../config/types'
import { SocialLinks } from './SocialLinks'
import { WalletSheet } from '../wallet/WalletSheet'

export function Header({ brand, links }: { brand: BrandConfig; links: LinksConfig }) {
  return (
    <header>
      <a className="brand" href="/" aria-label={`${brand.fullName} home`}>
        {brand.shortName}
        <small>{brand.fullName}</small>
      </a>
      <div className="header-side">
        <SocialLinks links={links} />
        <WalletSheet />
      </div>
    </header>
  )
}
