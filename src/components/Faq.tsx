import { FAQS } from '../content'

export function Faq() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container narrow">
        <h2 id="faq-title">Questions</h2>
        <div className="faq">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
