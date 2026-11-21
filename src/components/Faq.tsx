import { FAQS } from '../content'
import { docsPath } from '../lib/docs'
import { SOURCE_URL } from '../lib/release'
import { ExternalLink } from './ExternalLink'
import { ArrowIcon } from './icons'
import { SectionHead } from './SectionHead'

export function Faq() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container split">
        <div className="split-head">
          <SectionHead id="faq-title" eyebrow="FAQ" title="Questions">
            What people ask before they install. The docs go further into each part of the app.
          </SectionHead>
          <p className="more-link">
            <a href={docsPath('', import.meta.env.BASE_URL)}>
              Read the docs
              <ArrowIcon />
            </a>
          </p>
          <p className="more-link">
            <ExternalLink href={SOURCE_URL}>
              Source code on GitHub
              <ArrowIcon />
            </ExternalLink>
          </p>
        </div>
        <div className="faq" data-reveal="">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>
                <span>{f.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
