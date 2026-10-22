/**
 * The docs: page model, URLs and inline text. Pages are data (src/docs/pages.ts) rendered by
 * React, so text never becomes HTML. Pure functions, so routing and parsing are unit-tested.
 */

export type Block =
  | { p: string }
  | { list: readonly string[] }
  | { steps: readonly string[] }
  | { code: string; label?: string }
  | { table: { head: readonly string[]; rows: readonly (readonly string[])[] } }
  | { note: string }
  /** The built-in theme cards, drawn in their own colors. */
  | { themes: true }

export interface DocSection {
  id: string
  title: string
  blocks: readonly Block[]
}

export interface DocPage {
  /** '' is /docs itself. */
  slug: string
  /** Short name in the sidebar. */
  nav: string
  title: string
  description: string
  sections: readonly DocSection[]
}

/** "/" + "" → "/docs"; "/" + "chat" → "/docs/chat". base is Vite's BASE_URL, ending in "/". */
export function docsPath(slug: string, base: string): string {
  return slug ? `${base}docs/${slug}` : `${base}docs`
}

/** The docs page a URL path shows, or null when it is not a docs URL (or no such page). */
export function docFromPath<T extends { slug: string }>(
  pathname: string,
  base: string,
  pages: readonly T[],
): T | null {
  if (!pathname.startsWith(base)) return null
  const rest = pathname.slice(base.length).replace(/\/+$/, '')
  const m = /^docs(?:\/([a-z0-9-]+))?$/.exec(rest)
  if (!m) return null
  const slug = m[1] ?? ''
  return pages.find((p) => p.slug === slug) ?? null
}

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'code'; v: string }
  | { t: 'b'; v: string }
  | { t: 'link'; v: string; href: string }
  | { t: 'kbd'; v: string }

/**
 * `code`, **bold**, [label](href) and ⟦key⟧ in docs text. Anything else is plain text, and an
 * unclosed marker stays as typed. Links must be site paths or https.
 */
export function parseInline(text: string): Inline[] {
  const out: Inline[] = []
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]*)\)|⟦([^⟧]+)⟧/g
  let last = 0
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ t: 'text', v: text.slice(last, m.index) })
    if (m[1] !== undefined) out.push({ t: 'code', v: m[1] })
    else if (m[2] !== undefined) out.push({ t: 'b', v: m[2] })
    else if (m[3] !== undefined && m[4] !== undefined) out.push({ t: 'link', v: m[3], href: m[4] })
    else if (m[5] !== undefined) out.push({ t: 'kbd', v: m[5] })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) })
  return out
}

/** Every internal link in the pages, to check none points nowhere. */
export function internalLinks(pages: readonly DocPage[]): string[] {
  const texts = pages.flatMap((p) =>
    p.sections.flatMap((s) =>
      s.blocks.flatMap((b) => {
        if ('p' in b) return [b.p]
        if ('list' in b) return [...b.list]
        if ('steps' in b) return [...b.steps]
        if ('note' in b) return [b.note]
        if ('table' in b) return b.table.rows.flat()
        return []
      }),
    ),
  )
  return texts.flatMap((t) =>
    parseInline(t).flatMap((i) => (i.t === 'link' && i.href.startsWith('/') ? [i.href] : [])),
  )
}
