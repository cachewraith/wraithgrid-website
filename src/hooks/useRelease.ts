import { useEffect, useState } from 'react'
import { fetchReleaseInfo, type ReleaseInfo } from '../lib/release'

// One request per page load, shared by every caller (and by StrictMode's double effect).
let pending: Promise<ReleaseInfo | null> | null = null

/**
 * null while loading or after any failure; buttons link to the releases page and the download
 * counter stays hidden until it resolves.
 */
export function useReleaseInfo(): ReleaseInfo | null {
  const [info, setInfo] = useState<ReleaseInfo | null>(null)
  useEffect(() => {
    let alive = true
    pending ??= fetchReleaseInfo()
    void pending.then((r) => {
      if (alive) setInfo(r)
    })
    return () => {
      alive = false
    }
  }, [])
  return info
}
