import { useEffect, useState } from 'react'
import { fetchLatestRelease, type Release } from '../lib/release'

// One request per page load, shared by every caller (and by StrictMode's double effect).
let pending: Promise<Release | null> | null = null

/** null while loading or after any failure; buttons link to the releases page until it resolves. */
export function useRelease(): Release | null {
  const [release, setRelease] = useState<Release | null>(null)
  useEffect(() => {
    let alive = true
    pending ??= fetchLatestRelease()
    void pending.then((r) => {
      if (alive) setRelease(r)
    })
    return () => {
      alive = false
    }
  }, [])
  return release
}
