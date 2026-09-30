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
  'Wraithgrid with four claude CLI panes in a 2×2 grid. Each pane shows its own account, project folder and status: running, idle, or waiting for approval. The sidebar groups accounts into a Work folder, each with its own emoji icon.'

export const GALLERY: readonly Shot[] = [
  {
    name: 'new-pane',
    title: 'New pane',
    alt: 'The New pane dialog: pick an account, a working directory and optional launch args. It previews the exact command it will run, with CLAUDE_CONFIG_DIR set to that account’s folder.',
  },
  {
    name: 'accounts',
    title: 'Accounts',
    alt: 'The Accounts page listing four accounts, each with its own emoji icon, config directory, login status and number of open panes. Every account shares CLAUDE.md, skills and plugins from ~/.claude.',
  },
  {
    name: 'settings',
    title: 'Settings',
    alt: 'The Settings page with the shared ~/.claude switch (Overall or Each account its own), the theme switch, five accent colours, terminal palettes such as Dracula, Nord and Tokyo Night, and the terminal font.',
  },
  {
    name: 'grid-light',
    title: 'Light theme',
    alt: 'The same four-pane grid in the light theme with the teal accent.',
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
    title: 'Workspaces, folders & icons',
    body: 'Switch workspaces with Ctrl+Shift+1…9. Drag accounts into sidebar folders, give accounts and workspaces an emoji icon, and right-click either to rename or delete it.',
  },
  {
    icon: 'status',
    title: 'Live pane status',
    body: 'Every pane shows whether claude is running (animated), idle, or waiting for your approval.',
  },
  {
    icon: 'shared',
    title: 'One claude setup everywhere',
    body: 'Every account uses the CLAUDE.md, settings, skills, plugins, agents and commands from your ~/.claude, or each keeps its own. Logins stay separate.',
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
    title: 'One-click updates',
    body: 'A desktop notification tells you once when a new version is out. Update & restart in Settings installs it in place.',
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
  { action: 'New line in claude', keys: ['Shift', 'Enter'] },
  { action: 'Terminal text bigger / smaller', keys: ['Ctrl', '= / -'] },
  { action: 'Reset terminal text size', keys: ['Ctrl', '0'] },
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
    a: 'Yes, from v1.3.0 on. When a new version is out you get a desktop notification, and Update & restart in Settings downloads it, checks it, installs it over the current one and relaunches. On Linux the .deb, .rpm and pacman packages ask for your password. Versions 1.2.0 and older must be updated by hand once.',
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
