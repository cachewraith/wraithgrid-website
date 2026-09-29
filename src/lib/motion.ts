/**
 * Scroll motion: GSAP ScrollSmoother for smooth scrolling, ScrollTrigger for reveals, the
 * how-it-works diagram and the hero screenshot tilt. Loaded with a dynamic import after first
 * paint (see useMotion), so GSAP never delays the page.
 *
 * Everything except the nav's scrolled state lives inside one gsap.matchMedia branch: with
 * prefers-reduced-motion it is never created, and it is reverted if the setting changes.
 *
 * Reveals animate opacity, not visibility, so content that hasn't been revealed yet stays
 * reachable with Tab; focusing it scrolls it into view, which reveals it.
 */
import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { navOffset, restoreSection, setScroller } from './navigation'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

const EASE = 'power3.out'

/** Revealed one by one as each enters the viewport. */
const REVEAL = '.section .eyebrow, .section h2, .section-lede, .how-text > p, .how-text .callout'

/** Revealed in staggered batches, e.g. a row of feature cards together. */
const REVEAL_ITEMS =
  '.compare-card, .feature, .gallery > li, .tabs, .verify, .shortcuts tbody tr, .faq details'

function reveals() {
  for (const el of gsap.utils.toArray<HTMLElement>(REVEAL)) {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  }

  gsap.set(REVEAL_ITEMS, { opacity: 0, y: 28 })
  ScrollTrigger.batch(REVEAL_ITEMS, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE }),
  })
}

/** Panes appear, lines draw down to their folders, then converge on the one CLI. */
function diagram() {
  const svg = document.querySelector('.diagram')
  if (!svg) return
  const q = gsap.utils.selector(svg)

  for (const line of svg.querySelectorAll<SVGGeometryElement>('.dg-line')) {
    const length = line.getTotalLength()
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 })
  }

  gsap
    .timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: svg, start: 'top 75%', once: true },
    })
    .from(q('.dg-pane'), { opacity: 0, y: -10, duration: 0.5, stagger: 0.1 })
    .set(q('.dg-l1'), { opacity: 1 })
    .to(q('.dg-l1'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.08 })
    .from(
      q('.dg-pill-g'),
      { opacity: 0, scale: 0.9, transformOrigin: '50% 50%', duration: 0.4 },
      '<',
    )
    .from(q('.dg-dir'), { opacity: 0, y: -8, duration: 0.45, stagger: 0.1 }, '-=0.2')
    .set(q('.dg-l2'), { opacity: 1 })
    .to(q('.dg-l2'), { strokeDashoffset: 0, duration: 0.6, stagger: 0.08 })
    .from(q('.dg-cli-g'), { opacity: 0, y: 10, duration: 0.5 }, '-=0.3')

  // The "running" dots breathe, like the live status in the app.
  gsap.to(q('.dg-dot'), {
    opacity: 0.35,
    duration: 1.1,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.3,
  })
}

/**
 * The hero screenshot starts tilted back (set in CSS, so it's there on first paint) and
 * flattens over the first 520px of scroll. The from-values must match .hero-shot .frame in
 * sections.css, or it jumps when GSAP takes over.
 */
function heroTilt() {
  gsap.fromTo(
    '.hero-shot .frame',
    { rotationX: 12, scale: 0.95, transformOrigin: '50% 0%' },
    {
      rotationX: 0,
      scale: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 520, scrub: 0.6 },
    },
  )
}

export function initMotion(): () => void {
  const root = document.documentElement

  // Nav glass gets denser once the page scrolls; independent of motion preference.
  const navState = ScrollTrigger.create({
    start: 8,
    end: 'max',
    toggleClass: { targets: '.nav', className: 'is-scrolled' },
  })

  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.1,
      effects: false,
    })
    root.classList.add('has-smoother')

    reveals()
    diagram()
    heroTilt()

    // In-page links and deep links (/install) scroll through the smoother from now on.
    setScroller({
      measure: (target) => smoother.offset(target, `top ${navOffset()}px`),
      scrollTo: (y, smooth) => {
        smoother.scrollTo(y, smooth)
      },
    })
    restoreSection()

    return () => {
      setScroller(null)
      root.classList.remove('has-smoother')
    }
  })

  // Web fonts change text heights after first layout; re-measure trigger positions once.
  void document.fonts.ready.then(() => {
    ScrollTrigger.refresh()
  })

  return () => {
    mm.revert()
    navState.kill()
  }
}
