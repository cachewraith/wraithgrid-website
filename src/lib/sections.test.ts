import { describe, expect, it } from 'vitest'
import { sectionFromUrl, sectionPath } from './sections'

describe('sectionPath', () => {
  it('joins the base and the id', () => {
    expect(sectionPath('install', '/')).toBe('/install')
    expect(sectionPath('faq', '/site/')).toBe('/site/faq')
  })
})

describe('sectionFromUrl', () => {
  it.each([
    ['/install', '', '/', 'install'],
    ['/install/', '', '/', 'install'],
    ['/faq', '', '/', 'faq'],
    ['/site/features', '', '/site/', 'features'],
    ['/', '#shortcuts', '/', 'shortcuts'],
  ] as const)('%s%s (base %s) → %s', (path, hash, base, id) => {
    expect(sectionFromUrl(path, hash, base)).toBe(id)
  })

  it.each([
    ['/', ''],
    ['/unknown', ''],
    ['/install/extra', ''],
    ['/', '#main'],
    ['/features', ''],
  ])('%s%s → null when it is not a section under the base', (path, hash) => {
    const base = path === '/features' ? '/site/' : '/'
    expect(sectionFromUrl(path, hash, base)).toBeNull()
  })
})
