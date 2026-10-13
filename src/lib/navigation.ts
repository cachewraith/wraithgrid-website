/**
 * In-page navigation with clean URLs. Section links are real paths ("/install"); clicks scroll
 * to the section and pushState the path, back/forward scroll again, and a deep link scrolls on
 * load. Plain "#id" links (the skip link) scroll and move focus without touching the URL.
 */
import { sectionFromUrl, sectionPath, type SectionId } from './sections'

const BASE = import.meta.env.BASE_URL

function navOffset(): number {
  return (document.querySelector('.nav-inner')?.getBoundingClientRect().bottom ?? 0) + 16
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function scrollTo(y: number, smooth: boolean) {
  window.scrollTo({ top: y, behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'instant' })
}

function scrollToElement(target: HTMLElement | null, smooth: boolean, focus: boolean) {
  if (!target) {
    scrollTo(0, smooth)
    return
  }
  // Measure before focusing, so the explicit scroll to the measured position wins.
  const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navOffset())
  if (focus) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  scrollTo(y, smooth)
}

export function goToSection(id: SectionId | null, smooth = true, focus = true) {
  scrollToElement(id ? document.getElementById(id) : null, smooth, focus)
}

/** Scrolls to whatever section the current URL names. Used on load. */
function restoreSection(smooth = false) {
  const id = sectionFromUrl(location.pathname, location.hash, BASE)
  if (id) goToSection(id, smooth, false)
}

function onClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
    return
  if (!(e.target instanceof Element)) return
  const link = e.target.closest('a')
  if (!link || link.target || link.origin !== location.origin) return

  const raw = link.getAttribute('href') ?? ''
  if (raw.startsWith('#')) {
    // Plain in-page anchor (skip link): scroll and focus, keep the URL clean.
    const target = document.getElementById(decodeURIComponent(raw.slice(1)))
    if (!target) return
    e.preventDefault()
    scrollToElement(target, true, true)
    return
  }

  const isHome = link.pathname === BASE
  const id = sectionFromUrl(link.pathname, '', BASE)
  if (!isHome && !id) return
  e.preventDefault()
  const path = id ? sectionPath(id, BASE) : BASE
  if (location.pathname !== path || location.hash) history.pushState(null, '', path)
  goToSection(id, true, id !== null)
}

function onPopState() {
  goToSection(sectionFromUrl(location.pathname, location.hash, BASE), true, false)
}

export function initNavigation(): () => void {
  // An old "/#install" link becomes "/install".
  const id = sectionFromUrl(location.pathname, location.hash, BASE)
  if (id && location.hash) history.replaceState(null, '', sectionPath(id, BASE))

  restoreSection()
  // Web fonts can shift text after the first measure; land on the section again if the
  // visitor hasn't scrolled away meanwhile.
  const landedAt = window.scrollY
  void document.fonts.ready.then(() => {
    if (Math.abs(window.scrollY - landedAt) < 2) restoreSection()
  })

  document.addEventListener('click', onClick)
  window.addEventListener('popstate', onPopState)
  return () => {
    document.removeEventListener('click', onClick)
    window.removeEventListener('popstate', onPopState)
  }
}
