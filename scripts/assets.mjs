// Copies the icon from the app repo (or GitHub) into public/, then writes WebP versions of
// public/screenshots/*.png (made by scripts/screenshots.cjs) at 960 px and full width.
// Needs ImageMagick (`magick`) on PATH.
//
//   pnpm assets                      # uses ../wraithgrid if present, else GitHub
//   WRAITHGRID_DIR=/path pnpm assets # explicit local checkout
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(root, process.env.WRAITHGRID_DIR ?? '../wraithgrid')
const raw = 'https://raw.githubusercontent.com/cachewraith/wraithgrid/main/'
const shots = ['grid-dark', 'grid-light', 'diff', 'palette', 'new-pane', 'accounts', 'settings']
const files = [
  ['build/icon.svg', 'icon.svg'],
  ['build/icon.png', 'icon.png'],
]

async function fetchTo(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

const local = existsSync(join(source, 'build/icon.svg'))
console.log(local ? `Copying from ${source}` : `Downloading from ${raw}`)
for (const [from, to] of files) {
  const dest = join(root, 'public', to)
  mkdirSync(dirname(dest), { recursive: true })
  if (local) copyFileSync(join(source, from), dest)
  else await fetchTo(raw + from, dest)
}

for (const s of shots) {
  const png = join(root, 'public/screenshots', `${s}.png`)
  const out = (w) => join(root, 'public/screenshots', `${s}-${w}.webp`)
  execFileSync('magick', [png, '-quality', '82', '-define', 'webp:method=6', out('full')])
  execFileSync('magick', [png, '-resize', '960x', '-quality', '80', out('960')])
}
console.log('Done. If a screenshot changed size, update SHOT_WIDTH/SHOT_HEIGHT in src/content.ts.')
