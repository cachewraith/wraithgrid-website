import { describe, expect, it } from 'vitest'
import { THEME_KEY, readThemeMode, resolveTheme, writeThemeMode } from './theme'

describe('theme', () => {
  it('resolves system mode from the OS preference, dark when none', () => {
    expect(resolveTheme('system', true)).toBe('light')
    expect(resolveTheme('system', false)).toBe('dark')
    expect(resolveTheme('light', false)).toBe('light')
    expect(resolveTheme('dark', true)).toBe('dark')
  })

  it('reads a stored mode and ignores junk', () => {
    expect(readThemeMode({ getItem: () => 'light' })).toBe('light')
    expect(readThemeMode({ getItem: () => 'purple' })).toBe('system')
    expect(readThemeMode({ getItem: () => null })).toBe('system')
    expect(readThemeMode(undefined)).toBe('system')
  })

  it('survives storage that throws', () => {
    const throwing = {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }
    expect(readThemeMode(throwing)).toBe('system')
    expect(() => {
      writeThemeMode(throwing, 'dark')
    }).not.toThrow()
  })

  it('writes under the shared key', () => {
    const saved: Record<string, string> = {}
    writeThemeMode({ setItem: (k, v) => (saved[k] = v) }, 'dark')
    expect(saved[THEME_KEY]).toBe('dark')
  })
})
