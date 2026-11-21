import { AGENT_CLIS, HERO_ALT } from '../content'
import type { OS } from '../lib/os'
import { REPO_URL, RELEASES_URL, downloadHref, formatDownloads, type Release } from '../lib/release'
import { docsPath } from '../lib/docs'
import { formatUsers } from '../lib/stats'
import { sectionPath } from '../lib/sections'
import { ExternalLink } from './ExternalLink'
import { ArrowIcon, DownloadIcon } from './icons'
import { Screenshot } from './Screenshot'

interface Props {
  os: OS
  release: Release | null
  /** Installer downloads over all releases; null while loading or when GitHub can't be read. */
  downloads: number | null
  /** People with a Wraithgrid account; null while loading or when the server can't be read. */
  users: number | null
}

const BASE = import.meta.env.BASE_URL
const INSTALL = sectionPath('install', BASE)

/** Windows has one installer to link straight to; macOS and Linux pick theirs under Install. */
export function PrimaryDownload({ os, release }: Pick<Props, 'os' | 'release'>) {
  if (os === 'windows') {
    return (
      <ExternalLink className="btn btn-primary btn-lg" href={downloadHref(release, 'windows')}>
        <DownloadIcon />
        Download for Windows
      </ExternalLink>
    )
  }
  const label = os === 'mac' ? 'Download for macOS' : os === 'linux' ? 'Download for Linux' : null
  return (
    <a className="btn btn-primary btn-lg" href={INSTALL}>
      <DownloadIcon />
      {label ?? 'Download'}
    </a>
  )
}

export function Hero({ os, release, downloads, users }: Props) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-copy">
        <p className="hero-release" data-intro="1">
          {release ? (
            <ExternalLink className="pill" href={`${REPO_URL}/releases/tag/${release.tag}`}>
              <span className="pill-tag">v{release.version}</span>
              <span className="pill-text">See what’s new in this release</span>
              <ArrowIcon />
            </ExternalLink>
          ) : (
            <ExternalLink className="pill" href={RELEASES_URL}>
              <span className="pill-tag">Latest</span>
              <span className="pill-text">See what’s new in the latest release</span>
              <ArrowIcon />
            </ExternalLink>
          )}
        </p>
        <h1 id="hero-title" data-intro="2">
          Every agent session you run, <span className="h1-soft">side by side.</span>
        </h1>
        <p className="lede" data-intro="3">
          Wraithgrid is a desktop app for running many Claude Code, Codex, Gemini CLI and other
          agent sessions at once. Each pane has its own account, its own project folder and its own
          git branch.
        </p>
        <div className="cta" data-intro="4">
          <PrimaryDownload os={os} release={release} />
          <a className="btn btn-secondary btn-lg" href={docsPath('', BASE)}>
            Read the docs
            <ArrowIcon />
          </a>
        </div>
        <p className="hero-foot" data-intro="4">
          <span>Windows, macOS and Linux</span>
          <span>Free and open source</span>
          <span>No telemetry</span>
          {downloads !== null && (
            <span title="Installer downloads across every release, from GitHub">
              {formatDownloads(downloads)}
            </span>
          )}
          {users !== null && users > 0 && (
            <span title="People with a Wraithgrid account">{formatUsers(users)}</span>
          )}
        </p>
      </div>
      <div className="container hero-shot" data-intro="5">
        <div className="hero-glow" aria-hidden="true" />
        <div className="frame frame-window">
          {/* Both themes are in the HTML and CSS shows one; the hidden one is lazy, so it
              never loads. public/theme-init.js preloads the visible one. */}
          <Screenshot
            className="only-dark"
            name="grid-dark"
            alt={HERO_ALT}
            sizes="(min-width: 1260px) 1200px, calc(100vw - 32px)"
          />
          <Screenshot
            className="only-light"
            name="grid-light"
            alt={HERO_ALT}
            sizes="(min-width: 1260px) 1200px, calc(100vw - 32px)"
          />
        </div>
      </div>
      <div className="container clis" data-intro="5">
        <p className="clis-label">Runs the official CLIs, unchanged</p>
        <ul className="clis-list">
          {AGENT_CLIS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
