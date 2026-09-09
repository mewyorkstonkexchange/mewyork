import { isAddress, resolveLaunchGate, ZERO_ADDRESS } from './launch'
import type { SiteConfig } from './types'

export type ValidationResult = {
  ok: boolean
  errors: string[]
  warnings: string[]
}

function isHttps(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:'
  } catch {
    return false
  }
}

export function validateSiteConfig(config: SiteConfig): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  for (const [key, value] of Object.entries(config.brand)) {
    if (typeof value !== 'string' || value.trim() === '') errors.push(`brand.${key} is empty`)
  }

  for (const [key, value] of Object.entries(config.contractNotice)) {
    if (typeof value !== 'string' || value.trim() === '') errors.push(`contractNotice.${key} is empty`)
  }

  for (const [key, value] of Object.entries(config.chairman)) {
    if (typeof value !== 'string' || value.trim() === '') errors.push(`chairman.${key} is empty`)
  }

  if (config.launchMode !== 'coming-soon' && config.launchMode !== 'live') {
    errors.push(`launchMode "${String(config.launchMode)}" is not a valid mode`)
  }

  const { network } = config
  if (network.label.trim() === '') errors.push('network.label is empty')
  if (network.verified) {
    if (network.chainId == null) errors.push('network.verified is true but chainId is null')
    if (!network.rpcUrl) errors.push('network.verified is true but rpcUrl is null')
    if (!network.explorerUrl) errors.push('network.verified is true but explorerUrl is null')
    if (!network.nativeCurrency) errors.push('network.verified is true but nativeCurrency is null')
    if (network.verificationNote.trim() === '') {
      errors.push('network.verified is true but verificationNote is empty')
    }
  } else if (network.chainId != null || network.rpcUrl || network.explorerUrl) {
    warnings.push('network carries values while verified is false; they will not be presented as fact')
  }
  if (network.chainId != null && (!Number.isInteger(network.chainId) || network.chainId <= 0)) {
    errors.push('network.chainId must be a positive integer')
  }
  for (const [key, url] of [
    ['network.rpcUrl', network.rpcUrl],
    ['network.explorerUrl', network.explorerUrl],
  ] as const) {
    if (url && !isHttps(url)) errors.push(`${key} must be an https URL`)
  }
  if (network.nativeCurrency && network.nativeCurrency.decimals !== 18) {
    warnings.push('network.nativeCurrency.decimals is not 18')
  }

  const { token } = config
  for (const [key, address] of [
    ['token.contractAddress', token.contractAddress],
    ['token.poolAddress', token.poolAddress],
  ] as const) {
    if (address !== null && !isAddress(address)) errors.push(`${key} is not a 20-byte hex address`)
    if (address !== null && address.toLowerCase() === ZERO_ADDRESS) {
      errors.push(`${key} is the zero address`)
    }
  }
  if (
    token.contractAddress &&
    token.poolAddress &&
    token.contractAddress.toLowerCase() === token.poolAddress.toLowerCase()
  ) {
    errors.push('token.contractAddress and token.poolAddress must be different addresses')
  }

  for (const [key, url] of Object.entries(config.links)) {
    if (url !== null && !isHttps(url)) errors.push(`links.${key} must be an https URL`)
  }

  // The notice tells readers to trust one account only; without that link it is unusable.
  if (!config.links.x) errors.push('links.x is required: the contract-address notice points at it')

  const seen = new Set<string>()
  for (const entry of config.faq) {
    if (seen.has(entry.id)) errors.push(`faq id "${entry.id}" is duplicated`)
    seen.add(entry.id)
    if (entry.question.trim() === '' || entry.answer.trim() === '') {
      errors.push(`faq entry "${entry.id}" has an empty question or answer`)
    }
  }

  if (config.disclosures.length === 0) errors.push('disclosures must not be empty')

  const { analytics } = config
  if (analytics.provider !== 'none') {
    if (!analytics.scriptUrl) errors.push('analytics.scriptUrl is required when a provider is set')
    else if (!isHttps(analytics.scriptUrl)) errors.push('analytics.scriptUrl must be an https URL')
    if (!analytics.siteId) errors.push('analytics.siteId is required when a provider is set')
  }

  if (config.launchMode === 'live') {
    const gate = resolveLaunchGate(config)
    for (const blocker of gate.blockers) errors.push(`launchMode is live but ${blocker}`)
  }

  return { ok: errors.length === 0, errors, warnings }
}
