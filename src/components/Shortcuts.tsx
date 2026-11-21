import { Fragment } from 'react'
import { SHORTCUTS } from '../content'
import { SectionHead } from './SectionHead'

export function Shortcuts() {
  return (
    <section id="shortcuts" className="section" aria-labelledby="shortcuts-title">
      <div className="container split">
        <div className="split-head">
          <SectionHead id="shortcuts-title" eyebrow="Keyboard" title="Keyboard shortcuts">
            On macOS, use ⌘ where these say Ctrl. Every Ctrl key still reaches the terminal there.
            Settings → Keyboard shortcuts rebinds the app’s own.
          </SectionHead>
        </div>
        <ul className="shortcuts" aria-label="Wraithgrid keyboard shortcuts" data-reveal="">
          {SHORTCUTS.map((s) => (
            <li key={s.action}>
              <span>{s.action}</span>
              <kbd>
                {s.keys.map((k, i) => (
                  <Fragment key={k}>
                    {i > 0 && <span className="kbd-plus">+</span>}
                    <kbd>{k}</kbd>
                  </Fragment>
                ))}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
