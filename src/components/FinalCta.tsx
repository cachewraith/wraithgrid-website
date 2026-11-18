import type { OS } from '../lib/os'
import { REPO_URL, type Release } from '../lib/release'
import { ExternalLink } from './ExternalLink'
import { ArrowIcon } from './icons'
import { PrimaryDownload } from './Hero'

/** The last thing on the page: the download again, for whoever read this far. */
export function FinalCta({ os, release }: { os: OS; release: Release | null }) {
  return (
    <section className="section final" aria-labelledby="final-title">
      <div className="container">
        <div className="final-card" data-reveal="">
          <div className="final-grid" aria-hidden="true" />
          <h2 id="final-title">Open your first grid</h2>
          <p>
            Free for Windows, macOS and Linux. Install one agent CLI, add an account, open a
            project, and start as many chats as you need.
          </p>
          <div className="cta">
            <PrimaryDownload os={os} release={release} />
            <ExternalLink className="btn btn-secondary btn-lg" href={`${REPO_URL}/releases`}>
              All releases
              <ArrowIcon />
            </ExternalLink>
          </div>
        </div>
      </div>
    </section>
  )
}
