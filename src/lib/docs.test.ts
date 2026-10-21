/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { DOCS } from '../docs/pages'
import { APP_THEMES } from './app-themes'
import { docFromPath, docsPath, internalLinks, parseInline } from './docs'
import { SECTION_IDS } from './sections'

describe('docs routes', () => {
  it('maps pages to clean paths and back', () => {
    expect(docsPath('', '/')).toBe('/docs')
    expect(docsPath('chat', '/')).toBe('/docs/chat')
    expect(docsPath('chat', '/site/')).toBe('/site/docs/chat')
    expect(docFromPath('/docs', '/', DOCS)?.slug).toBe('')
    expect(docFromPath('/docs/', '/', DOCS)?.slug).toBe('')
    expect(docFromPath('/docs/themes', '/', DOCS)?.slug).toBe('themes')
    expect(docFromPath('/site/docs/chat', '/site/', DOCS)?.slug).toBe('chat')
  })

  it('is null for the landing page, sections and unknown pages', () => {
    expect(docFromPath('/', '/', DOCS)).toBeNull()
    expect(docFromPath('/install', '/', DOCS)).toBeNull()
    expect(docFromPath('/docs/nope', '/', DOCS)).toBeNull()
    expect(docFromPath('/docs/../etc', '/', DOCS)).toBeNull()
  })
})

describe('parseInline', () => {
  it('reads code, bold, links and keys; the rest is text', () => {
    expect(parseInline('Run `ls`, **then** see [docs](/docs) or ⟦Ctrl⟧.')).toEqual([
      { t: 'text', v: 'Run ' },
      { t: 'code', v: 'ls' },
      { t: 'text', v: ', ' },
      { t: 'b', v: 'then' },
      { t: 'text', v: ' see ' },
      { t: 'link', v: 'docs', href: '/docs' },
      { t: 'text', v: ' or ' },
      { t: 'kbd', v: 'Ctrl' },
      { t: 'text', v: '.' },
    ])
  })

  it('leaves unclosed markers and unsafe links as text', () => {
    expect(parseInline('a `b')).toEqual([{ t: 'text', v: 'a `b' }])
    expect(parseInline('[x](javascript:alert(1))')).toEqual([
      { t: 'text', v: '[x](javascript:alert(1))' },
    ])
  })
})

describe('docs pages', () => {
  it('have unique slugs and section ids, a title and a description each', () => {
    expect(new Set(DOCS.map((d) => d.slug)).size).toBe(DOCS.length)
    expect(DOCS[0]?.slug).toBe('')
    for (const d of DOCS) {
      expect(d.title, d.slug).toBeTruthy()
      expect(d.description.length, d.slug).toBeGreaterThan(60)
      expect(d.description.length, d.slug).toBeLessThan(220)
      const ids = d.sections.map((s) => s.id)
      expect(new Set(ids).size, d.slug).toBe(ids.length)
    }
  })

  it('link only to pages and sections that exist', () => {
    const ok = new Set([
      ...DOCS.map((d) => docsPath(d.slug, '/')),
      ...SECTION_IDS.map((s) => `/${s}`),
      '/',
    ])
    for (const href of internalLinks(DOCS)) expect(ok, href).toContain(href)
  })
})

describe('theme cards', () => {
  it('keep styles/themes.css equal to the theme data', () => {
    // Vitest hands CSS imports back empty, so the file is read as text.
    const css = readFileSync(new URL('../styles/themes.css', import.meta.url), 'utf8')
    for (const t of APP_THEMES) {
      const block = new RegExp(`\\.tc-${t.id} \\{([^}]*)\\}`).exec(css)?.[1] ?? ''
      for (const [k, v] of Object.entries(t.colors))
        expect(block, `${t.id} ${k}`).toContain(`${v};`)
    }
  })
})
