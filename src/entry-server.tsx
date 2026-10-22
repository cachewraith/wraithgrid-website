// Server entry for scripts/prerender.mjs: the page as static HTML, plus the SEO/GEO builders.
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'

export {
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemap,
  docJsonLdScript,
  docUrl,
  jsonLdScript,
} from './lib/seo'

export { DOCS } from './docs/pages'
export { docsPath } from './lib/docs'

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  )
}
