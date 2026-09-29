import { Fragment } from 'react'
import { SHORTCUTS } from '../content'

export function Shortcuts() {
  return (
    <section id="shortcuts" className="section section-alt" aria-labelledby="shortcuts-title">
      <div className="container narrow">
        <p className="eyebrow">Shortcuts</p>
        <h2 id="shortcuts-title">Keyboard first</h2>
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
