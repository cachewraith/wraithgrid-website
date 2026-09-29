import { RELEASES_URL, REPO_URL } from '../lib/release'
import { ExternalLink } from './ExternalLink'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="24" height="24" />
          <span>Wraithgrid</span>
        </div>
        <ul className="footer-links">
          <li>
            <ExternalLink href={REPO_URL}>GitHub</ExternalLink>
          </li>
          <li>
            <ExternalLink href={RELEASES_URL}>Releases</ExternalLink>
          </li>
          <li>
            <ExternalLink href={`${REPO_URL}/blob/main/LICENSE`}>MIT License</ExternalLink>
          </li>
        </ul>
        <div className="footer-notes">
          <p>
            No tracking: this site has no analytics, trackers or cookies, and the app has no
            telemetry.
          </p>
          <p>Wraithgrid is an independent project, not affiliated with Anthropic.</p>
        </div>
      </div>
    </footer>
  )
}
