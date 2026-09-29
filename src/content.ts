/** Page copy and data. Product facts here come from the project brief; don't invent others. */
import type { Platform, Release } from './lib/release'

export const SHOT_WIDTH = 1908
export const SHOT_HEIGHT = 1023

export type ShotName = 'grid-dark' | 'grid-light' | 'new-pane' | 'accounts' | 'settings'

export interface Shot {
  name: ShotName
  title: string
  alt: string
}

export const HERO_ALT =
  'Wraithgrid with four claude CLI panes in a 2×2 grid. Each pane shows its own account, project folder and status: running, or waiting for approval.'

export const GALLERY: readonly Shot[] = [
  {
    name: 'new-pane',
    title: 'New pane',
    alt: 'The New pane dialog: pick an account, a working directory and optional launch args. It previews the exact command it will run, with CLAUDE_CONFIG_DIR set to that account’s folder.',
  },
  {
    name: 'accounts',
    title: 'Accounts',
    alt: 'The Accounts page listing four accounts, each with its own config directory, login status and number of open panes.',
  },
  {
    name: 'settings',
    title: 'Settings',
    alt: 'The Settings page with the theme switch, five accent colours, terminal palettes such as Dracula, Nord and Tokyo Night, the terminal font, and the update check.',
  },
  {
    name: 'grid-light',
    title: 'Light theme',
    alt: 'The same four-pane grid in the light theme.',
  },
]

export type IconName =
  | 'accounts'
  | 'layouts'
  | 'workspaces'
  | 'status'
  | 'shared'
  | 'restore'
  | 'themes'
  | 'updates'
  | 'private'

export interface Feature {
  icon: IconName
  title: string
  body: string
}

export const FEATURES: readonly Feature[] = [
  {
    icon: 'accounts',
    title: 'Many accounts at once',
    body: 'Personal, work and client accounts running in the same window, each signed in on its own.',
  },
  {
    icon: 'layouts',
    title: 'Layouts',
    body: 'One pane, two side by side, 2×2 or three columns. Drag dividers to resize, drag headers to swap, zoom any pane.',
  },
  {
    icon: 'workspaces',
    title: 'Workspaces',
    body: 'Keep several workspaces and switch between them with Ctrl+Shift+1…9.',
  },
  {
    icon: 'status',
    title: 'Live pane status',
    body: 'Every pane shows whether it is running, idle, or waiting for your approval.',
  },
  {
    icon: 'shared',
    title: 'Shared CLAUDE.md and skills',
    body: 'Optionally link one CLAUDE.md and one skills/ folder into every account.',
  },
  {
    icon: 'restore',
    title: 'Survives restarts',
    body: 'Workspaces, layouts, accounts and folders come back when you reopen the app.',
  },
  {
    icon: 'themes',
    title: 'Themes',
    body: 'Dark, light or system. Five accents: violet, blue, teal, amber, rose. Terminal palettes: Dracula, Nord, Tokyo Night, Gruvbox, Solarized Dark and Light.',
  },
  {
    icon: 'updates',
    title: 'Update check',
    body: 'Checks GitHub Releases for a newer version and tells you when there is one.',
  },
  {
    icon: 'private',
    title: 'Private by design',
    body: 'No telemetry, a sandboxed renderer and validated IPC.',
  },
]

export const SHORTCUTS: readonly { action: string; keys: readonly string[] }[] = [
  { action: 'New pane', keys: ['Ctrl', 'Shift', 'N'] },
  { action: 'Close pane', keys: ['Ctrl', 'Shift', 'W'] },
  { action: 'Zoom pane', keys: ['Ctrl', 'Shift', 'Z'] },
  { action: 'Move focus', keys: ['Ctrl', 'Alt', 'Arrow'] },
  { action: 'Switch workspace', keys: ['Ctrl', 'Shift', '1…9'] },
  { action: 'All shortcuts', keys: ['Ctrl', 'Shift', '/'] },
]

export interface Faq {
  q: string
  a: string
}

export const FAQS: readonly Faq[] = [
  {
    q: 'Is Wraithgrid official?',
    a: 'No. It is an independent open-source project, not affiliated with Anthropic. It runs the official claude CLI unchanged.',
  },
  {
    q: 'Does it see my login or my code?',
    a: 'No. Wraithgrid sets CLAUDE_CONFIG_DIR for each pane and starts the claude CLI. It never reads, copies or proxies anything inside those account folders.',
  },
  {
    q: 'Is there a macOS version?',
    a: 'Not yet. Wraithgrid runs on Windows 10/11 and on Linux (x64).',
  },
  {
    q: 'Does it update itself?',
    a: 'It checks GitHub Releases and tells you when a new version is out. You download and install the new package yourself.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. Wraithgrid is free and open source under the MIT license.',
  },
]

export interface InstallTab {
  id: Platform
  label: string
  /** Shown on the download button and in the fallback command, when the real file is unknown. */
  filePattern: string
  command: ((file: string) => string) | null
  requirement: string
}

export const INSTALL_TABS: readonly InstallTab[] = [
  {
    id: 'windows',
    label: 'Windows',
    filePattern: 'Wraithgrid-Setup-*-x64.exe',
    command: null,
    requirement: 'Windows 10 or 11, x64.',
  },
  {
    id: 'deb',
    label: 'Ubuntu · Debian',
    filePattern: 'wraithgrid-*-amd64.deb',
    command: (f) => `sudo apt install ./${f}`,
    requirement: 'Ubuntu, Debian or Kali, x64.',
  },
  {
    id: 'rpm',
    label: 'Fedora',
    filePattern: 'wraithgrid-*-x86_64.rpm',
    command: (f) => `sudo dnf install ./${f}`,
    requirement: 'Fedora, x64.',
  },
  {
    id: 'pacman',
    label: 'Arch',
    filePattern: 'wraithgrid-*-x64.pacman',
    command: (f) => `sudo pacman -U ./${f}`,
    requirement: 'Arch Linux, x64.',
  },
  {
    id: 'appimage',
    label: 'AppImage',
    filePattern: 'Wraithgrid-*-x86_64.AppImage',
    command: (f) => `chmod +x ${f} && ./${f}`,
    requirement: 'Any x64 Linux distro.',
  },
]

/** The real filename when the release is known, else a shell glob that matches it. */
export function installFile(tab: InstallTab, release: Release | null): string {
  return release?.assets[tab.id]?.name ?? tab.filePattern
}

export const VERIFY_COMMAND = 'sha256sum -c SHA256SUMS.txt --ignore-missing'
