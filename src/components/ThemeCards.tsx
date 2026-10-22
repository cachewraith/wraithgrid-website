import { APP_THEMES } from '../lib/app-themes'

/**
 * The app's built-in themes as small windows in their own colors. Colors live in
 * styles/themes.css (one class per theme): the CSP allows no inline styles.
 */
export function ThemeCards() {
  return (
    <ul className="themes" aria-label="Built-in themes">
      {APP_THEMES.map((t) => (
        <li key={t.id} className={`theme-card tc-${t.id}`}>
          <div className="tc-win" aria-hidden="true">
            <div className="tc-side">
              <span className="tc-ln tc-on" />
              <span className="tc-ln" />
              <span className="tc-ln tc-short" />
            </div>
            <div className="tc-main">
              <span className="tc-bub" />
              <span className="tc-ln" />
              <span className="tc-ln tc-short" />
              <span className="tc-btn" />
            </div>
          </div>
          <p className="tc-name">
            {t.name} <span>{t.mode === 'dark' ? 'Dark' : 'Light'}</span>
          </p>
          <p className="tc-tag">{t.tagline}</p>
        </li>
      ))}
    </ul>
  )
}
