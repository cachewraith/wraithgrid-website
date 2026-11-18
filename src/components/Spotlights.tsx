import { GALLERY, SPOTLIGHTS } from '../content'
import { CheckIcon } from './icons'
import { Screenshot } from './Screenshot'

/** The app's main screens, one per row: what it does on one side, the screen on the other. */
export function Spotlights() {
  return (
    <section className="section spotlights" aria-label="Main screens">
      <div className="container">
        {SPOTLIGHTS.map((s, i) => (
          <article
            key={s.shot}
            className={i % 2 ? 'spot is-flipped' : 'spot'}
            aria-labelledby={`spot-${s.shot}`}
          >
            <div className="spot-copy" data-reveal="">
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 id={`spot-${s.shot}`}>{s.title}</h2>
              <p className="spot-body">{s.body}</p>
              <ul className="spot-points">
                {s.points.map((p) => (
                  <li key={p}>
                    <CheckIcon />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="spot-media" data-reveal="">
              <div className="frame frame-window">
                <Screenshot
                  name={s.shot}
                  alt={GALLERY.find((g) => g.name === s.shot)?.alt ?? ''}
                  sizes="(min-width: 1000px) 720px, calc(100vw - 32px)"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
