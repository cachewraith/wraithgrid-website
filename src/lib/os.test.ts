import { describe, expect, it } from 'vitest'
import { detectOS } from './os'

const UA = {
  windows:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  linux: 'Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0',
  ubuntu: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0',
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15',
  android:
    'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
  androidTablet:
    'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1',
  chromeos:
    'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
}

describe('detectOS from the user agent', () => {
  it.each([
    ['windows', 'windows'],
    ['linux', 'linux'],
    ['ubuntu', 'linux'],
    ['mac', 'mac'],
    ['android', 'mobile'],
    ['androidTablet', 'mobile'],
    ['iphone', 'mobile'],
    ['chromeos', 'other'],
  ] as const)('%s → %s', (key, os) => {
    expect(detectOS({ userAgent: UA[key] })).toBe(os)
  })

  it('returns other for an empty or missing navigator', () => {
    expect(detectOS({})).toBe('other')
    expect(detectOS({ userAgent: '' })).toBe('other')
  })
})

describe('detectOS prefers userAgentData', () => {
  it.each([
    ['Windows', false, 'windows'],
    ['Linux', false, 'linux'],
    ['macOS', false, 'mac'],
    ['Android', true, 'mobile'],
    ['Android', false, 'mobile'],
    ['Chrome OS', false, 'other'],
  ] as const)('platform %s (mobile=%s) → %s', (platform, mobile, os) => {
    // The UA string disagrees on purpose, to prove userAgentData wins.
    expect(detectOS({ userAgent: UA.mac, userAgentData: { platform, mobile } })).toBe(os)
  })

  it('falls back to the user agent when the platform is empty or unknown', () => {
    expect(detectOS({ userAgent: UA.windows, userAgentData: { platform: '' } })).toBe('windows')
    expect(detectOS({ userAgent: UA.linux, userAgentData: { platform: 'Fuchsia' } })).toBe('linux')
  })
})
