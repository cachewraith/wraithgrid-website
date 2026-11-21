import { useEffect, useState } from 'react'
import type { ThemeMode } from '../lib/theme'
import { SOURCE_URL } from '../lib/release'
import { docsPath } from '../lib/docs'
import { sectionPath } from '../lib/sections'
import { ExternalLink } from './ExternalLink'
import { GitHubIcon, MenuIcon } from './icons'
import { ThemeToggle } from './ThemeToggle'

const BASE = import.meta.env.BASE_URL

const LINKS = [
  [sectionPath('features', BASE), 'Features'],
  [docsPath('', BASE), 'Docs'],
  [sectionPath('install', BASE), 'Install'],
  [sectionPath('faq', BASE), 'FAQ'],
] as const

interface Props {
  /** The docs pages mark their nav link as current. */
  current?: 'docs'
  themeMode: ThemeMode
  onThemeChange: (mode: ThemeMode) => void
}

function Links({ current, onPick }: { current: 'docs' | undefined; onPick?: () => void }) {
  return (
    <ul>
      {LINKS.map(([href, label]) => (
        <li key={href}>
          <a
            href={href}
            aria-current={current === 'docs' && label === 'Docs' ? 'page' : undefined}
            onClick={onPick}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function Nav({ current, themeMode, onThemeChange }: Props) {
  const [open, setOpen] = useState(false)

  // The phone menu closes on Escape, and when the window grows past the phone layout.
  useEffect(() => {
    if (!open) return
    const wide = window.matchMedia('(min-width: 720px)')
    const close = () => {
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    wide.addEventListener('change', close)
    return () => {
      document.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', close)
    }
  }, [open])

  return (
    <header className={open ? 'nav is-open' : 'nav'}>
      <div className="nav-inner">
        <a className="brand" href={BASE}>
          <img src={`${BASE}icon.svg`} alt="" width="28" height="28" />
          <span>Wraithgrid</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          <Links current={current} />
        </nav>
        <div className="nav-actions">
          <ExternalLink className="icon-button" href={SOURCE_URL} title="Source code on GitHub">
            <GitHubIcon />
            <span className="visually-hidden">Source code on GitHub</span>
          </ExternalLink>
          <ThemeToggle mode={themeMode} onChange={onThemeChange} />
          <button
            type="button"
            className="icon-button nav-menu-button"
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => {
              setOpen((o) => !o)
            }}
          >
            <MenuIcon open={open} />
            <span className="visually-hidden">Menu</span>
          </button>
        </div>
      </div>
      <nav id="nav-menu" className="nav-menu" aria-label="Menu" hidden={!open}>
        <Links
          current={current}
          onPick={() => {
            setOpen(false)
          }}
        />
      </nav>
    </header>
  )
}
