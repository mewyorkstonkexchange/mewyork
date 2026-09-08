import type { AnalyticsConfig } from '../config/types'

export type AnalyticsEvent = {
  name: string
  props?: Record<string, string | number | boolean>
}

export type Analytics = {
  provider: string
  enabled: boolean
  init: () => void
  track: (event: AnalyticsEvent) => void
}

const noop: Analytics = {
  provider: 'none',
  enabled: false,
  init: () => {},
  track: () => {},
}

function doNotTrackEnabled(): boolean {
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & { msDoNotTrack?: string }
  const win = typeof window === 'undefined' ? undefined : (window as Window & { doNotTrack?: string })
  return nav.doNotTrack === '1' || nav.msDoNotTrack === '1' || win?.doNotTrack === '1'
}

/**
 * Loads nothing by default. A provider script is only injected once a script URL and a
 * site id are configured, and never when the visitor sends Do Not Track. No cookies, no
 * identifiers and no event payloads are sent from here.
 */
export function createAnalytics(config: AnalyticsConfig): Analytics {
  if (config.provider === 'none' || !config.scriptUrl || !config.siteId) return noop
  if (config.respectDoNotTrack && doNotTrackEnabled()) return noop
  if (typeof document === 'undefined') return noop

  const { provider, scriptUrl, siteId } = config
  let loaded = false

  return {
    provider,
    enabled: true,
    init() {
      if (loaded) return
      loaded = true
      const script = document.createElement('script')
      script.defer = true
      script.src = scriptUrl
      if (provider === 'plausible') script.setAttribute('data-domain', siteId)
      if (provider === 'umami') script.setAttribute('data-website-id', siteId)
      document.head.appendChild(script)
    },
    track(event) {
      const win = window as Window & {
        plausible?: (name: string, options?: { props?: AnalyticsEvent['props'] }) => void
        umami?: { track: (name: string, props?: AnalyticsEvent['props']) => void }
      }
      if (provider === 'plausible' && win.plausible) {
        win.plausible(event.name, event.props ? { props: event.props } : undefined)
      }
      if (provider === 'umami' && win.umami) win.umami.track(event.name, event.props)
    },
  }
}
