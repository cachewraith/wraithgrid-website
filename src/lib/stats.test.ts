import { describe, expect, it, vi } from 'vitest'
import { STATS_CACHE_KEY, STATS_URL, fetchUserCount, formatUsers, parseStats } from './stats'

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

const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }))

describe('parseStats', () => {
  it('takes a whole, non-negative user count', () => {
    expect(parseStats({ users: 0 })).toBe(0)
    expect(parseStats({ users: 1234 })).toBe(1234)
  })
  it.each([null, [], 'x', {}, { users: -1 }, { users: 1.5 }, { users: '12' }])(
    'rejects %j',
    (data) => {
      expect(parseStats(data)).toBeNull()
    },
  )
})

describe('fetchUserCount', () => {
  it('fetches once, without credentials, then serves the session cache', async () => {
    const storage = new MemoryStorage()
    const fetchImpl = vi.fn(() => ok({ users: 42 }))
    expect(await fetchUserCount({ fetchImpl, storage })).toBe(42)
    expect(await fetchUserCount({ fetchImpl, storage })).toBe(42)
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    expect(fetchImpl).toHaveBeenCalledWith(
      STATS_URL,
      expect.objectContaining({ credentials: 'omit' }),
    )
  })

  it('hides the counter on any failure, and caches that too', async () => {
    const storage = new MemoryStorage()
    const fetchImpl = vi.fn(() => Promise.resolve(new Response('', { status: 503 })))
    expect(await fetchUserCount({ fetchImpl, storage })).toBeNull()
    expect(await fetchUserCount({ fetchImpl, storage })).toBeNull()
    expect(fetchImpl).toHaveBeenCalledTimes(1)

    const thrown = vi.fn(() => Promise.reject(new Error('offline')))
    expect(await fetchUserCount({ fetchImpl: thrown, storage: undefined })).toBeNull()
    expect(await fetchUserCount({ fetchImpl: () => ok({ nope: 1 }), storage: undefined })).toBe(
      null,
    )
  })

  it('ignores a tampered cache entry and fetches again', async () => {
    const storage = new MemoryStorage()
    storage.setItem(STATS_CACHE_KEY, '"lots"')
    expect(await fetchUserCount({ fetchImpl: () => ok({ users: 7 }), storage })).toBe(7)
  })

  it('gives up after the timeout', async () => {
    const fetchImpl = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new Error('aborted'))
          })
        }),
    )
    expect(await fetchUserCount({ fetchImpl, storage: undefined, timeoutMs: 5 })).toBeNull()
  })
})

describe('formatUsers', () => {
  it('groups digits and picks the noun', () => {
    expect(formatUsers(1)).toBe('1 user')
    expect(formatUsers(12345)).toBe('12,345 users')
  })
})
