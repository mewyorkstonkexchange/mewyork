import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { siteConfig } from './site.config'
import { validateSiteConfig } from './config/validate'
import { createAnalytics } from './lib/analytics'
import './index.css'

if (import.meta.env.DEV) {
  const result = validateSiteConfig(siteConfig)
  for (const message of result.errors) console.error(`site.config: ${message}`)
  for (const message of result.warnings) console.warn(`site.config: ${message}`)
}

createAnalytics(siteConfig.analytics).init()

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
