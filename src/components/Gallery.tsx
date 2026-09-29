import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { GALLERY } from '../content'
import { ChevronIcon, CloseIcon } from './icons'
import { Screenshot } from './Screenshot'

const FOCUSABLE = 'button, [href], [tabindex]:not([tabindex="-1"])'

/**
 * Thumbnails open a native modal <dialog>: it makes the rest of the page inert and closes on
 * Esc. Tab is additionally wrapped inside the dialog so focus never leaves it.
 */
export function Gallery() {
  const [index, setIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  const open = index !== null
  const shot = index === null ? undefined : GALLERY[index]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      closeRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const close = useCallback(() => {
    setIndex(null)
  }, [])

  // Fires for Esc and for the close button (via the effect above) alike. Focus can only
  // return to the thumbnail once the dialog is closed and the page is no longer inert.
  const onClosed = useCallback(() => {
    setIndex(null)
    openerRef.current?.focus()
  }, [])

  const step = useCallback((delta: number) => {
    setIndex((i) => (i === null ? i : (i + delta + GALLERY.length) % GALLERY.length))
  }, [])

  function onKeyDown(e: KeyboardEvent<HTMLDialogElement>) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
    } else if (e.key === 'Tab') {
      const items = [...e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)]
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  return (
    <section className="section section-alt" aria-labelledby="gallery-title">
      <div className="container">
        <p className="eyebrow">Screenshots</p>
        <h2 id="gallery-title">A closer look</h2>
        <ul className="gallery">
          {GALLERY.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                className="gallery-item"
                aria-label={`Open the ${s.title} screenshot`}
                onClick={(e) => {
                  openerRef.current = e.currentTarget
                  setIndex(i)
                }}
              >
                <span className="frame">
                  <Screenshot
                    name={s.name}
                    alt={s.alt}
                    sizes="(min-width: 1180px) 552px, (min-width: 720px) calc(50vw - 40px), calc(100vw - 32px)"
                  />
                </span>
                <span className="gallery-caption">{s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-labelledby="lightbox-title"
        onClose={onClosed}
        onKeyDown={onKeyDown}
      >
        {shot && (
          <div className="lightbox-inner">
            <div className="lightbox-bar">
              <h3 id="lightbox-title">
                {shot.title}{' '}
                <span className="lightbox-count">
                  {(index ?? 0) + 1} / {GALLERY.length}
                </span>
              </h3>
              <button ref={closeRef} type="button" className="icon-button" onClick={close}>
                <CloseIcon />
                <span className="visually-hidden">Close (Esc)</span>
              </button>
            </div>
            <div className="lightbox-body">
              <Screenshot key={shot.name} name={shot.name} alt={shot.alt} sizes="100vw" priority />
            </div>
            <div className="lightbox-nav">
              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  step(-1)
                }}
              >
                <ChevronIcon dir="left" />
                <span className="visually-hidden">Previous screenshot</span>
              </button>
              <p className="lightbox-desc">{shot.alt}</p>
              <button
                type="button"
                className="icon-button"
                onClick={() => {
                  step(1)
                }}
              >
                <ChevronIcon dir="right" />
                <span className="visually-hidden">Next screenshot</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
