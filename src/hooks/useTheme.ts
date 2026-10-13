import { useCallback, useEffect, useSyncExternalStore } from 'react'
import {
  readThemeMode,
  resolveTheme,
  writeThemeMode,
  type ResolvedTheme,
  type ThemeMode,
} from '../lib/theme'

const LIGHT_QUERY = '(prefers-color-scheme: light)'

function localStore(): Storage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

// The stored choice, plus an in-memory copy so a pick still works when storage is blocked.
let picked: ThemeMode | null = null
const listeners = new Set<() => void>()

function subscribeMode(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

function subscribeLight(onChange: () => void) {
  const query = window.matchMedia(LIGHT_QUERY)
  query.addEventListener('change', onChange)
  return () => {
    query.removeEventListener('change', onChange)
  }
}

const noSubscribe = () => () => undefined

/**
 * The server snapshots (system, dark, not hydrated) are what the prerendered HTML shows, so
 * hydration matches it; React re-renders with the stored choice and the OS setting right
 * after. public/theme-init.js has already set data-theme by then, so nothing flashes.
 */
export function useTheme() {
  const mode = useSyncExternalStore(
    subscribeMode,
    () => picked ?? readThemeMode(localStore()),
    (): ThemeMode => 'system',
  )
  const prefersLight = useSyncExternalStore(
    subscribeLight,
    () => window.matchMedia(LIGHT_QUERY).matches,
    () => false,
  )
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  )
  const resolved: ResolvedTheme = resolveTheme(mode, prefersLight)

  useEffect(() => {
    if (hydrated) document.documentElement.dataset.theme = resolved
  }, [hydrated, resolved])

  const setMode = useCallback((next: ThemeMode) => {
    picked = next
    writeThemeMode(localStore(), next)
    for (const onChange of listeners) onChange()
  }, [])

  return { mode, resolved, setMode }
}
