/**
 * Coarse OS detection for picking the default download. Only Windows and Linux builds exist, so
 * anything else collapses into "mac", "mobile" or "other". Linux distros are deliberately not
 * guessed: user agents don't carry that reliably.
 */

export type OS = 'windows' | 'linux' | 'mac' | 'mobile' | 'other'

export interface NavigatorLike {
  userAgent?: string
  userAgentData?: { platform?: string; mobile?: boolean }
}

function fromPlatform(platform: string, mobile: boolean): OS | null {
  if (mobile) return 'mobile'
  const p = platform.toLowerCase()
  if (p === 'android' || p === 'ios') return 'mobile'
  if (p === 'windows') return 'windows'
  if (p === 'macos') return 'mac'
  if (p === 'chrome os' || p === 'chromeos') return 'other'
  if (p === 'linux') return 'linux'
  return null
}

function fromUserAgent(ua: string): OS {
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return 'mobile'
  if (/Windows/i.test(ua)) return 'windows'
  if (/Macintosh|Mac OS X/i.test(ua)) return 'mac'
  if (/CrOS/.test(ua)) return 'other'
  if (/Linux|X11/i.test(ua)) return 'linux'
  return 'other'
}

const globalNavigator = (globalThis as { navigator?: NavigatorLike }).navigator ?? {}

export function detectOS(nav: NavigatorLike = globalNavigator): OS {
  const data = nav.userAgentData
  if (data?.platform) {
    const os = fromPlatform(data.platform, data.mobile === true)
    if (os) return os
  }
  return fromUserAgent(nav.userAgent ?? '')
}
