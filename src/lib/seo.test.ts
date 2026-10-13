import { describe, expect, it } from 'vitest'
import { FAQS } from '../content'
import { buildJsonLd, buildLlmsTxt, buildRobotsTxt, buildSitemap, jsonLdScript } from './seo'

const SITE = 'https://wraithgrid.example.org/'

type Node = Record<string, unknown> & { '@type': string }
const graph = (version: string | null) =>
  (buildJsonLd(SITE, version) as { '@graph': Node[] })['@graph']
const byType = (nodes: Node[], type: string) => nodes.find((n) => n['@type'] === type)

describe('buildJsonLd', () => {
  it('describes the app with the release version', () => {
    const app = byType(graph('1.6.0'), 'SoftwareApplication')
    expect(app?.softwareVersion).toBe('1.6.0')
    expect(app?.releaseNotes).toBe('https://github.com/cachewraith/wraithgrid/releases/tag/v1.6.0')
    expect(app?.url).toBe(SITE)
  })

  it('leaves the version out when it is unknown', () => {
    const app = byType(graph(null), 'SoftwareApplication')
    expect(app).not.toHaveProperty('softwareVersion')
    expect(app).not.toHaveProperty('releaseNotes')
  })

  it('has one FAQ entry per visible question, with the same text', () => {
    const faq = byType(graph(null), 'FAQPage')
    const entities = faq?.mainEntity as { name: string; acceptedAnswer: { text: string } }[]
    expect(entities.map((e) => e.name)).toEqual(FAQS.map((f) => f.q))
    expect(entities.map((e) => e.acceptedAnswer.text)).toEqual(FAQS.map((f) => f.a))
  })

  it('points every @id reference at a node in the graph', () => {
    const nodes = graph('1.6.0')
    const ids = new Set(nodes.map((n) => n['@id']))
    const refs = JSON.stringify(nodes).match(/\{"@id":"[^"]+"\}/g) ?? []
    for (const ref of refs) expect(ids).toContain((JSON.parse(ref) as { '@id': string })['@id'])
  })
})

describe('jsonLdScript', () => {
  it('escapes < so content cannot close the script tag', () => {
    const script = jsonLdScript(SITE, null)
    expect(script.startsWith('<script type="application/ld+json">')).toBe(true)
    expect(script.slice(35, -9)).not.toContain('<')
    expect(() => {
      JSON.parse(script.slice(35, -9).replace(/\\u003c/g, '<'))
    }).not.toThrow()
  })
})

describe('buildLlmsTxt', () => {
  it('starts with the name and a summary quote, and links back to the site', () => {
    const txt = buildLlmsTxt(SITE, '1.6.0')
    expect(txt.startsWith('# Wraithgrid\n\n> ')).toBe(true)
    expect(txt).toContain('v1.6.0')
    expect(txt).toContain(`[Website](${SITE})`)
    for (const f of FAQS) expect(txt).toContain(`### ${f.q}`)
  })
})

describe('buildRobotsTxt', () => {
  it('allows everyone, names AI crawlers and links the sitemap', () => {
    const txt = buildRobotsTxt(SITE)
    expect(txt).toMatch(/^User-agent: \*\nAllow: \//)
    expect(txt).toContain('User-agent: GPTBot')
    expect(txt).toContain('User-agent: ClaudeBot')
    expect(txt).not.toMatch(/Disallow/)
    expect(txt).toContain(`Sitemap: ${SITE}sitemap.xml`)
  })
})

describe('buildSitemap', () => {
  it('lists the page once with its date and screenshots', () => {
    const xml = buildSitemap(SITE, '2026-10-08')
    expect(xml.match(/<loc>/g)).toHaveLength(1)
    expect(xml).toContain(`<loc>${SITE}</loc>`)
    expect(xml).toContain('<lastmod>2026-10-08</lastmod>')
    expect(xml).toContain(`<image:loc>${SITE}screenshots/grid-dark.png</image:loc>`)
  })
})
