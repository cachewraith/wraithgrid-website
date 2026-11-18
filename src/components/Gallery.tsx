import { useRef, useState, type KeyboardEvent } from 'react'
import { GALLERY, SPOTLIGHTS } from '../content'
import { Screenshot } from './Screenshot'
import { SectionHead } from './SectionHead'

const BASE = import.meta.env.BASE_URL

/** The screens the spotlights above don't already show. */
const SHOTS = GALLERY.filter((g) => !SPOTLIGHTS.some((s) => s.shot === g.name))

/** One screenshot at a time, picked from a tab row; the image links to the full-size PNG. */
export function Gallery() {
  const [index, setIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const shot = SHOTS[index] ?? SHOTS[0]
  if (!shot) return null

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const n = SHOTS.length
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
        <SectionHead id="gallery-title" eyebrow="Tour" title="A closer look" center>
          The rest of the app, as it looks on a real screen. Click a screenshot to open it full
          size.
        </SectionHead>
        <div className="gallery" data-reveal="">
          <div
            className="seg gallery-tabs"
            role="tablist"
            aria-label="Screens"
            onKeyDown={onKeyDown}
          >
            {SHOTS.map((s, i) => (
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
              className="frame frame-window"
              href={`${BASE}screenshots/${shot.name}.png`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full size"
            >
              <Screenshot
                key={shot.name}
                className="fade-in"
                name={shot.name}
                alt={shot.alt}
                sizes="(min-width: 1260px) 1200px, calc(100vw - 32px)"
              />
            </a>
            <figcaption key={shot.name} className="fade-in">
              {shot.alt}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
