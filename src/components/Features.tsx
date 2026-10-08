import { FEATURES } from '../content'

export function Features() {
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="container">
        <h2 id="features-title">What’s in it</h2>
        <ul className="features">
          {FEATURES.map((f) => (
            <li key={f.title} className="feature">
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
