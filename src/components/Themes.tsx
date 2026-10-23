import { docsPath } from '../lib/docs'
import { ThemeCards } from './ThemeCards'

/** Landing section: the five built-in themes, and a pointer to making your own. */
export function Themes() {
  return (
    <section id="themes" className="section" aria-labelledby="themes-title">
      <div className="container">
        <h2 id="themes-title">Five themes, or make your own</h2>
        <p className="section-lede">
          Pick one in Settings → Appearance, follow your OS between a dark and a light one, edit any
          of them live with Customize…, or install a theme someone shared from Browse community….
        </p>
        <ThemeCards />
        <p className="themes-more">
          <a href={docsPath('themes', import.meta.env.BASE_URL)}>How to make a theme →</a>
        </p>
      </div>
    </section>
  )
}
