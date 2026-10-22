import { Fragment } from 'react'
import { parseInline } from '../../lib/docs'
import { ExternalLink } from '../ExternalLink'

const BASE = import.meta.env.BASE_URL

/** Docs text with `code`, **bold**, links and keys, as React elements: never HTML. */
export function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((t, i) => {
        switch (t.t) {
          case 'code':
            return <code key={i}>{t.v}</code>
          case 'b':
            return <strong key={i}>{t.v}</strong>
          case 'kbd':
            return <kbd key={i}>{t.v}</kbd>
          case 'link':
            return t.href.startsWith('/') ? (
              <a key={i} href={`${BASE}${t.href.slice(1)}`}>
                {t.v}
              </a>
            ) : (
              <ExternalLink key={i} href={t.href}>
                {t.v}
              </ExternalLink>
            )
          default:
            return <Fragment key={i}>{t.v}</Fragment>
        }
      })}
    </>
  )
}
