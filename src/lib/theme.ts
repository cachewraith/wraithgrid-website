/**
 * Theme preference: "system" follows prefers-color-scheme, and dark wins when the OS states no
 * preference. public/theme-init.js applies the same rule before first paint, so keep the two in
 * sync.
 */

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_KEY = 'wraithgrid:theme'
export const THEME_MODES: readonly ThemeMode[] = ['system', 'dark', 'light']

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function readThemeMode(storage: Pick<Storage, 'getItem'> | undefined): ThemeMode {
  try {
    const value = storage?.getItem(THEME_KEY)
    return isThemeMode(value) ? value : 'system'
  } catch {
    return 'system'
  }
}

export function writeThemeMode(storage: Pick<Storage, 'setItem'> | undefined, mode: ThemeMode) {
  try {
    storage?.setItem(THEME_KEY, mode)
  } catch {
    // Blocked storage: the choice lasts for this page view only.
  }
}

export function resolveTheme(mode: ThemeMode, prefersLight: boolean): ResolvedTheme {
  if (mode === 'system') return prefersLight ? 'light' : 'dark'
  return mode
}
