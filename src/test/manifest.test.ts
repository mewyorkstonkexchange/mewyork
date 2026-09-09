import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type Fallback = { path: string; format: string } | null

type Entry = Record<string, unknown> & {
  id: string
  path: string
  fallback: Fallback
  approvalStatus: string
}

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

const MAX_PAGE_IMAGE_BYTES = 400 * 1024

function paths(entry: Entry): string[] {
  return entry.fallback ? [entry.path, entry.fallback.path] : [entry.path]
}

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

  it('carries a known approval status', () => {
    for (const entry of manifest.entries) {
      expect(['placeholder', 'submitted', 'approved', 'approved-by-founder', 'rejected']).toContain(
        entry.approvalStatus,
      )
    }
  })

  it('points every path at a file that exists', () => {
    for (const entry of manifest.entries) {
      for (const path of paths(entry)) {
        expect(existsSync(resolve(process.cwd(), path)), `${entry.id}: ${path}`).toBe(true)
      }
    }
  })

  it('keeps every image the page loads under 400 KB', () => {
    for (const entry of manifest.entries) {
      for (const path of paths(entry)) {
        if (!path.startsWith('public/')) continue
        const size = statSync(resolve(process.cwd(), path)).size
        expect(size, `${entry.id}: ${path} is ${Math.round(size / 1024)} KB`).toBeLessThan(
          MAX_PAGE_IMAGE_BYTES,
        )
      }
    }
  })
})
