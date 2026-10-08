/**
 * Release lookup for the download buttons and the download counter.
 *
 * One request to the release list gives both the latest release and the installer download
 * total, so a visitor costs one call against GitHub's unauthenticated rate limit, not two.
 *
 * Every failure path (network error, timeout, 403/404/429, malformed JSON, no matching asset)
 * resolves to `null`, and callers fall back to RELEASES_URL and hide the counter. The page
 * therefore never renders a download button without a working link, or a made-up count.
 */

export const REPO_URL = 'https://github.com/cachewraith/wraithgrid'
export const RELEASES_URL = `${REPO_URL}/releases/latest`
/** Newest first. Releases past the 100 most recent are not counted. */
export const API_URL = 'https://api.github.com/repos/cachewraith/wraithgrid/releases?per_page=100'
export const DOWNLOAD_PREFIX = `${REPO_URL}/releases/download/`
export const CACHE_KEY = 'wraithgrid:release:v2'
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

export interface ReleaseInfo {
  /** The newest non-prerelease, or null when it has no installer the page can link to. */
  latest: Release | null
  /** Installer downloads summed over every listed release, pre-releases included. */
  totalDownloads: number
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

function isCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0
}

/**
 * Downloads of one release's installers. Checksums, blockmaps and the latest*.yml files the
 * in-app updater polls are not installs, so they are left out.
 */
function installerDownloads(assets: unknown[]): number {
  let total = 0
  for (const raw of assets) {
    if (!isRecord(raw) || !isCount(raw.download_count)) continue
    const asset = toAsset(raw)
    if (asset && matchPlatform(asset.name)) total += raw.download_count
  }
  return total
}

/**
 * Validates a GitHub release list. Drafts are skipped. Returns null unless at least one entry is
 * a well-formed release, so a malformed payload hides the counter instead of showing zero.
 */
export function parseReleaseList(data: unknown): ReleaseInfo | null {
  if (!Array.isArray(data)) return null
  // undefined until the newest non-prerelease is reached; GitHub's "latest" is that release.
  let latest: Release | null | undefined
  let totalDownloads = 0
  let valid = 0
  for (const raw of data) {
    if (!isRecord(raw) || raw.draft === true) continue
    const { tag_name: tag, assets } = raw
    if (typeof tag !== 'string' || !VERSION_PATTERN.test(tag) || !Array.isArray(assets)) continue
    valid++
    if (latest === undefined && raw.prerelease !== true) latest = parseRelease(raw)
    totalDownloads += installerDownloads(assets)
  }
  if (valid === 0 || !isCount(totalDownloads)) return null
  return { latest: latest ?? null, totalDownloads }
}

/** Serialises a Release back into the API shape, so cached data goes through parseRelease again. */
function toApiShape(release: Release): unknown {
  const assets = [...Object.values(release.assets), release.checksums]
    .filter((a): a is Asset => a !== null)
    .map((a) => ({ name: a.name, browser_download_url: a.url }))
  return { tag_name: release.tag, published_at: release.publishedAt, assets }
}

type CacheEntry = { ok: true; data: unknown } | { ok: false }

/** Cached entries are user-editable, so both fields are validated like a fresh response. */
function parseCached(data: unknown): ReleaseInfo | null {
  if (!isRecord(data) || !isCount(data.totalDownloads)) return null
  if (data.latest === null) return { latest: null, totalDownloads: data.totalDownloads }
  const latest = parseRelease(data.latest)
  return latest ? { latest, totalDownloads: data.totalDownloads } : null
}

/** undefined = nothing cached; null = a failure was cached; ReleaseInfo = a hit. */
function readCache(storage: Storage | undefined): ReleaseInfo | null | undefined {
  try {
    const raw = storage?.getItem(CACHE_KEY)
    if (raw == null) return undefined
    const entry = JSON.parse(raw) as unknown
    if (!isRecord(entry)) return undefined
    if (entry.ok === false) return null
    return entry.ok === true ? (parseCached(entry.data) ?? undefined) : undefined
  } catch {
    return undefined
  }
}

function writeCache(storage: Storage | undefined, info: ReleaseInfo | null): void {
  const entry: CacheEntry = info
    ? {
        ok: true,
        data: {
          latest: info.latest && toApiShape(info.latest),
          totalDownloads: info.totalDownloads,
        },
      }
    : { ok: false }
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
 * Fetches the release list once per browser session. Failures are cached too, so a
 * rate-limited visitor is not sent back to the API on every navigation.
 */
export async function fetchReleaseInfo(options: FetchOptions = {}): Promise<ReleaseInfo | null> {
  const storage = 'storage' in options ? options.storage : defaultStorage()
  const cached = readCache(storage)
  if (cached !== undefined) return cached

  const fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis)
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, options.timeoutMs ?? TIMEOUT_MS)

  let info: ReleaseInfo | null = null
  try {
    const res = await fetchImpl(API_URL, {
      headers: { Accept: 'application/vnd.github+json' },
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    })
    if (res.ok) info = parseReleaseList(await res.json())
  } catch {
    info = null
  } finally {
    clearTimeout(timer)
  }
  writeCache(storage, info)
  return info
}

const COUNT_FORMAT = new Intl.NumberFormat('en-US')

export function formatDownloads(count: number): string {
  return `${COUNT_FORMAT.format(count)} ${count === 1 ? 'download' : 'downloads'}`
}

/** The link for a platform's download button: the exact file, or the releases page. */
export function downloadHref(release: Release | null, platform: Platform): string {
  return release?.assets[platform]?.url ?? RELEASES_URL
}
