import { useCallback, useEffect, useState } from 'react'
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

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(() => readThemeMode(localStore()))
  const [prefersLight, setPrefersLight] = useState(() => window.matchMedia(LIGHT_QUERY).matches)

  useEffect(() => {
    const query = window.matchMedia(LIGHT_QUERY)
    const onChange = (e: MediaQueryListEvent) => {
      setPrefersLight(e.matches)
    }
    query.addEventListener('change', onChange)
    return () => {
      query.removeEventListener('change', onChange)
    }
  }, [])

  const resolved: ResolvedTheme = resolveTheme(mode, prefersLight)

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    writeThemeMode(localStore(), next)
  }, [])

  return { mode, resolved, setMode }
}
