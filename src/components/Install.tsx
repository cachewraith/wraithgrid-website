import { useRef, useState, type KeyboardEvent } from 'react'
import { INSTALL_TABS, VERIFY_COMMAND, installFile, type InstallTab } from '../content'
import type { OS } from '../lib/os'
import { RELEASES_URL, downloadHref, type Platform, type Release } from '../lib/release'
import { CodeBlock } from './CodeBlock'
import { ExternalLink } from './ExternalLink'
import { DownloadIcon } from './icons'

/** Linux gets the AppImage tab: it runs on any distro, so no distro has to be guessed. */
function initialTab(os: OS): Platform {
  return os === 'linux' ? 'appimage' : 'windows'
}

function Panel({ tab, release }: { tab: InstallTab; release: Release | null }) {
  const asset = release?.assets[tab.id]
  const file = installFile(tab, release)
  return (
    <>
      <div className="install-download">
        <ExternalLink className="btn btn-primary" href={downloadHref(release, tab.id)}>
          <DownloadIcon />
          {asset ? `Download ${asset.name}` : `Download for ${tab.label}`}
        </ExternalLink>
        {release?.assets[tab.id] && <span className="cta-meta">v{release.version}</span>}
      </div>

      {tab.command ? (
        <>
          <p>Then, in the folder you downloaded it to:</p>
          <CodeBlock code={tab.command(file)} label={`${tab.label} install command`} />
        </>
      ) : (
        <>
          <p>
            Run <code>{file}</code> and follow the installer.
          </p>
          <div className="callout callout-warn">
            <strong>Windows SmartScreen will warn you.</strong> The installer is not code-signed
            yet, so Windows shows “Windows protected your PC”. Choose <b>More info</b>, then{' '}
            <b>Run anyway</b>. If you’d rather check the file first, verify its checksum below.
          </div>
        </>
      )}
      <p className="install-req">
        {tab.requirement} Requires the <code>claude</code> CLI to be installed.
      </p>
    </>
  )
}

export function Install({ os, release }: { os: OS; release: Release | null }) {
  const [active, setActive] = useState<Platform>(() => initialTab(os))
  const tabRefs = useRef(new Map<Platform, HTMLButtonElement>())

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = INSTALL_TABS.findIndex((t) => t.id === active)
    const last = INSTALL_TABS.length - 1
    const next =
      e.key === 'ArrowRight'
        ? (i + 1) % INSTALL_TABS.length
        : e.key === 'ArrowLeft'
          ? (i - 1 + INSTALL_TABS.length) % INSTALL_TABS.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null
    if (next === null) return
    e.preventDefault()
    const tab = INSTALL_TABS[next]
    if (!tab) return
    setActive(tab.id)
    tabRefs.current.get(tab.id)?.focus()
  }

  return (
    <section id="install" className="section" aria-labelledby="install-title">
      <div className="container install">
        <p className="eyebrow">Install</p>
        <h2 id="install-title">Install Wraithgrid</h2>
        <p className="section-lede">
          x64 builds for Windows 10/11 and Linux: Ubuntu, Debian, Kali, Fedora and Arch, on X11 or
          Wayland (including Hyprland and sway).
        </p>

        <div className="tabs">
          <div className="tablist" role="tablist" aria-label="Platform" onKeyDown={onKeyDown}>
            {INSTALL_TABS.map((t) => (
              <button
                key={t.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(t.id, el)
                  else tabRefs.current.delete(t.id)
                }}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={active === t.id ? 0 : -1}
                onClick={() => {
                  setActive(t.id)
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          {INSTALL_TABS.map((t) => (
            <div
              key={t.id}
              className="tabpanel"
              role="tabpanel"
              id={`panel-${t.id}`}
              aria-labelledby={`tab-${t.id}`}
              hidden={active !== t.id}
              tabIndex={0}
            >
              {active === t.id && <Panel tab={t} release={release} />}
            </div>
          ))}
        </div>

        <div className="verify">
          <h3>Verify the download</h3>
          <p>
            Every release ships a <code>SHA256SUMS.txt</code>.{' '}
            <ExternalLink href={release?.checksums?.url ?? RELEASES_URL}>Download it</ExternalLink>{' '}
            into the same folder as the package, then run:
          </p>
          <CodeBlock code={VERIFY_COMMAND} label="Checksum verification command" />
          <p className="install-req">
            It prints <code>OK</code> next to each file you downloaded.
          </p>
        </div>
      </div>
    </section>
  )
}
