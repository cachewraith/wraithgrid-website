// Runs after `vite build` and `vite build --ssr`: renders the page into dist/index.html, so
// crawlers that don't run JavaScript (most AI crawlers) get the full text, then writes the
// JSON-LD, llms.txt, robots.txt and sitemap.xml from the same copy. The site URL is read back
// from the canonical link Vite already filled in.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')
const RELEASE_API = 'https://api.github.com/repos/cachewraith/wraithgrid/releases/latest'

/** The latest release version, or null: a build never fails because GitHub didn't answer. */
async function latestVersion() {
  try {
    const res = await fetch(RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const tag = (await res.json()).tag_name
    return typeof tag === 'string' ? (/^v?(\d+\.\d+\.\d+)$/.exec(tag)?.[1] ?? null) : null
  } catch {
    return null
  }
}

const ssr = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)
const indexPath = join(dist, 'index.html')
let html = readFileSync(indexPath, 'utf8')
const site = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]
if (!site) throw new Error('dist/index.html has no canonical link')

const version = await latestVersion()
const body = ssr.render()
const ROOT_TAG = '<div id="root"></div>'
const LD_MARK = '<!--app-jsonld-->'
if (!html.includes(ROOT_TAG) || !html.includes(LD_MARK)) {
  throw new Error('dist/index.html is missing the #root div or the JSON-LD marker')
}
html = html
  .replace(ROOT_TAG, `<div id="root">${body}</div>`)
  .replace(LD_MARK, ssr.jsonLdScript(site, version))
writeFileSync(indexPath, html)

const today = new Date().toISOString().slice(0, 10)
writeFileSync(join(dist, 'llms.txt'), ssr.buildLlmsTxt(site, version))
writeFileSync(join(dist, 'robots.txt'), ssr.buildRobotsTxt(site))
writeFileSync(join(dist, 'sitemap.xml'), ssr.buildSitemap(site, today))
rmSync(ssrDir, { recursive: true, force: true })

console.log(
  `Prerendered ${site} (${(body.length / 1024).toFixed(1)} kB of HTML), release ${version ?? 'unknown'}`,
)
