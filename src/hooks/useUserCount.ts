import { useEffect, useState } from 'react'
import { fetchUserCount } from '../lib/stats'

// One request per page load, shared by every caller (and by StrictMode's double effect).
let pending: Promise<number | null> | null = null

/** null while loading or after any failure; the user counter stays hidden until it resolves. */
export function useUserCount(): number | null {
  const [users, setUsers] = useState<number | null>(null)
  useEffect(() => {
    let alive = true
    pending ??= fetchUserCount()
    void pending.then((n) => {
      if (alive) setUsers(n)
    })
    return () => {
      alive = false
    }
  }, [])
  return users
}
