import { siteConfig } from './site.config'
import { isLivePreviewAllowed, resolveDisplayState } from './config/launch'
import { withMockLiveData } from './config/mock'
import type { SiteConfig } from './config/types'
import { WalletProvider } from './wallet/WalletProvider'
import { WalletPanel } from './wallet/WalletPanel'
import { Placeholder } from './components/Placeholder'
import { PreviewBanner } from './components/PreviewBanner'
import { CommunityLinks } from './components/CommunityLinks'
import { TokenFacts } from './components/TokenFacts'
import { Faq } from './components/Faq'
import { Disclosures } from './components/Disclosures'

export function App() {
  const search = typeof window === 'undefined' ? '' : window.location.search
  const state = resolveDisplayState(siteConfig, {
    search,
    livePreviewAllowed: isLivePreviewAllowed(),
  })
  const config = state.preview ? withMockLiveData(siteConfig) : siteConfig

  return (
    <WalletProvider>
      {state.preview ? <PreviewBanner /> : null}
      <Site config={config} live={state.mode === 'live'} />
    </WalletProvider>
  )
}

function Site({ config, live }: { config: SiteConfig; live: boolean }) {
  const { brand, links } = config

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy-deep to-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-12 px-5 py-10 sm:px-8 sm:py-16">
        <header className="flex flex-col gap-6">
          <Placeholder
            id="LOGO-01"
            description="wordmark lockup"
            dimensions="512x128, 4:1, SVG"
            className="w-full max-w-xs"
          />
          <div className="flex flex-col gap-3">
            <h1 className="flex flex-col gap-1">
              <span className="text-4xl font-black tracking-tight text-pink sm:text-6xl">
                {brand.shortName}
              </span>
              <span className="font-mono text-sm uppercase tracking-[0.2em] text-ivory sm:text-lg">
                {brand.fullName}
              </span>
            </h1>
            <p className="text-lg text-ivory sm:text-xl">{brand.tagline}</p>
            <p className="text-base text-ivory-dim">{brand.supportLine}</p>
            {live ? null : (
              <p className="font-mono text-sm uppercase tracking-widest text-green">{brand.statusLine}</p>
            )}
          </div>
        </header>

        <Placeholder
          id="HERO-01"
          description="hero — card-covered office"
          dimensions="1600x900, 16:9, WebP with PNG fallback"
          className="aspect-video w-full"
        />

        <section aria-labelledby="wallet-heading" className="flex flex-col gap-3">
          <h2 id="wallet-heading" className="font-mono text-xs uppercase tracking-widest text-ivory-dim">
            Wallet
          </h2>
          <WalletPanel />
        </section>

        {live ? <TokenFacts config={config} /> : null}

        <section aria-labelledby="links-heading" className="flex flex-col gap-3">
          <h2 id="links-heading" className="font-mono text-xs uppercase tracking-widest text-ivory-dim">
            Links
          </h2>
          <CommunityLinks
            links={links}
            show={live ? ['x', 'telegram', 'explorer', 'tradeVenue'] : ['x', 'telegram']}
          />
        </section>

        <Faq entries={config.faq} />

        <footer className="mt-auto flex flex-col gap-6 border-t border-ivory/10 pt-8">
          <Placeholder
            id="CHAIRMAN-CUTOUT-01"
            description="footer character cutout"
            dimensions="800x1000, 4:5, transparent PNG"
            className="min-h-40 w-full max-w-[16rem]"
          />
          <Disclosures items={config.disclosures} />
          <p className="font-mono text-[11px] text-ivory-dim/70">mewyork.xyz</p>
        </footer>
      </div>
    </div>
  )
}
