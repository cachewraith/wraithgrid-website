/**
 * Latest-release lookup for the download buttons.
 *
 * Every failure path (network error, timeout, 403/404/429, malformed JSON, no matching asset)
 * resolves to `null`, and callers fall back to RELEASES_URL. The page therefore never renders a
 * download button without a working link.
 */

export const REPO_URL = 'https://github.com/cachewraith/wraithgrid'
export const RELEASES_URL = `${REPO_URL}/releases/latest`
export const API_URL = 'https://api.github.com/repos/cachewraith/wraithgrid/releases/latest'
export const DOWNLOAD_PREFIX = `${REPO_URL}/releases/download/`
export const CACHE_KEY = 'wraithgrid:release:v1'
export const TIMEOUT_MS = 5000

export type Platform = 'windows' | 'deb' | 'rpm' | 'pacman' | 'appimage'

export const PLATFORMS: readonly Platform[] = ['windows', 'deb', 'rpm', 'pacman', 'appimage']

const ASSET_PATTERNS: Record<Platform, RegExp> = {
  windows: /-Setup-.*\.exe$/,
  deb: /amd64\.deb$/,
  rpm: /x86_64\.rpm$/,
  pacman: /\.pacman$/,
  appimage: /\.AppImage$/,
}
const CHECKSUMS_PATTERN = /^SHA256SUMS\.txt$/
const VERSION_PATTERN = /^v?(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)$/

export interface Asset {
  name: string
  url: string
}

export interface Release {
  /** Version without the leading "v", e.g. "1.1.0". */
  version: string
  tag: string
  publishedAt: string | null
  assets: Partial<Record<Platform, Asset>>
  checksums: Asset | null
}

/** Only files attached to this repo's releases are ever linked. */
export function isAllowedDownloadUrl(url: string): boolean {
  if (!url.startsWith(DOWNLOAD_PREFIX)) return false
  try {
    // Re-check after normalisation so "../" or "%2e%2e" segments can't escape the prefix.
    return new URL(url).href.startsWith(DOWNLOAD_PREFIX)
  } catch {
    return false
  }
}

export function matchPlatform(name: string): Platform | null {
  return PLATFORMS.find((p) => ASSET_PATTERNS[p].test(name)) ?? null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toAsset(value: unknown): Asset | null {
  if (!isRecord(value)) return null
  const { name, browser_download_url: url } = value
  if (typeof name !== 'string' || typeof url !== 'string') return null
  if (!isAllowedDownloadUrl(url)) return null
  return { name, url }
}

/**
 * Validates a GitHub "latest release" payload. Returns null unless it has a well-formed tag and
 * at least one installer asset with an allowed URL. Unknown or disallowed assets are dropped.
 */
export function parseRelease(data: unknown): Release | null {
  if (!isRecord(data)) return null
  const { tag_name: tag, published_at: publishedAt, assets } = data
  if (typeof tag !== 'string' || !Array.isArray(assets)) return null
  const version = VERSION_PATTERN.exec(tag)?.[1]
  if (version === undefined) return null

  const release: Release = {
    version,
    tag,
    publishedAt: typeof publishedAt === 'string' ? publishedAt : null,
    assets: {},
    checksums: null,
  }
  for (const raw of assets) {
    const asset = toAsset(raw)
    if (!asset) continue
    if (CHECKSUMS_PATTERN.test(asset.name)) {
      release.checksums ??= asset
      continue
    }
    const platform = matchPlatform(asset.name)
    if (platform) release.assets[platform] ??= asset
  }
  return Object.keys(release.assets).length > 0 ? release : null
}

/** Serialises a Release back into the API shape, so cached data goes through parseRelease again. */
function toApiShape(release: Release): unknown {
  const assets = [...Object.values(release.assets), release.checksums]
    .filter((a): a is Asset => a !== null)
    .map((a) => ({ name: a.name, browser_download_url: a.url }))
  return { tag_name: release.tag, published_at: release.publishedAt, assets }
}

type CacheEntry = { ok: true; data: unknown } | { ok: false }

/** undefined = nothing cached; null = a failure was cached; Release = a hit. */
function readCache(storage: Storage | undefined): Release | null | undefined {
  try {
    const raw = storage?.getItem(CACHE_KEY)
    if (raw == null) return undefined
    const entry = JSON.parse(raw) as unknown
    if (!isRecord(entry)) return undefined
    if (entry.ok === false) return null
    // sessionStorage is user-editable, so a cached release is validated like a fresh one.
    return entry.ok === true ? (parseRelease(entry.data) ?? undefined) : undefined
  } catch {
    return undefined
  }
}

function writeCache(storage: Storage | undefined, release: Release | null): void {
  const entry: CacheEntry = release ? { ok: true, data: toApiShape(release) } : { ok: false }
  try {
    storage?.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Storage full or blocked: the next page load simply fetches again.
  }
}

function defaultStorage(): Storage | undefined {
  try {
    return globalThis.sessionStorage
  } catch {
    return undefined
  }
}

export interface FetchOptions {
  fetchImpl?: typeof fetch
  storage?: Storage | undefined
  timeoutMs?: number
}

/**
 * Fetches the latest release once per browser session. Failures are cached too, so a
 * rate-limited visitor is not sent back to the API on every navigation.
 */
export async function fetchLatestRelease(options: FetchOptions = {}): Promise<Release | null> {
  const storage = 'storage' in options ? options.storage : defaultStorage()
  const cached = readCache(storage)
  if (cached !== undefined) return cached

  const fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis)
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, options.timeoutMs ?? TIMEOUT_MS)

  let release: Release | null = null
  try {
    const res = await fetchImpl(API_URL, {
      headers: { Accept: 'application/vnd.github+json' },
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    })
    if (res.ok) release = parseRelease(await res.json())
  } catch {
    release = null
  } finally {
    clearTimeout(timer)
  }
  writeCache(storage, release)
  return release
}

/** The link for a platform's download button: the exact file, or the releases page. */
export function downloadHref(release: Release | null, platform: Platform): string {
  return release?.assets[platform]?.url ?? RELEASES_URL
}
