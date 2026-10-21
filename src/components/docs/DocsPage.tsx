import { DOCS } from '../../docs/pages'
import { docsPath, type Block, type DocPage } from '../../lib/docs'
import { CodeBlock } from '../CodeBlock'
import { ThemeCards } from '../ThemeCards'
import { Inline } from './Inline'

const BASE = import.meta.env.BASE_URL

function BlockView({ b }: { b: Block }) {
  if ('p' in b)
    return (
      <p>
        <Inline text={b.p} />
      </p>
    )
  if ('list' in b)
    return (
      <ul>
        {b.list.map((t) => (
          <li key={t}>
            <Inline text={t} />
          </li>
        ))}
      </ul>
    )
  if ('steps' in b)
    return (
      <ol className="docs-steps">
        {b.steps.map((t) => (
          <li key={t}>
            <Inline text={t} />
          </li>
        ))}
      </ol>
    )
  if ('code' in b)
    return <CodeBlock code={b.code} label={b.label ?? 'Example'} prompt={!b.code.includes('\n')} />
  if ('note' in b)
    return (
      <p className="docs-note">
        <Inline text={b.note} />
      </p>
    )
  if ('table' in b)
    return (
      <div className="docs-table">
        <table>
          <thead>
            <tr>
              {b.table.head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.table.rows.map((r) => (
              <tr key={r.join('|')}>
                {r.map((c, i) => (
                  <td key={i}>
                    <Inline text={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  return <ThemeCards />
}

/** One docs page: the page list, the article, and "On this page". */
export function DocsPage({ page }: { page: DocPage }) {
  const i = DOCS.indexOf(page)
  const prev = i > 0 ? DOCS[i - 1] : null
  const next = DOCS[i + 1] ?? null
  return (
    <div className="container docs">
      <nav className="docs-nav" aria-label="Docs">
        <p className="docs-nav-h">Docs</p>
        <ul>
          {DOCS.map((p) => (
            <li key={p.slug}>
              <a href={docsPath(p.slug, BASE)} aria-current={p === page ? 'page' : undefined}>
                {p.nav}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <article className="docs-body">
        <h1>{page.title}</h1>
        <p className="docs-lede">{page.description}</p>
        {page.sections.map((s) => (
          <section key={s.id} aria-labelledby={s.id}>
            <h2 id={s.id}>
              <a className="docs-anchor" href={`#${s.id}`}>
                {s.title}
              </a>
            </h2>
            {s.blocks.map((b, j) => (
              <BlockView key={j} b={b} />
            ))}
          </section>
        ))}
        <nav className="docs-pager" aria-label="Previous and next page">
          {prev ? (
            <a href={docsPath(prev.slug, BASE)} rel="prev">
              <span>Previous</span>
              {prev.nav}
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={docsPath(next.slug, BASE)} rel="next">
              <span>Next</span>
              {next.nav}
            </a>
          ) : null}
        </nav>
      </article>
      <nav className="docs-toc" aria-label="On this page">
        <p className="docs-nav-h">On this page</p>
        <ul>
          {page.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
