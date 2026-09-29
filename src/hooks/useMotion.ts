import { useEffect } from 'react'

function whenIdle(fn: () => void): () => void {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(fn, { timeout: 2000 })
    return () => {
      window.cancelIdleCallback(id)
    }
  }
  const id = setTimeout(fn, 200)
  return () => {
    clearTimeout(id)
  }
}

/**
 * Starts the scroll motion once the page has loaded and the browser is idle, so the GSAP chunk
 * never competes with the hero image for bandwidth. Tears it down on unmount.
 */
export function useMotion() {
  useEffect(() => {
    let alive = true
    let cleanup: (() => void) | undefined
    let cancelIdle: (() => void) | undefined

    const start = () => {
      cancelIdle = whenIdle(() => {
        void import('../lib/motion').then(({ initMotion }) => {
          if (alive) cleanup = initMotion()
        })
      })
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })

    return () => {
      alive = false
      window.removeEventListener('load', start)
      cancelIdle?.()
      cleanup?.()
    }
  }, [])
}
