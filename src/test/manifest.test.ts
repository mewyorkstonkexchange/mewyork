import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type Entry = Record<string, unknown> & { id: string; approvalStatus: string }

const manifest = JSON.parse(
  readFileSync(resolve(process.cwd(), 'assets/manifest.json'), 'utf8'),
) as { entries: Entry[] }

const REQUIRED = [
  'id',
  'version',
  'path',
  'dimensions',
  'aspectRatio',
  'format',
  'characterVariant',
  'emotion',
  'tags',
  'altText',
  'safeCrops',
  'allowedUse',
  'approvalStatus',
]

describe('assets/manifest.json', () => {
  it('has entries', () => {
    expect(manifest.entries.length).toBeGreaterThan(0)
  })

  it('gives every entry the full field set', () => {
    for (const entry of manifest.entries) {
      for (const field of REQUIRED) {
        expect(Object.hasOwn(entry, field), `${entry.id} is missing ${field}`).toBe(true)
      }
    }
  })

  it('uses unique ids', () => {
    const ids = manifest.entries.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only carries placeholder approval status while no art has been delivered', () => {
    for (const entry of manifest.entries) {
      expect(['placeholder', 'submitted', 'approved', 'rejected']).toContain(entry.approvalStatus)
    }
  })
})
