import { useEffect, useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from './icons'

interface Props {
  code: string
  label: string
}

/** A shell command that scrolls inside itself, with a copy button that announces success. */
export function CodeBlock({ code, label }: Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
    },
    [],
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      // Clipboard denied (insecure context or permissions): the text is still selectable.
    }
  }

  return (
    <div className="code">
      <pre tabIndex={0} aria-label={label}>
        <code>
          <span className="code-prompt" aria-hidden="true">
            ${' '}
          </span>
          {code}
        </code>
      </pre>
      <button type="button" className="code-copy" onClick={() => void copy()}>
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span className="visually-hidden">{copied ? 'Copied' : `Copy: ${label}`}</span>
      </button>
      <span className="visually-hidden" role="status">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  )
}
