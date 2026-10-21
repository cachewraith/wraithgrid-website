import { HOW_EXAMPLES } from '../content'

export function HowItWorks() {
  return (
    <section className="section" aria-labelledby="how-title">
      <div className="container split">
        <div className="split-head">
          <h2 id="how-title">No more logging out to switch accounts</h2>
        </div>
        <div className="split-body prose">
          <p>
            Personal, work and client accounts normally mean signing out of one to use the next.
            Wraithgrid runs the official CLIs unchanged and gives each account its own config
            folder, so they are all signed in at the same time.
          </p>
          <p>
            This is all it does when it opens a pane. The New pane dialog shows you the same line
            before it runs:
          </p>
          <div className="runs" role="table" aria-label="What each pane runs">
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
          <p>
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
