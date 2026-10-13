import { useRef, useState, type KeyboardEvent } from 'react'
import { GALLERY } from '../content'
import { Screenshot } from './Screenshot'

const BASE = import.meta.env.BASE_URL

/** One screenshot at a time, picked from a tab row; the image links to the full-size PNG. */
export function Gallery() {
  const [index, setIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const shot = GALLERY[index] ?? GALLERY[0]
  if (!shot) return null

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const n = GALLERY.length
    const next =
      e.key === 'ArrowRight'
        ? (index + 1) % n
        : e.key === 'ArrowLeft'
          ? (index - 1 + n) % n
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? n - 1
              : null
    if (next === null) return
    e.preventDefault()
    setIndex(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section className="section" aria-labelledby="gallery-title">
      <div className="container">
        <h2 id="gallery-title">A closer look</h2>
        <div className="seg gallery-tabs" role="tablist" aria-label="Screens" onKeyDown={onKeyDown}>
          {GALLERY.map((s, i) => (
            <button
              key={s.name}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`shot-tab-${s.name}`}
              aria-selected={i === index}
              aria-controls="shot-panel"
              tabIndex={i === index ? 0 : -1}
              onClick={() => {
                setIndex(i)
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
        <figure
          className="gallery-view"
          role="tabpanel"
          id="shot-panel"
          aria-labelledby={`shot-tab-${shot.name}`}
        >
          <a
            className="frame"
            href={`${BASE}screenshots/${shot.name}.png`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open full size"
          >
            <Screenshot
              key={shot.name}
              name={shot.name}
              alt={shot.alt}
              sizes="(min-width: 1260px) 1200px, calc(100vw - 32px)"
            />
          </a>
          <figcaption>{shot.alt}</figcaption>
        </figure>
      </div>
    </section>
  )
}
