import { THEME_MODES, type ThemeMode } from '../lib/theme'
import { ThemeIcon } from './icons'

const LABELS: Record<ThemeMode, string> = { system: 'System', dark: 'Dark', light: 'Light' }

interface Props {
  mode: ThemeMode
  onChange: (mode: ThemeMode) => void
}

/** System / Dark / Light, the same three-way switch as the app's settings. */
export function ThemeToggle({ mode, onChange }: Props) {
  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      {THEME_MODES.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          title={`${LABELS[m]} theme`}
          onClick={() => {
            onChange(m)
          }}
        >
          <ThemeIcon mode={m} />
          <span className="visually-hidden">{LABELS[m]} theme</span>
        </button>
      ))}
    </div>
  )
}
