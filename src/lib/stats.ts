/**
 * The user counter: how many people have a Wraithgrid account, from the server's public
 * `GET /v1/public/stats` (no sign-in, any origin, cached there for 5 minutes).
 *
 * Like the release lookup, every failure (network, timeout, non-200, malformed JSON) resolves to
 * null and the counter stays hidden, so the page never shows a made-up number. One request per
 * browser session; failures are cached too.
 */

export const API_ORIGIN = 'https://api.wraithgrid.cachewraith.com'
export const STATS_URL = `${API_ORIGIN}/v1/public/stats`
export const STATS_CACHE_KEY = 'wraithgrid:stats:v1'
export const STATS_TIMEOUT_MS = 5000

function isCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0
}

/** `{ users: n }` → n; anything else → null. */
export function parseStats(data: unknown): number | null {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return null
  const { users } = data as Record<string, unknown>
  return isCount(users) ? users : null
}

/** undefined = nothing cached; null = a failure was cached; number = a hit. */
function readCache(storage: Storage | undefined): number | null | undefined {
  try {
    const raw = storage?.getItem(STATS_CACHE_KEY)
    if (raw == null) return undefined
    const entry = JSON.parse(raw) as unknown
    if (entry === null) return null
    // Cached values are user-editable: validate like a fresh response.
    return isCount(entry) ? entry : undefined
  } catch {
    return undefined
  }
}

function writeCache(storage: Storage | undefined, users: number | null): void {
  try {
    storage?.setItem(STATS_CACHE_KEY, JSON.stringify(users))
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

export interface StatsFetchOptions {
  fetchImpl?: typeof fetch
  storage?: Storage | undefined
  timeoutMs?: number
}

export async function fetchUserCount(options: StatsFetchOptions = {}): Promise<number | null> {
  const storage = 'storage' in options ? options.storage : defaultStorage()
  const cached = readCache(storage)
  if (cached !== undefined) return cached

  const fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis)
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, options.timeoutMs ?? STATS_TIMEOUT_MS)

  let users: number | null = null
  try {
    const res = await fetchImpl(STATS_URL, {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    })
    if (res.ok) users = parseStats(await res.json())
  } catch {
    users = null
  } finally {
    clearTimeout(timer)
  }
  writeCache(storage, users)
  return users
}

const COUNT_FORMAT = new Intl.NumberFormat('en-US')

export function formatUsers(count: number): string {
  return `${COUNT_FORMAT.format(count)} ${count === 1 ? 'user' : 'users'}`
}
