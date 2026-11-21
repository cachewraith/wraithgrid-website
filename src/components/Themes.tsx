import { docsPath } from '../lib/docs'
import { ArrowIcon } from './icons'
import { SectionHead } from './SectionHead'
import { ThemeCards } from './ThemeCards'

/** Landing section: the five built-in themes, and a pointer to making your own. */
export function Themes() {
  return (
    <section id="themes" className="section" aria-labelledby="themes-title">
      <div className="container">
        <SectionHead id="themes-title" eyebrow="Themes" title="Five themes, or make your own">
          Pick one in Settings → Appearance, follow your OS between a dark and a light one, edit any
          of them live with Customize…, or install a theme someone shared from Browse community….
        </SectionHead>
        <div data-reveal="">
          <ThemeCards />
        </div>
        <p className="more-link">
          <a href={docsPath('themes', import.meta.env.BASE_URL)}>
            How to make a theme
            <ArrowIcon />
          </a>
        </p>
      </div>
    </section>
  )
}
