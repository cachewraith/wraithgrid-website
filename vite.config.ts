import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/**
 * BASE_PATH  path prefix the site is served from. Defaults to "/", which is what Vercel needs.
 * SITE_URL   absolute URL of the site root, used for canonical, Open Graph, robots and sitemap.
 *            On Vercel it defaults to the project's production domain
 *            (VERCEL_PROJECT_PRODUCTION_URL, set automatically at build time). Set it explicitly
 *            once you add a custom domain.
 * GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION
 *            optional: the token from Google Search Console / Bing Webmaster Tools, added as a
 *            verification meta tag. Not needed if the domain is verified by DNS.
 */
function withSlashes(path: string): string {
  return `/${path.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')
}

const base = withSlashes(process.env.BASE_PATH ?? '/')
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
const siteUrl = (
  process.env.SITE_URL ?? (vercelHost ? `https://${vercelHost}` : `http://localhost:4173${base}`)
).replace(/\/?$/, '/')

if (!/^https?:\/\/[^/]+\//.test(siteUrl)) {
  throw new Error(`SITE_URL must be an absolute URL, got "${siteUrl}"`)
}

const CSP_META = /\s*<meta\s+http-equiv="Content-Security-Policy"[^>]*>/

const VERIFICATION: [name: string, token: string | undefined][] = [
  ['google-site-verification', process.env.GOOGLE_SITE_VERIFICATION],
  ['msvalidate.01', process.env.BING_SITE_VERIFICATION],
]

function verificationTags(): string {
  return VERIFICATION.filter((v): v is [string, string] => /^[\w-]+$/.test(v[1] ?? ''))
    .map(([name, token]) => `<meta name="${name}" content="${token}" />`)
    .join('\n    ')
}

/**
 * Fills %SITE_URL% and the verification tags in index.html. The dev server drops the CSP tag,
 * because Vite's HMR preamble is an inline script; builds (and `pnpm preview`) keep it.
 * robots.txt, sitemap.xml, llms.txt and the JSON-LD are written by scripts/prerender.mjs.
 */
function siteMeta(): Plugin {
  return {
    name: 'wraithgrid-site-meta',
    transformIndexHtml(html, ctx) {
      const out = html
        .replaceAll('%SITE_URL%', siteUrl)
        .replace('<!--site-verification-->', verificationTags())
      return ctx.server ? out.replace(CSP_META, '') : out
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), siteMeta()],
  build: {
    target: 'es2022',
    // Keep fonts as files: CSP has no font-src data: allowance.
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
