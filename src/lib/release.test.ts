import { describe, expect, it, vi } from 'vitest'
import {
  API_URL,
  CACHE_KEY,
  RELEASES_URL,
  downloadHref,
  fetchLatestRelease,
  isAllowedDownloadUrl,
  matchPlatform,
  parseRelease,
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
  ])('%s → %s', (name, platform) => {
    expect(matchPlatform(name)).toBe(platform)
  })

  it.each([
    'SHA256SUMS.txt',
    'Wraithgrid-1.1.0-x64.exe.blockmap',
    'latest.yml',
    'wraithgrid-1.1.0-arm64.deb',
    'Wraithgrid-1.1.0.AppImage.zsync',
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

describe('fetchLatestRelease', () => {
  it('fetches, validates and caches the release', async () => {
    const storage = new MemoryStorage()
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(payload())))
    const release = await fetchLatestRelease({ fetchImpl, storage })

    expect(release?.version).toBe('1.1.0')
    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(fetchImpl.mock.calls[0]).toEqual([API_URL, expect.anything()])
    expect(storage.getItem(CACHE_KEY)).not.toBeNull()
  })

  it('serves the second call from sessionStorage', async () => {
    const storage = new MemoryStorage()
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(payload())))
    await fetchLatestRelease({ fetchImpl, storage })
    const again = await fetchLatestRelease({ fetchImpl, storage })

    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(again?.assets.appimage?.name).toBe('Wraithgrid-1.1.0-x86_64.AppImage')
    expect(again?.checksums?.name).toBe('SHA256SUMS.txt')
  })

  it('re-validates cached data and refetches when it was tampered with', async () => {
    const storage = new MemoryStorage()
    storage.setItem(
      CACHE_KEY,
      JSON.stringify({ ok: true, data: payload(NAMES, 'https://evil.example/') }),
    )
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(payload())))
    const release = await fetchLatestRelease({ fetchImpl, storage })

    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(release?.assets.deb?.url.startsWith(DL)).toBe(true)
  })

  it('ignores unparseable cache entries', async () => {
    const storage = new MemoryStorage()
    storage.setItem(CACHE_KEY, '{not json')
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(payload())))
    expect((await fetchLatestRelease({ fetchImpl, storage }))?.version).toBe('1.1.0')
  })

  it.each([403, 404, 429, 500])(
    'returns null on HTTP %i and caches the failure',
    async (status) => {
      const storage = new MemoryStorage()
      const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse({ message: 'nope' }, status)))

      expect(await fetchLatestRelease({ fetchImpl, storage })).toBeNull()
      expect(await fetchLatestRelease({ fetchImpl, storage })).toBeNull()
      expect(fetchImpl).toHaveBeenCalledOnce()
      expect(downloadHref(null, 'deb')).toBe(RELEASES_URL)
    },
  )

  it('returns null on a network error', async () => {
    const fetchImpl = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')))
    expect(await fetchLatestRelease({ fetchImpl, storage: new MemoryStorage() })).toBeNull()
  })

  it('returns null on invalid JSON', async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(new Response('<html>', { status: 200 })))
    expect(await fetchLatestRelease({ fetchImpl, storage: new MemoryStorage() })).toBeNull()
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
      const pending = fetchLatestRelease({ fetchImpl, storage: new MemoryStorage() })
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
    const fetchImpl = vi.fn(() => Promise.resolve(jsonResponse(payload())))
    expect((await fetchLatestRelease({ fetchImpl, storage }))?.version).toBe('1.1.0')
  })
})
