import { HOW_EXAMPLES, STEPS } from '../content'
import { SectionHead } from './SectionHead'

export function HowItWorks() {
  return (
    <section className="section" aria-labelledby="how-title">
      <div className="container">
        <SectionHead
          id="how-title"
          eyebrow="How it works"
          title="No more logging out to switch accounts"
        >
          Personal, work and client accounts normally mean signing out of one to use the next.
          Wraithgrid runs the official CLIs unchanged and gives each account its own config folder,
          so they are all signed in at the same time.
        </SectionHead>

        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step card" data-reveal="">
              <span className="step-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="runs-wrap" data-reveal="">
          <div className="runs-intro">
            <h3>What a pane actually runs</h3>
            <p>
              This is all Wraithgrid does when it opens a pane. The New pane dialog shows you the
              same line before it runs.
            </p>
          </div>
          <div className="runs" role="table" aria-label="What each pane runs">
            <div className="runs-bar" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="runs-row runs-headrow" role="row">
              <span role="columnheader">Pane</span>
              <span role="columnheader">Account</span>
              <span role="columnheader">Runs</span>
            </div>
            {HOW_EXAMPLES.map((r) => (
              <div className="runs-row" role="row" key={r.pane}>
                <span role="cell">{r.pane}</span>
                <span role="cell">{r.account}</span>
                <code role="cell">
                  <span className="runs-env">{r.env}</span> {r.cli}
                </code>
              </div>
            ))}
          </div>
          <p className="runs-note">
            Codex, Cursor and Copilot get <code>CODEX_HOME</code>, <code>CURSOR_CONFIG_DIR</code> or{' '}
            <code>COPILOT_HOME</code> the same way. Wraithgrid never reads, copies or proxies
            anything in those folders. Antigravity and opencode have no per-account folder, so their
            accounts on one computer share a single login.
          </p>
        </div>
      </div>
    </section>
  )
}
