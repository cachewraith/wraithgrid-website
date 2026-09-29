import { HERO_ALT } from '../content'
import type { OS } from '../lib/os'
import { RELEASES_URL, downloadHref, type Release } from '../lib/release'
import { sectionPath } from '../lib/sections'
import type { ResolvedTheme } from '../lib/theme'
import { ExternalLink } from './ExternalLink'
import { DownloadIcon } from './icons'
import { Screenshot } from './Screenshot'

interface Props {
  os: OS
  release: Release | null
  theme: ResolvedTheme
}

function hasLinuxBuild(release: Release | null): boolean {
  const a = release?.assets
  return Boolean(a?.deb ?? a?.rpm ?? a?.pacman ?? a?.appimage)
}

function PrimaryDownload({ os, release }: Omit<Props, 'theme'>) {
  if (os === 'windows') {
    return (
      <div className="cta-primary">
        <ExternalLink className="btn btn-primary" href={downloadHref(release, 'windows')}>
          <DownloadIcon />
          Download for Windows
        </ExternalLink>
        {release?.assets.windows && (
          <span className="cta-meta">v{release.version} · x64 installer</span>
        )}
      </div>
    )
  }
  if (os === 'linux') {
    return (
      <div className="cta-primary">
        <a className="btn btn-primary" href={sectionPath('install', import.meta.env.BASE_URL)}>
          <DownloadIcon />
          Download for Linux
        </a>
        {release && hasLinuxBuild(release) && (
          <span className="cta-meta">v{release.version} · .deb, .rpm, .pacman, AppImage</span>
        )}
      </div>
    )
  }
  return (
    <div className="cta-primary">
      <p className="cta-note">Available for Windows and Linux.</p>
    </div>
  )
}

export function Hero({ os, release, theme }: Props) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <p className="eyebrow" data-intro="1">
          Desktop app for the claude CLI · Windows and Linux
        </p>
        <h1 id="hero-title" data-intro="2">
          Many claude sessions.
          <br />
          <span className="accent">One window.</span>
        </h1>
        <p className="lede" data-intro="3">
          Run many claude CLI sessions side by side, each with its own account and project folder.
        </p>
        <div className="cta" data-intro="4">
          <PrimaryDownload os={os} release={release} />
          <ExternalLink className="btn btn-secondary" href={RELEASES_URL}>
            All downloads
          </ExternalLink>
        </div>
        <p className="hero-foot" data-intro="5">
          Free and open source (MIT). Requires the claude CLI.
        </p>
        <div className="hero-shot" data-intro="6">
          <div className="frame">
            <Screenshot
              key={theme}
              name={theme === 'light' ? 'grid-light' : 'grid-dark'}
              alt={HERO_ALT}
              sizes="(min-width: 1180px) 1120px, calc(100vw - 32px)"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
