const COLUMNS = [
  { x: 4, account: 'personal' },
  { x: 128, account: 'work' },
  { x: 252, account: 'client' },
] as const
const BOX_W = 104
const CLI = { x: 70, y: 232, w: 220, h: 56 }

function Diagram() {
  return (
    <svg
      className="diagram"
      viewBox="0 0 360 296"
      role="img"
      aria-labelledby="dg-title dg-desc"
      focusable="false"
    >
      <title id="dg-title">How Wraithgrid runs claude</title>
      <desc id="dg-desc">
        Three panes, for the personal, work and client accounts. Each pane sets CLAUDE_CONFIG_DIR to
        its own account folder, and all three run the same official claude CLI.
      </desc>
      <defs>
        <marker
          id="dg-arrow"
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path className="dg-arrowhead" d="M0 0 8 4 0 8Z" />
        </marker>
      </defs>

      {/* Layered back to front, grouped so src/lib/motion.ts can build the diagram in order. */}
      {COLUMNS.map(({ x, account }) => {
        const cx = x + BOX_W / 2
        const end = 180 + (cx - 180) / 3
        return (
          <g key={account}>
            <line
              className="dg-line dg-l1"
              x1={cx}
              y1={52}
              x2={cx}
              y2={110}
              markerEnd="url(#dg-arrow)"
            />
            <path
              className="dg-line dg-l2"
              d={`M${cx} 166 C${cx} 200 ${end} 200 ${end} ${CLI.y - 2}`}
              markerEnd="url(#dg-arrow)"
            />
          </g>
        )
      })}

      {COLUMNS.map(({ x, account }) => (
        <g key={account} className="dg-pane">
          <rect className="dg-box" x={x} y={6} width={BOX_W} height={46} rx={8} />
          <circle className="dg-dot" cx={x + 14} cy={29} r={4} />
          <text className="dg-small" x={x + 24} y={23}>
            pane
          </text>
          <text className="dg-label" x={x + 24} y={40}>
            {account}
          </text>
        </g>
      ))}

      <g className="dg-pill-g">
        <rect className="dg-pill" x={82} y={70} width={196} height={24} rx={12} />
        <text className="dg-pill-text" x={180} y={86} textAnchor="middle">
          CLAUDE_CONFIG_DIR
        </text>
      </g>

      {COLUMNS.map(({ x, account }) => (
        <g key={account} className="dg-dir">
          <rect className="dg-box" x={x} y={112} width={BOX_W} height={54} rx={8} />
          <path className="dg-folder" d={`M${x + 10} 128h7l2 2.5h9v11h-18Z`} />
          <text className="dg-mono" x={x + 34} y={138}>
            {account}/
          </text>
          <text className="dg-small" x={x + 10} y={157}>
            login · history
          </text>
        </g>
      ))}

      <g className="dg-cli-g">
        <rect
          className="dg-box dg-box-accent"
          x={CLI.x}
          y={CLI.y}
          width={CLI.w}
          height={CLI.h}
          rx={10}
        />
        <text className="dg-cli" x={180} y={CLI.y + 25} textAnchor="middle">
          claude
        </text>
        <text className="dg-small" x={180} y={CLI.y + 43} textAnchor="middle">
          the official CLI, unchanged
        </text>
      </g>
    </svg>
  )
}

export function HowItWorks() {
  return (
    <section className="section section-alt" aria-labelledby="how-title">
      <div className="container how">
        <div className="how-text">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title">The official CLI, one config folder per pane</h2>
          <p>
            Wraithgrid runs the official <code>claude</code> CLI unchanged. For each pane it sets{' '}
            <code>CLAUDE_CONFIG_DIR</code> to that account’s folder, so every account keeps its own
            login, settings and history.
          </p>
          <div className="callout">
            <strong>It never looks inside.</strong> Wraithgrid never reads, copies or proxies
            anything in those account folders. It only points the CLI at them.
          </div>
        </div>
        <Diagram />
      </div>
    </section>
  )
}
