import { describe, expect, it } from 'vitest'
import { fillTemplate, formatCompactUsd } from '../lib/format'
import { siteConfig } from '../site.config'

describe('formatCompactUsd', () => {
  it('renders whole millions without a decimal tail', () => {
    expect(formatCompactUsd(5_000_000)).toBe('$5M')
    expect(formatCompactUsd(1_000_000_000)).toBe('$1B')
  })

  it('keeps a fractional figure readable', () => {
    expect(formatCompactUsd(2_500_000)).toBe('$2.5M')
    expect(formatCompactUsd(750)).toBe('$750')
  })
})

describe('fillTemplate', () => {
  it('substitutes known keys and leaves unknown ones alone', () => {
    expect(fillTemplate('unlocks at {marketCap}.', { marketCap: '$5M' })).toBe('unlocks at $5M.')
    expect(fillTemplate('unlocks at {other}.', { marketCap: '$5M' })).toBe('unlocks at {other}.')
  })
})

describe('site copy', () => {
  const marketCap = formatCompactUsd(siteConfig.thesis.unlockMarketCapUsd)

  it('renders the thesis market cap from config, leaving no placeholder behind', () => {
    const rendered = siteConfig.thesis.body.map((paragraph) =>
      fillTemplate(paragraph, { marketCap }),
    )
    expect(rendered.some((paragraph) => paragraph.includes(marketCap))).toBe(true)
    expect(rendered.join(' ')).not.toContain('{')
  })

  it('quotes the same figure in the FAQ', () => {
    const answer = siteConfig.faq.find((entry) => entry.id === 'what-is-myse')?.answer ?? ''
    expect(answer).toContain(marketCap)
  })
})
