import type { LaunchMode, SiteConfig } from './types'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function isAddress(value: unknown): value is string {
  return typeof value === 'string' && /^0x[0-9a-fA-F]{40}$/.test(value)
}

export type LaunchGate = {
  /** The mode that will actually render. */
  mode: LaunchMode
  /** The mode the config asked for. */
  requested: LaunchMode
  /** Empty when live mode is allowed to render. */
  blockers: string[]
}

/**
 * Live mode is opt-in and fail-closed: a requested mode of 'live' still renders
 * coming-soon unless the contract address, the network and the trade destination
 * are all present and the network metadata is marked verified.
 */
export function resolveLaunchGate(config: SiteConfig): LaunchGate {
  const blockers: string[] = []
  const { token, network, links } = config

  if (!token.contractAddress) {
    blockers.push('token.contractAddress is not set')
  } else if (!isAddress(token.contractAddress)) {
    blockers.push('token.contractAddress is not a 20-byte hex address')
  } else if (token.contractAddress.toLowerCase() === ZERO_ADDRESS) {
    blockers.push('token.contractAddress is the zero address')
  }

  if (!network.verified) blockers.push('network.verified is false')
  if (network.chainId == null) blockers.push('network.chainId is not set')
  if (!network.rpcUrl) blockers.push('network.rpcUrl is not set')
  if (!network.explorerUrl) blockers.push('network.explorerUrl is not set')
  if (!network.nativeCurrency) blockers.push('network.nativeCurrency is not set')

  if (!links.tradeVenue) blockers.push('links.tradeVenue is not set')

  const requested = config.launchMode
  const mode: LaunchMode = requested === 'live' && blockers.length === 0 ? 'live' : 'coming-soon'
  return { mode, requested, blockers }
}

export const LIVE_PREVIEW_PARAM = 'mode'
export const LIVE_PREVIEW_VALUE = 'live-preview'

/** The dev-only preview is compiled out of an ordinary production build. */
export function isLivePreviewAllowed(env: { DEV?: boolean; VITE_ALLOW_LIVE_PREVIEW?: string } = import.meta.env): boolean {
  return env.DEV === true || env.VITE_ALLOW_LIVE_PREVIEW === '1'
}

export function isLivePreviewRequested(search: string): boolean {
  return new URLSearchParams(search).get(LIVE_PREVIEW_PARAM) === LIVE_PREVIEW_VALUE
}

export type DisplayState = LaunchGate & { preview: boolean }

export function resolveDisplayState(
  config: SiteConfig,
  options: { search: string; livePreviewAllowed: boolean },
): DisplayState {
  const gate = resolveLaunchGate(config)
  const preview = options.livePreviewAllowed && isLivePreviewRequested(options.search)
  if (preview) return { ...gate, mode: 'live', preview: true }
  return { ...gate, preview: false }
}
