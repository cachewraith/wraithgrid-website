import { Fragment } from 'react'
import { SHORTCUTS } from '../content'

export function Shortcuts() {
  return (
    <section id="shortcuts" className="section" aria-labelledby="shortcuts-title">
      <div className="container narrow">
        <h2 id="shortcuts-title">Keyboard shortcuts</h2>
        <p className="section-lede">
          On macOS, use ⌘ where these say Ctrl. Every Ctrl key still reaches the terminal there.
        </p>
        <table className="shortcuts">
          <caption className="visually-hidden">Wraithgrid keyboard shortcuts</caption>
          <thead>
            <tr>
              <th scope="col">Action</th>
              <th scope="col">Keys</th>
            </tr>
          </thead>
          <tbody>
            {SHORTCUTS.map((s) => (
              <tr key={s.action}>
                <th scope="row">{s.action}</th>
                <td>
                  <kbd>
                    {s.keys.map((k, i) => (
                      <Fragment key={k}>
                        {i > 0 && <span className="kbd-plus">+</span>}
                        <kbd>{k}</kbd>
                      </Fragment>
                    ))}
                  </kbd>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
