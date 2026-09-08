import { describe, expect, it } from 'vitest'
import {
  isLivePreviewAllowed,
  isLivePreviewRequested,
  resolveDisplayState,
  resolveLaunchGate,
} from '../config/launch'
import { siteConfig } from '../site.config'
import type { SiteConfig } from '../config/types'

const CONTRACT = '0x1111111111111111111111111111111111111111'

function configWith(overrides: Partial<SiteConfig>): SiteConfig {
  return { ...siteConfig, ...overrides }
}

function launchReady(): SiteConfig {
  return configWith({
    launchMode: 'live',
    token: { ...siteConfig.token, contractAddress: CONTRACT },
    links: { ...siteConfig.links, tradeVenue: 'https://venue.example/myse' },
  })
}

describe('resolveLaunchGate', () => {
  it('keeps the shipped config in coming-soon mode', () => {
    const gate = resolveLaunchGate(siteConfig)
    expect(gate.mode).toBe('coming-soon')
    expect(gate.requested).toBe('coming-soon')
  })

  it('allows live mode once contract, network and trade venue are all present', () => {
    const gate = resolveLaunchGate(launchReady())
    expect(gate.blockers).toEqual([])
    expect(gate.mode).toBe('live')
  })

  it('refuses live mode without a contract address', () => {
    const gate = resolveLaunchGate(configWith({ launchMode: 'live' }))
    expect(gate.mode).toBe('coming-soon')
    expect(gate.blockers).toContain('token.contractAddress is not set')
  })

  it('refuses live mode without a trade destination', () => {
    const config = launchReady()
    const gate = resolveLaunchGate({ ...config, links: { ...config.links, tradeVenue: null } })
    expect(gate.mode).toBe('coming-soon')
    expect(gate.blockers).toContain('links.tradeVenue is not set')
  })

  it('refuses live mode when the network is not verified', () => {
    const config = launchReady()
    const gate = resolveLaunchGate({ ...config, network: { ...config.network, verified: false } })
    expect(gate.mode).toBe('coming-soon')
    expect(gate.blockers).toContain('network.verified is false')
  })

  it('refuses live mode when the network is verified but incomplete', () => {
    const config = launchReady()
    const gate = resolveLaunchGate({ ...config, network: { ...config.network, chainId: null } })
    expect(gate.mode).toBe('coming-soon')
    expect(gate.blockers).toContain('network.chainId is not set')
  })

  it('rejects a malformed contract address', () => {
    const config = launchReady()
    const gate = resolveLaunchGate({ ...config, token: { ...config.token, contractAddress: '0xabc' } })
    expect(gate.mode).toBe('coming-soon')
    expect(gate.blockers).toContain('token.contractAddress is not a 20-byte hex address')
  })

  it('rejects the zero address as a contract address', () => {
    const config = launchReady()
    const zero = '0x0000000000000000000000000000000000000000'
    const gate = resolveLaunchGate({ ...config, token: { ...config.token, contractAddress: zero } })
    expect(gate.mode).toBe('coming-soon')
    expect(gate.blockers).toContain('token.contractAddress is the zero address')
  })
})

describe('live preview gating', () => {
  it('reads the query flag', () => {
    expect(isLivePreviewRequested('?mode=live-preview')).toBe(true)
    expect(isLivePreviewRequested('?mode=live')).toBe(false)
    expect(isLivePreviewRequested('')).toBe(false)
  })

  it('is allowed in dev or behind the build flag, and otherwise not', () => {
    expect(isLivePreviewAllowed({ DEV: true })).toBe(true)
    expect(isLivePreviewAllowed({ DEV: false, VITE_ALLOW_LIVE_PREVIEW: '1' })).toBe(true)
    expect(isLivePreviewAllowed({ DEV: false })).toBe(false)
    expect(isLivePreviewAllowed({ DEV: false, VITE_ALLOW_LIVE_PREVIEW: '0' })).toBe(false)
  })

  it('ignores the query flag when preview is not allowed', () => {
    const state = resolveDisplayState(siteConfig, {
      search: '?mode=live-preview',
      livePreviewAllowed: false,
    })
    expect(state.preview).toBe(false)
    expect(state.mode).toBe('coming-soon')
  })

  it('renders live layout in preview even though the real config is blocked', () => {
    const state = resolveDisplayState(siteConfig, {
      search: '?mode=live-preview',
      livePreviewAllowed: true,
    })
    expect(state.preview).toBe(true)
    expect(state.mode).toBe('live')
    expect(state.blockers.length).toBeGreaterThan(0)
  })
})
