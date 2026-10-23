/**
 * The app's five built-in themes, for the theme cards on the page and in the docs. Copied
 * from the app (src/shared/themes.ts, v1.11): only the colors a card draws.
 */
export interface AppTheme {
  id: string
  name: string
  mode: 'dark' | 'light'
  tagline: string
  colors: {
    frame: string
    sidebar: string
    bg: string
    raised: string
    text: string
    faint: string
    accent: string
  }
}

export const APP_THEMES: readonly AppTheme[] = [
  {
    id: 'wraith',
    name: 'Wraith',
    mode: 'dark',
    tagline: 'Neutral grey, violet accent. The default.',
    colors: {
      frame: '#121212',
      sidebar: '#171717',
      bg: '#1c1c1c',
      raised: '#2a2a2a',
      text: '#ececec',
      faint: '#8f8f8f',
      accent: '#7c5cff',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    mode: 'dark',
    tagline: 'Deep navy, cyan accent.',
    colors: {
      frame: '#080b12',
      sidebar: '#0b0f19',
      bg: '#0f1420',
      raised: '#1b2333',
      text: '#e2e8f5',
      faint: '#7c879c',
      accent: '#22d3ee',
    },
  },
  {
    id: 'clay',
    name: 'Clay',
    mode: 'dark',
    tagline: 'Warm brown-grey, terracotta accent.',
    colors: {
      frame: '#12100e',
      sidebar: '#191613',
      bg: '#1f1b18',
      raised: '#2e2823',
      text: '#f0e9e1',
      faint: '#968a7d',
      accent: '#d97757',
    },
  },
  {
    id: 'daylight',
    name: 'Daylight',
    mode: 'light',
    tagline: 'Clean white, violet accent.',
    colors: {
      frame: '#e8e8e7',
      sidebar: '#f9f9f8',
      bg: '#ffffff',
      raised: '#efefed',
      text: '#1f1f1f',
      faint: '#6b6b6b',
      accent: '#7c5cff',
    },
  },
  {
    id: 'paper',
    name: 'Paper',
    mode: 'light',
    tagline: 'Warm off-white, ink-blue accent.',
    colors: {
      frame: '#e8e1d2',
      sidebar: '#f3eee3',
      bg: '#fbf8f1',
      raised: '#ece5d6',
      text: '#2b2620',
      faint: '#7a7063',
      accent: '#2f5fb3',
    },
  },
]

/** A theme file people can start from (the format in the app's docs/THEMES.md). */
export const THEME_EXAMPLE = `{
  "name": "Ocean",
  "mode": "dark",
  "author": "you",
  "colors": {
    "bg": "#0f1a24",
    "text": "#e6f1ff",
    "accent": "#38bdf8"
  },
  "terminal": {
    "red": "#ff6b81"
  },
  "style": {
    "radius": "large",
    "depth": "deep",
    "density": "spacious"
  }
}`
