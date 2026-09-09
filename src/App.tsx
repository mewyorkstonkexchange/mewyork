import { siteConfig } from './site.config'
import { isLivePreviewAllowed, resolveDisplayState } from './config/launch'
import { withMockLiveData } from './config/mock'
import type { SiteConfig } from './config/types'
import { WalletProvider } from './wallet/WalletProvider'
import { PreviewBanner } from './components/PreviewBanner'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Thesis } from './components/Thesis'
import { ContractSection } from './components/ContractSection'
import { Chairman } from './components/Chairman'
import { TokenFacts } from './components/TokenFacts'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'

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
  const { brand, chairman, links } = config

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header brand={brand} links={links} />
      <main id="main">
        <Hero brand={brand} chairman={chairman} links={links} />
        <Thesis thesis={config.thesis} />
        <ContractSection config={config} />
        {live ? <TokenFacts config={config} /> : null}
        <Chairman chairman={chairman} />
        <Faq entries={config.faq} />
      </main>
      <Footer brand={brand} links={links} disclosures={config.disclosures} />
    </>
  )
}
