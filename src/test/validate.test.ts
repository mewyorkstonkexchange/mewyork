import { describe, expect, it } from 'vitest'
import { validateSiteConfig } from '../config/validate'
import { siteConfig } from '../site.config'
import type { SiteConfig } from '../config/types'

const A = '0x1111111111111111111111111111111111111111'

function withOverrides(overrides: Partial<SiteConfig>): SiteConfig {
  return { ...siteConfig, ...overrides }
}

describe('validateSiteConfig', () => {
  it('accepts the shipped config', () => {
    const result = validateSiteConfig(siteConfig)
    expect(result.errors).toEqual([])
    expect(result.ok).toBe(true)
  })

  it('rejects a verified network with missing metadata', () => {
    const result = validateSiteConfig(
      withOverrides({ network: { ...siteConfig.network, chainId: null } }),
    )
    expect(result.ok).toBe(false)
    expect(result.errors).toContain('network.verified is true but chainId is null')
  })

  it('warns when an unverified network still carries values', () => {
    const result = validateSiteConfig(
      withOverrides({ network: { ...siteConfig.network, verified: false } }),
    )
    expect(result.warnings.join(' ')).toContain('verified is false')
  })

  it('rejects a contract address that equals the pool address', () => {
    const result = validateSiteConfig(
      withOverrides({ token: { ...siteConfig.token, contractAddress: A, poolAddress: A } }),
    )
    expect(result.errors).toContain(
      'token.contractAddress and token.poolAddress must be different addresses',
    )
  })

  it('rejects a malformed address', () => {
    const result = validateSiteConfig(
      withOverrides({ token: { ...siteConfig.token, contractAddress: 'not-an-address' } }),
    )
    expect(result.errors).toContain('token.contractAddress is not a 20-byte hex address')
  })

  it('rejects non-https links', () => {
    const result = validateSiteConfig(
      withOverrides({ links: { ...siteConfig.links, x: 'http://x.example/myse' } }),
    )
    expect(result.errors).toContain('links.x must be an https URL')
  })

  it('rejects duplicate faq ids', () => {
    const entry = { id: 'dupe', question: 'q', answer: 'a' }
    const result = validateSiteConfig(withOverrides({ faq: [entry, { ...entry }] }))
    expect(result.errors).toContain('faq id "dupe" is duplicated')
  })

  it('rejects an analytics provider without a script url or site id', () => {
    const result = validateSiteConfig(
      withOverrides({
        analytics: { provider: 'plausible', scriptUrl: null, siteId: null, respectDoNotTrack: true },
      }),
    )
    expect(result.errors).toContain('analytics.scriptUrl is required when a provider is set')
    expect(result.errors).toContain('analytics.siteId is required when a provider is set')
  })

  it('rejects a live launch mode that the gate would block', () => {
    const result = validateSiteConfig(withOverrides({ launchMode: 'live' }))
    expect(result.ok).toBe(false)
    expect(result.errors).toContain('launchMode is live but token.contractAddress is not set')
  })

  it('rejects an empty disclosures list', () => {
    const result = validateSiteConfig(withOverrides({ disclosures: [] }))
    expect(result.errors).toContain('disclosures must not be empty')
  })
})
