import type { ReactNode } from 'react'

/** 24px stroke icons, drawn in currentColor. Decorative: always paired with visible text. */
function Svg({ children, size = 24 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  )
}

export function DownloadIcon() {
  return (
    <Svg size={18}>
      <path d="M12 4v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M5 19.5h14" />
    </Svg>
  )
}

export function CopyIcon() {
  return (
    <Svg size={16}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </Svg>
  )
}

export function CheckIcon() {
  return (
    <Svg size={16}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  )
}

export function ThemeIcon({ mode }: { mode: 'system' | 'dark' | 'light' }) {
  if (mode === 'system')
    return (
      <Svg size={16}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </Svg>
    )
  if (mode === 'dark')
    return (
      <Svg size={16}>
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
      </Svg>
    )
  return (
    <Svg size={16}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </Svg>
  )
}

export function CloseIcon() {
  return (
    <Svg size={20}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

export function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <Svg size={20}>{dir === 'left' ? <path d="m15 5-7 7 7 7" /> : <path d="m9 5 7 7-7 7" />}</Svg>
  )
}

export function ArrowIcon() {
  return (
    <Svg size={16}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  )
}

export function MenuIcon({ open }: { open: boolean }) {
  return (
    <Svg size={20}>
      {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </Svg>
  )
}

/** One icon per feature group (content.ts FEATURE_GROUPS). */
export function GroupIcon({ id }: { id: 'chat' | 'limits' | 'parallel' | 'ship' | 'private' }) {
  switch (id) {
    case 'chat':
      return (
        <Svg size={20}>
          <path d="M20 12a7 7 0 0 1-10.2 6.2L4 20l1.8-5.8A7 7 0 1 1 20 12Z" />
          <path d="M9 11h6M9 14h3.5" />
        </Svg>
      )
    case 'limits':
      return (
        <Svg size={20}>
          <path d="M4 17a8 8 0 1 1 16 0" />
          <path d="m12 17 4-5" />
          <path d="M4 20h16" />
        </Svg>
      )
    case 'parallel':
      return (
        <Svg size={20}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </Svg>
      )
    case 'ship':
      return (
        <Svg size={20}>
          <circle cx="6" cy="5.5" r="2" />
          <circle cx="6" cy="18.5" r="2" />
          <circle cx="18" cy="8.5" r="2" />
          <path d="M6 7.5v9" />
          <path d="M18 10.5c0 4-6 3-11 6.5" />
        </Svg>
      )
    case 'private':
      return (
        <Svg size={20}>
          <path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6l-7-2.5Z" />
          <path d="m9 12 2.2 2.2L15.5 10" />
        </Svg>
      )
  }
}
