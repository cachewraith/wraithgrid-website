import type { ThemeMode } from '../lib/theme'
import { REPO_URL } from '../lib/release'
import { sectionPath } from '../lib/sections'
import { ExternalLink } from './ExternalLink'
import { GitHubIcon } from './icons'
import { ThemeToggle } from './ThemeToggle'

const BASE = import.meta.env.BASE_URL

const LINKS = [
  [sectionPath('features', BASE), 'Features'],
  [sectionPath('install', BASE), 'Install'],
  [sectionPath('shortcuts', BASE), 'Shortcuts'],
  [sectionPath('faq', BASE), 'FAQ'],
] as const

interface Props {
  themeMode: ThemeMode
  onThemeChange: (mode: ThemeMode) => void
}

export function Nav({ themeMode, onThemeChange }: Props) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="brand" href={BASE}>
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="28" height="28" />
          <span>Wraithgrid</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          <ul>
            {LINKS.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <ExternalLink className="icon-button" href={REPO_URL} title="Wraithgrid on GitHub">
            <GitHubIcon />
            <span className="visually-hidden">Wraithgrid on GitHub</span>
          </ExternalLink>
          <ThemeToggle mode={themeMode} onChange={onThemeChange} />
        </div>
      </div>
    </header>
  )
}
