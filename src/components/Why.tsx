export function Why() {
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="container">
        <p className="eyebrow">Why</p>
        <h2 id="why-title">Stop logging out to switch accounts</h2>
        <div className="compare">
          <div className="compare-card">
            <h3>Without Wraithgrid</h3>
            <p>
              Switching claude accounts normally means logging out and logging back in. With a
              personal, a work and a client account, that happens all day.
            </p>
          </div>
          <div className="compare-card compare-card-accent">
            <h3>With Wraithgrid</h3>
            <p>
              Every pane has its own account and its own project folder, and they all run at once,
              in one window. No logging out.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
