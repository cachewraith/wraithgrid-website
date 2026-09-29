// Runs before first paint (a same-origin file, because the CSP forbids inline scripts).
// Mirrors src/lib/theme.ts: a stored choice wins, else follow the OS, dark when it has no
// preference. Then preloads the hero screenshot for that theme.
;(function () {
  var mode = 'system'
  try {
    var stored = localStorage.getItem('wraithgrid:theme')
    if (stored === 'light' || stored === 'dark' || stored === 'system') mode = stored
  } catch {
    // Storage blocked: fall through to the OS preference.
  }
  var light =
    mode === 'light' ||
    (mode === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)
  var theme = light ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme)

  var script = document.currentScript
  if (!script || !script.src) return
  var shot = function (size) {
    return new URL('screenshots/grid-' + theme + '-' + size + '.webp', script.src).href
  }
  var link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.type = 'image/webp'
  link.setAttribute('fetchpriority', 'high')
  link.setAttribute('imagesrcset', shot('960') + ' 960w, ' + shot('full') + ' 1908w')
  link.setAttribute('imagesizes', '(min-width: 1180px) 1120px, calc(100vw - 32px)')
  document.head.appendChild(link)
})()
