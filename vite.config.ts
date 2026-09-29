import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/**
 * BASE_PATH  path prefix the site is served from. Defaults to "/", which is what Vercel needs.
 * SITE_URL   absolute URL of the site root, used for canonical, Open Graph, robots and sitemap.
 *            On Vercel it defaults to the project's production domain
 *            (VERCEL_PROJECT_PRODUCTION_URL, set automatically at build time). Set it explicitly
 *            once you add a custom domain.
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

/**
 * Fills %SITE_URL% in index.html and emits robots.txt and sitemap.xml for that URL. The dev
 * server drops the CSP tag, because Vite's HMR preamble is an inline script; builds (and
 * `pnpm preview`) keep it.
 */
function siteMeta(): Plugin {
  return {
    name: 'wraithgrid-site-meta',
    transformIndexHtml(html, ctx) {
      const out = html.replaceAll('%SITE_URL%', siteUrl)
      return ctx.server ? out.replace(CSP_META, '') : out
    },
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          `  <url><loc>${siteUrl}</loc><lastmod>${lastmod}</lastmod></url>`,
          '</urlset>',
          '',
        ].join('\n'),
      })
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
