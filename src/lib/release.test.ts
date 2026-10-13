import { describe, expect, it, vi } from 'vitest'
import {
  API_URL,
  CACHE_KEY,
  RELEASES_URL,
  downloadHref,
  fetchReleaseInfo,
  formatDownloads,
  isAllowedDownloadUrl,
  matchPlatform,
  parseRelease,
  parseReleaseList,
} from './release'

const DL = 'https://github.com/cachewraith/wraithgrid/releases/download/v1.1.0/'
const NAMES = [
  'SHA256SUMS.txt',
  'wraithgrid-1.1.0-amd64.deb',
  'wraithgrid-1.1.0-x64.pacman',
  'Wraithgrid-1.1.0-x86_64.AppImage',
  'wraithgrid-1.1.0-x86_64.rpm',
  'Wraithgrid-Setup-1.1.0-x64.exe',
]

function payload(names = NAMES, prefix = DL) {
  return {
    tag_name: 'v1.1.0',
    published_at: '2026-09-29T16:08:05Z',
    assets: names.map((name) => ({ name, browser_download_url: prefix + name })),
  }
}

class MemoryStorage implements Storage {
  private map = new Map<string, string>()
  get length() {
    return this.map.size
  }
  clear() {
    this.map.clear()
  }
  getItem(key: string) {
    return this.map.get(key) ?? null
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null
  }
  removeItem(key: string) {
    this.map.delete(key)
  }
  setItem(key: string, value: string) {
    this.map.set(key, value)
  }
}

/** A release-list entry: each asset gets the given download count. */
function entry(tag: string, counts: Record<string, unknown>, extra: Record<string, unknown> = {}) {
  const prefix = `https://github.com/cachewraith/wraithgrid/releases/download/${tag}/`
  return {
    tag_name: tag,
    published_at: '2026-09-30T04:00:38Z',
    draft: false,
    prerelease: false,
    assets: Object.entries(counts).map(([name, download_count]) => ({
      name,
      browser_download_url: prefix + name,
      download_count,
    })),
    ...extra,
  }
}

function list() {
  return [{ ...payload(), draft: false, prerelease: false }]
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

describe('matchPlatform', () => {
  it.each([
    ['Wraithgrid-Setup-1.1.0-x64.exe', 'windows'],
    ['wraithgrid-1.1.0-amd64.deb', 'deb'],
    ['wraithgrid-1.1.0-x86_64.rpm', 'rpm'],
    ['wraithgrid-1.1.0-x64.pacman', 'pacman'],
    ['Wraithgrid-1.1.0-x86_64.AppImage', 'appimage'],
    ['Wraithgrid-1.6.0-mac-arm64.dmg', 'macArm'],
    ['Wraithgrid-1.6.0-mac-x64.dmg', 'macIntel'],
  ])('%s → %s', (name, platform) => {
    expect(matchPlatform(name)).toBe(platform)
  })

  it.each([
    'SHA256SUMS.txt',
    'Wraithgrid-1.1.0-x64.exe.blockmap',
    'latest.yml',
    'wraithgrid-1.1.0-arm64.deb',
    'Wraithgrid-1.1.0.AppImage.zsync',
    'Wraithgrid-1.6.0-mac-arm64.zip',
    'Wraithgrid-1.6.0-mac-arm64.dmg.blockmap',
    'latest-mac.yml',
  ])('ignores %s', (name) => {
    expect(matchPlatform(name)).toBeNull()
  })
})

describe('isAllowedDownloadUrl', () => {
  it('accepts files on this repo’s releases', () => {
    expect(isAllowedDownloadUrl(`${DL}wraithgrid-1.1.0-amd64.deb`)).toBe(true)
  })

  it.each([
    'http://github.com/cachewraith/wraithgrid/releases/download/v1/x.deb',
    'https://github.com/someone-else/wraithgrid/releases/download/v1/x.deb',
    'https://github.com.evil.example/cachewraith/wraithgrid/releases/download/v1/x.deb',
    'https://evil.example/https://github.com/cachewraith/wraithgrid/releases/download/x.deb',
    'https://github.com/cachewraith/wraithgrid/releases/download/../../../../evil/x.deb',
    'https://github.com/cachewraith/wraithgrid/releases/download/%2e%2e/%2e%2e/x.deb',
    'javascript:alert(1)',
    '',
  ])('rejects %s', (url) => {
    expect(isAllowedDownloadUrl(url)).toBe(false)
  })
})

describe('parseRelease', () => {
  it('maps every platform and the checksum file', () => {
    const release = parseRelease(payload())
    expect(release).not.toBeNull()
    expect(release?.version).toBe('1.1.0')
    expect(release?.publishedAt).toBe('2026-09-29T16:08:05Z')
    expect(release?.assets.windows?.name).toBe('Wraithgrid-Setup-1.1.0-x64.exe')
    expect(release?.assets.deb?.url).toBe(`${DL}wraithgrid-1.1.0-amd64.deb`)
    expect(release?.assets.rpm?.name).toBe('wraithgrid-1.1.0-x86_64.rpm')
    expect(release?.assets.pacman?.name).toBe('wraithgrid-1.1.0-x64.pacman')
    expect(release?.assets.appimage?.name).toBe('Wraithgrid-1.1.0-x86_64.AppImage')
    expect(release?.checksums?.name).toBe('SHA256SUMS.txt')
  })

  it('drops assets whose URL is outside the allowlist', () => {
    const data = payload()
    data.assets[1] = {
      name: 'wraithgrid-1.1.0-amd64.deb',
      browser_download_url: 'https://evil.example/wraithgrid-1.1.0-amd64.deb',
    }
    const release = parseRelease(data)
    expect(release?.assets.deb).toBeUndefined()
    expect(release?.assets.rpm).toBeDefined()
  })

  it('returns null when no asset matches a platform', () => {
    expect(parseRelease(payload(['SHA256SUMS.txt', 'notes.md']))).toBeNull()
  })

  it('returns null when every asset is on a disallowed host', () => {
    expect(parseRelease(payload(NAMES, 'https://evil.example/'))).toBeNull()
  })

  it.each([
    null,
    'v1.1.0',
    [],
    {},
    { tag_name: 'v1.1.0' },
    { tag_name: 42, assets: [] },
    { ...payload(), tag_name: '<img src=x>' },
    { ...payload(), assets: [null, 1, 'x', { name: 1 }] },
  ])('rejects malformed payload %#', (data) => {
    expect(parseRelease(data)).toBeNull()
  })

  it('accepts a tag without the leading v and with a pre-release suffix', () => {
    expect(parseRelease({ ...payload(), tag_name: '2.0.0-beta.1' })?.version).toBe('2.0.0-beta.1')
  })
})

describe('parseReleaseList', () => {
  const v13 = {
    'latest.yml': 50,
    'latest-linux.yml': 40,
    'SHA256SUMS.txt': 7,
    'Wraithgrid-Setup-1.3.0-x64.exe.blockmap': 9,
    'Wraithgrid-Setup-1.3.0-x64.exe': 10,
    'wraithgrid-1.3.0-amd64.deb': 5,
    'wraithgrid-1.3.0-x64.pacman': 3,
  }

  it('picks the newest release and sums installer downloads across all of them', () => {
    const info = parseReleaseList([
      entry('v1.3.0', v13),
      entry('v1.2.0', { 'wraithgrid-1.2.0-x86_64.rpm': 4, 'SHA256SUMS.txt': 2 }),
    ])
    expect(info?.latest?.version).toBe('1.3.0')
    expect(info?.totalDownloads).toBe(22)
  })

  it('skips a newer pre-release for latest but still counts its downloads', () => {
    const info = parseReleaseList([
      entry('v1.4.0-beta.1', { 'wraithgrid-1.4.0-beta.1-amd64.deb': 2 }, { prerelease: true }),
      entry('v1.3.0', v13),
    ])
    expect(info?.latest?.version).toBe('1.3.0')
    expect(info?.totalDownloads).toBe(20)
  })

  it('ignores drafts entirely', () => {
    const info = parseReleaseList([
      entry('v9.0.0', { 'wraithgrid-9.0.0-amd64.deb': 100 }, { draft: true }),
      entry('v1.3.0', v13),
    ])
    expect(info?.latest?.version).toBe('1.3.0')
    expect(info?.totalDownloads).toBe(18)
  })

  it('does not fall back to an older release when the newest has no installer', () => {
    const info = parseReleaseList([
      entry('v1.3.0', { 'SHA256SUMS.txt': 1 }),
      entry('v1.2.0', { 'wraithgrid-1.2.0-amd64.deb': 6 }),
    ])
    expect(info?.latest).toBeNull()
    expect(info?.totalDownloads).toBe(6)
  })

  it.each([-1, 1.5, '12', null, Number.MAX_SAFE_INTEGER + 1, Infinity])(
    'skips an invalid download_count %s',
    (count) => {
      const info = parseReleaseList([
        entry('v1.3.0', { 'wraithgrid-1.3.0-amd64.deb': count, 'wraithgrid-1.3.0-x64.pacman': 3 }),
      ])
      expect(info?.totalDownloads).toBe(3)
    },
  )

  it('does not count assets hosted outside the allowlist', () => {
    const data = entry('v1.3.0', { 'wraithgrid-1.3.0-amd64.deb': 5 })
    data.assets.push({
      name: 'wraithgrid-1.3.0-x86_64.rpm',
      browser_download_url: 'https://evil.example/wraithgrid-1.3.0-x86_64.rpm',
      download_count: 1_000_000,
    })
    expect(parseReleaseList([data])?.totalDownloads).toBe(5)
  })

  it('returns null when a sum would lose precision', () => {
    const huge = Number.MAX_SAFE_INTEGER
    const info = parseReleaseList([
      entry('v1.3.0', { 'wraithgrid-1.3.0-amd64.deb': huge, 'wraithgrid-1.3.0-x64.pacman': huge }),
    ])
    expect(info).toBeNull()
  })

  it.each([null, {}, 'x', [], [null, 1], [{ tag_name: '<b>', assets: [] }], [{ tag_name: 'v1' }]])(
    'returns null for malformed list %#',
    (data) => {
      expect(parseReleaseList(data)).toBeNull()
    },
  )
})

describe('formatDownloads', () => {
  it.each([
    [0, '0 downloads'],
    [1, '1 download'],
    [3, '3 downloads'],
    [12345, '12,345 downloads'],
  ])('%i → %s', (count, text) => {
    expect(formatDownloads(count)).toBe(text)
  })
})

describe('downloadHref', () => {
  it('links the exact file when present', () => {
    expect(downloadHref(parseRelease(payload()), 'rpm')).toBe(`${DL}wraithgrid-1.1.0-x86_64.rpm`)
  })

  it('falls back to the releases page without a release or asset', () => {
    expect(downloadHref(null, 'windows')).toBe(RELEASES_URL)
    const onlyDeb = parseRelease(payload(['wraithgrid-1.1.0-amd64.deb']))
    expect(downloadHref(onlyDeb, 'windows')).toBe(RELEASES_URL)
  })
})

describe('fetchReleaseInfo', () => {
  it('fetches, validates and caches the release', async () => {
    const storage = new MemoryStorage()
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(list())))
    const info = await fetchReleaseInfo({ fetchImpl, storage })

    expect(info?.latest?.version).toBe('1.1.0')
    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(fetchImpl.mock.calls[0]).toEqual([API_URL, expect.anything()])
    expect(storage.getItem(CACHE_KEY)).not.toBeNull()
  })

  it('serves the second call from sessionStorage', async () => {
    const storage = new MemoryStorage()
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(list())))
    await fetchReleaseInfo({ fetchImpl, storage })
    const again = await fetchReleaseInfo({ fetchImpl, storage })

    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(again?.latest?.assets.appimage?.name).toBe('Wraithgrid-1.1.0-x86_64.AppImage')
    expect(again?.latest?.checksums?.name).toBe('SHA256SUMS.txt')
  })

  it('re-validates cached data and refetches when it was tampered with', async () => {
    const storage = new MemoryStorage()
    storage.setItem(
      CACHE_KEY,
      JSON.stringify({
        ok: true,
        data: { latest: payload(NAMES, 'https://evil.example/'), totalDownloads: 5 },
      }),
    )
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(list())))
    const info = await fetchReleaseInfo({ fetchImpl, storage })

    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(info?.latest?.assets.deb?.url.startsWith(DL)).toBe(true)
  })

  it('caches the download total and refetches when it was tampered with', async () => {
    const storage = new MemoryStorage()
    const fetchImpl = vi.fn(() =>
      Promise.resolve(jsonResponse([entry('v1.3.0', { 'wraithgrid-1.3.0-amd64.deb': 42 })])),
    )
    expect((await fetchReleaseInfo({ fetchImpl, storage }))?.totalDownloads).toBe(42)
    expect((await fetchReleaseInfo({ fetchImpl, storage }))?.totalDownloads).toBe(42)
    expect(fetchImpl).toHaveBeenCalledOnce()

    const cached = JSON.parse(storage.getItem(CACHE_KEY) ?? '') as { data: object }
    storage.setItem(
      CACHE_KEY,
      JSON.stringify({ ok: true, data: { ...cached.data, totalDownloads: '9999<b>' } }),
    )
    expect((await fetchReleaseInfo({ fetchImpl, storage }))?.totalDownloads).toBe(42)
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('ignores unparseable cache entries', async () => {
    const storage = new MemoryStorage()
    storage.setItem(CACHE_KEY, '{not json')
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(list())))
    expect((await fetchReleaseInfo({ fetchImpl, storage }))?.latest?.version).toBe('1.1.0')
  })

  it.each([403, 404, 429, 500])(
    'returns null on HTTP %i and caches the failure',
    async (status) => {
      const storage = new MemoryStorage()
      const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse({ message: 'nope' }, status)))

      expect(await fetchReleaseInfo({ fetchImpl, storage })).toBeNull()
      expect(await fetchReleaseInfo({ fetchImpl, storage })).toBeNull()
      expect(fetchImpl).toHaveBeenCalledOnce()
      expect(downloadHref(null, 'deb')).toBe(RELEASES_URL)
    },
  )

  it('returns null on a network error', async () => {
    const fetchImpl = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')))
    expect(await fetchReleaseInfo({ fetchImpl, storage: new MemoryStorage() })).toBeNull()
  })

  it('returns null for the old single-release shape', async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(payload())))
    expect(await fetchReleaseInfo({ fetchImpl, storage: new MemoryStorage() })).toBeNull()
  })

  it('returns null on invalid JSON', async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(new Response('<html>', { status: 200 })))
    expect(await fetchReleaseInfo({ fetchImpl, storage: new MemoryStorage() })).toBeNull()
  })

  it('aborts after the timeout', async () => {
    vi.useFakeTimers()
    try {
      const fetchImpl = vi.fn(
        (_url: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'))
            })
          }),
      )
      const pending = fetchReleaseInfo({ fetchImpl, storage: new MemoryStorage() })
      await vi.advanceTimersByTimeAsync(5000)
      expect(await pending).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('still works when storage throws', async () => {
    const storage = new MemoryStorage()
    storage.getItem = () => {
      throw new Error('SecurityError')
    }
    storage.setItem = () => {
      throw new Error('QuotaExceededError')
    }
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(list())))
    expect((await fetchReleaseInfo({ fetchImpl, storage }))?.latest?.version).toBe('1.1.0')
  })
})
