import { RELEASES_URL, SOURCE_URL } from '../lib/release'
import { docsPath } from '../lib/docs'
import { sectionPath } from '../lib/sections'
import { ExternalLink } from './ExternalLink'

const BASE = import.meta.env.BASE_URL

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <a className="brand" href={BASE}>
            <img src={`${BASE}icon.svg`} alt="" width="24" height="24" />
            <span>Wraithgrid</span>
          </a>
          <p>
            Every agent session you run, side by side. Free and open source, for Windows, macOS and
            Linux.
          </p>
        </div>
        <nav className="footer-cols" aria-label="Footer">
          <div>
            <h2>Product</h2>
            <ul>
              <li>
                <a href={sectionPath('features', BASE)}>Features</a>
              </li>
              <li>
                <a href={sectionPath('install', BASE)}>Install</a>
              </li>
              <li>
                <a href={sectionPath('shortcuts', BASE)}>Shortcuts</a>
              </li>
              <li>
                <a href={sectionPath('faq', BASE)}>FAQ</a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Docs</h2>
            <ul>
              <li>
                <a href={docsPath('', BASE)}>Getting started</a>
              </li>
              <li>
                <a href={docsPath('chat', BASE)}>Chat</a>
              </li>
              <li>
                <a href={docsPath('accounts', BASE)}>Accounts</a>
              </li>
              <li>
                <a href={docsPath('themes', BASE)}>Themes</a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Project</h2>
            <ul>
              <li>
                <ExternalLink href={SOURCE_URL}>Source code</ExternalLink>
              </li>
              <li>
                <ExternalLink href={RELEASES_URL}>Releases</ExternalLink>
              </li>
              <li>
                <a href={`${BASE}feedback.html`}>Feedback</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="container footer-notes">
        <p>
          No tracking: this site has no analytics, trackers or cookies, and the app has no
          telemetry.
        </p>
        <p>Wraithgrid is an independent project, not affiliated with Anthropic or Google.</p>
      </div>
    </footer>
  )
}
