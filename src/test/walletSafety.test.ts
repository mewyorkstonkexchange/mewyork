import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const srcDir = resolve(process.cwd(), 'src')

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [full] : []
  })
}

// Connecting a wallet must never be able to move funds or produce a signature.
const FORBIDDEN = [
  'useSignMessage',
  'useSignTypedData',
  'useSendTransaction',
  'useWriteContract',
  'writeContract',
  'sendTransaction',
  'signMessage',
  'signTypedData',
  'eth_sendTransaction',
  'personal_sign',
  'eth_signTypedData',
]

describe('wallet side effects', () => {
  it('never references a signing or transaction API', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(srcDir)) {
      const contents = readFileSync(file, 'utf8')
      for (const token of FORBIDDEN) {
        if (contents.includes(token)) offenders.push(`${file}: ${token}`)
      }
    }
    expect(offenders).toEqual([])
  })
})
