// Server entry for scripts/prerender.mjs: the page as static HTML, plus the SEO/GEO builders.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'

export { buildLlmsTxt, buildRobotsTxt, buildSitemap, jsonLdScript } from './lib/seo'

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
