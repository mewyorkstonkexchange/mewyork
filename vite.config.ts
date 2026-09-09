/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = import.meta.dirname

// CNAME and .nojekyll live at the repo root so a branch-root Pages deploy keeps working.
// The built artifact needs its own copies, so mirror them into dist after the bundle closes.
function pagesArtifactFiles() {
  return {
    name: 'pages-artifact-files',
    closeBundle() {
      for (const file of ['CNAME', '.nojekyll']) {
        const from = resolve(root, file)
        if (existsSync(from)) copyFileSync(from, resolve(root, 'dist', file))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), pagesArtifactFiles()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
