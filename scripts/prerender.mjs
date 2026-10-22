// Runs after `vite build` and `vite build --ssr`: renders the page into dist/index.html, so
// crawlers that don't run JavaScript (most AI crawlers) get the full text, then writes the
// JSON-LD, llms.txt, robots.txt and sitemap.xml from the same copy. The site URL is read back
// from the canonical link Vite already filled in.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
const template = html
const body = ssr.render('/')
const ROOT_TAG = '<div id="root"></div>'
const LD_MARK = '<!--app-jsonld-->'
if (!html.includes(ROOT_TAG) || !html.includes(LD_MARK)) {
  throw new Error('dist/index.html is missing the #root div or the JSON-LD marker')
}
html = html
  .replace(ROOT_TAG, `<div id="root">${body}</div>`)
  .replace(LD_MARK, ssr.jsonLdScript(site, version))
writeFileSync(indexPath, html)

/** Text for an HTML attribute or element. */
const esc = (t) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** A meta/link tag's attribute, replaced; throws when the template lost it. */
function setTag(page, re, value) {
  if (!re.test(page)) throw new Error(`dist/index.html has no match for ${re}`)
  return page.replace(re, (_m, before, after) => `${before}${esc(value)}${after}`)
}

// Each docs page: its own HTML file, title, description, canonical and JSON-LD.
for (const doc of ssr.DOCS) {
  const url = ssr.docUrl(site, doc)
  const title = `${doc.title} · Wraithgrid docs`
  let page = template
    .replace(ROOT_TAG, `<div id="root">${ssr.render(new URL(url).pathname)}</div>`)
    .replace(LD_MARK, ssr.docJsonLdScript(site, doc))
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
  page = setTag(page, /(<meta\s+name="description"\s+content=")[^"]*("\s*\/>)/, doc.description)
  page = setTag(page, /(<link rel="canonical" href=")[^"]*(")/, url)
  page = setTag(page, /(<meta property="og:url" content=")[^"]*(")/, url)
  page = setTag(page, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, title)
  page = setTag(page, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, doc.description)
  const dir = join(dist, ...new URL(url).pathname.split('/').filter(Boolean))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), page)
}

const today = new Date().toISOString().slice(0, 10)
writeFileSync(join(dist, 'llms.txt'), ssr.buildLlmsTxt(site, version))
writeFileSync(join(dist, 'robots.txt'), ssr.buildRobotsTxt(site))
writeFileSync(join(dist, 'sitemap.xml'), ssr.buildSitemap(site, today))
rmSync(ssrDir, { recursive: true, force: true })

console.log(
  `Prerendered ${site} (${(body.length / 1024).toFixed(1)} kB of HTML) and ${ssr.DOCS.length} docs pages, release ${version ?? 'unknown'}`,
)
