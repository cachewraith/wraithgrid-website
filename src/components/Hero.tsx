import { HERO_ALT } from '../content'
import type { OS } from '../lib/os'
import { REPO_URL, RELEASES_URL, downloadHref, formatDownloads, type Release } from '../lib/release'
import { sectionPath } from '../lib/sections'
import { ExternalLink } from './ExternalLink'
import { DownloadIcon } from './icons'
import { Screenshot } from './Screenshot'

interface Props {
  os: OS
  release: Release | null
  /** Installer downloads over all releases; null while loading or when GitHub can't be read. */
  downloads: number | null
}

const INSTALL = sectionPath('install', import.meta.env.BASE_URL)

/** Windows has one installer to link straight to; macOS and Linux pick theirs under Install. */
function PrimaryDownload({ os, release }: Pick<Props, 'os' | 'release'>) {
  if (os === 'windows') {
    return (
      <ExternalLink className="btn btn-primary" href={downloadHref(release, 'windows')}>
        <DownloadIcon />
        Download for Windows
      </ExternalLink>
    )
  }
  const label = os === 'mac' ? 'Download for macOS' : os === 'linux' ? 'Download for Linux' : null
  return (
    <a className="btn btn-primary" href={INSTALL}>
      <DownloadIcon />
      {label ?? 'Download'}
    </a>
  )
}

export function Hero({ os, release, downloads }: Props) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <p className="hero-release" data-intro="1">
          {release ? (
            <ExternalLink href={`${REPO_URL}/releases/tag/${release.tag}`}>
              v{release.version}
            </ExternalLink>
          ) : (
            <ExternalLink href={RELEASES_URL}>Latest release</ExternalLink>
          )}
          <span>Now runs Gemini CLI and Antigravity CLI, and pastes screenshots.</span>
        </p>
        <h1 id="hero-title" data-intro="2">
          Every agent session you run, side by side.
        </h1>
        <p className="lede" data-intro="3">
          Wraithgrid is a desktop app for running many Claude Code, Gemini CLI and Antigravity
          sessions at once. Each pane has its own account, its own project folder and its own git
          branch.
        </p>
        <div className="cta" data-intro="4">
          <PrimaryDownload os={os} release={release} />
          <ExternalLink className="btn btn-secondary" href={REPO_URL}>
            Source on GitHub
          </ExternalLink>
        </div>
        <p className="hero-foot" data-intro="4">
          <span>Windows, macOS and Linux</span>
          <span>Free, MIT licensed</span>
          {downloads !== null && (
            <span title="Installer downloads across every release, from GitHub">
              {formatDownloads(downloads)}
            </span>
          )}
        </p>
      </div>
      <div className="container hero-shot" data-intro="5">
        <div className="frame">
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
    </section>
  )
}
