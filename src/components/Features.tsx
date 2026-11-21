import { FEATURE_GROUPS, FEATURES } from '../content'
import { GroupIcon } from './icons'
import { SectionHead } from './SectionHead'

export function Features() {
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="container">
        <SectionHead id="features-title" eyebrow="Features" title="Everything in the app">
          What Wraithgrid does, grouped by what you are trying to get done.
        </SectionHead>
        <div className="groups">
          {FEATURE_GROUPS.map((g) => (
            <section key={g.id} className="group" aria-labelledby={`group-${g.id}`}>
              <header className="group-head" data-reveal="">
                <span className="group-icon">
                  <GroupIcon id={g.id} />
                </span>
                <div>
                  <h3 id={`group-${g.id}`}>{g.title}</h3>
                  <p>{g.blurb}</p>
                </div>
              </header>
              <ul className="features">
                {FEATURES.filter((f) => f.group === g.id).map((f) => (
                  <li key={f.title} className="feature card" data-reveal="">
                    <h4>{f.title}</h4>
                    <p>{f.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
