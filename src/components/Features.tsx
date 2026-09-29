import { FEATURES } from '../content'
import { FeatureIcon } from './icons'

export function Features() {
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="container">
        <p className="eyebrow">Features</p>
        <h2 id="features-title">Built for running claude all day</h2>
        <ul className="features">
          {FEATURES.map((f) => (
            <li key={f.title} className="feature">
              <span className="feature-icon">
                <FeatureIcon name={f.icon} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
