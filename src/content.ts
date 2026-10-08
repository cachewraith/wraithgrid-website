/** Page copy and data. Product facts come from the app's README and WHATS-NEW; don't invent others. */
import type { Platform, Release } from './lib/release'

export const SHOT_WIDTH = 1920
export const SHOT_HEIGHT = 1080

export type ShotName =
  'grid-dark' | 'grid-light' | 'diff' | 'palette' | 'new-pane' | 'accounts' | 'settings'

export interface Shot {
  name: ShotName
  title: string
  alt: string
}

export const HERO_ALT =
  'Wraithgrid with four panes in a 2×2 grid: three claude panes and one Gemini CLI pane, each with its own account, project folder and git branch. One is running, one needs approval, two are idle. The sidebar lists the panes of the main workspace and the accounts, two of them in a Work folder.'

export const GALLERY: readonly Shot[] = [
  {
    name: 'diff',
    title: 'Changes',
    alt: 'The Changes panel open next to the grid, showing the git diff of the api-server pane: package.json and src/routes/auth.ts with added and removed lines, and one untracked test file.',
  },
  {
    name: 'palette',
    title: 'Search',
    alt: 'The search palette (Ctrl+Shift+P) listing every pane of the work account across workspaces, with its folder, branch and status.',
  },
  {
    name: 'new-pane',
    title: 'New pane',
    alt: 'The New pane dialog: a list of accounts showing which CLI each runs (claude, gemini, agy), the working directory with recent folders, launch args, and switches for a git worktree or a plain shell.',
  },
  {
    name: 'accounts',
    title: 'Accounts',
    alt: 'The Accounts list: five accounts running claude, gemini or agy, each with its config folder, login state and open panes. One claude account still needs to sign in and shows a Login button.',
  },
  {
    name: 'settings',
    title: 'Settings',
    alt: 'Settings → Appearance: theme, five accent colours, terminal palettes (Dracula, Nord, Tokyo Night, Gruvbox, Solarized) and the terminal font with a live preview.',
  },
  {
    name: 'grid-light',
    title: 'Light theme',
    alt: 'The same four-pane grid in the light theme.',
  },
]

export interface Feature {
  title: string
  body: string
}

export const FEATURES: readonly Feature[] = [
  {
    title: 'Claude, Gemini and Antigravity',
    body: 'Each account picks the CLI its panes run: Claude Code, Gemini CLI or Antigravity CLI (agy). Mix all three in one grid. Wraithgrid finds them on your PATH.',
  },
  {
    title: 'Logins stay separate',
    body: 'Every claude and gemini account gets its own config folder, so its login and history never touch another account. agy keeps one sign-in in your system keyring.',
  },
  {
    title: 'Git in every pane',
    body: 'The pane header shows the branch and how many files changed. Click it, or press Ctrl+Shift+D, for the diff in a Changes panel you can drag wider.',
  },
  {
    title: 'Worktrees',
    body: 'Open a new pane on a fresh branch in its own git worktree, so two agents can work on one repo without editing the same files.',
  },
  {
    title: 'Paste screenshots',
    body: 'Copy an image and press Ctrl+V in a pane. It is saved to a temp file and pasted as a path the CLI can read. Works on Wayland too.',
  },
  {
    title: 'Know which pane needs you',
    body: 'Each pane shows running, idle or needs approval. A desktop notification tells you when a pane you aren’t looking at finishes or asks.',
  },
  {
    title: 'Search everything',
    body: 'Ctrl+Shift+P finds any pane in any workspace, switches workspace, opens an account in a new pane or runs an app command.',
  },
  {
    title: 'Workspaces and layouts',
    body: 'One pane, two, 2×2 or three columns. Drag to resize or swap. Group accounts into sidebar folders and give anything an icon from Material Symbols, Lucide or emoji.',
  },
  {
    title: 'One claude setup',
    body: 'Every claude account can share the CLAUDE.md, settings, skills, plugins, agents and commands from your ~/.claude, or keep its own.',
  },
  {
    title: 'Your shell, your theme',
    body: 'Plain shell panes run bash, zsh, fish, nushell, PowerShell, Git Bash, WSL or anything you name. Dark or light, five accents, six terminal palettes.',
  },
  {
    title: 'Updates in place',
    body: 'You get one notification per new version. Update & restart in Settings installs it and relaunches (on macOS it opens the release page).',
  },
  {
    title: 'Nothing leaves your machine',
    body: 'No telemetry. Wraithgrid never reads, copies or proxies what is inside the account folders; it only points each CLI at one.',
  },
]

export interface PaneExample {
  pane: string
  account: string
  env: string
  cli: string
}

/** The "Will run" line of the New pane dialog, for the panes in the hero screenshot. */
export const HOW_EXAMPLES: readonly PaneExample[] = [
  {
    pane: 'api-server',
    account: 'work',
    env: 'CLAUDE_CONFIG_DIR=~/.wraithgrid/accounts/work',
    cli: 'claude',
  },
  {
    pane: 'infra',
    account: 'client-acme',
    env: 'CLAUDE_CONFIG_DIR=~/.wraithgrid/accounts/client-acme',
    cli: 'claude',
  },
  {
    pane: 'web-app',
    account: 'personal',
    env: 'GEMINI_CLI_HOME=~/.wraithgrid/accounts/personal',
    cli: 'gemini',
  },
]

export const SHORTCUTS: readonly { action: string; keys: readonly string[] }[] = [
  { action: 'New pane', keys: ['Ctrl', 'Shift', 'N'] },
  { action: 'Search panes and commands', keys: ['Ctrl', 'Shift', 'P'] },
  { action: 'Show changes (git diff)', keys: ['Ctrl', 'Shift', 'D'] },
  { action: 'Close pane', keys: ['Ctrl', 'Shift', 'W'] },
  { action: 'Zoom pane', keys: ['Ctrl', 'Shift', 'Z'] },
  { action: 'Move focus', keys: ['Ctrl', 'Alt', 'Arrow'] },
  { action: 'Switch workspace', keys: ['Ctrl', 'Shift', '1…9'] },
  { action: 'Paste a screenshot', keys: ['Ctrl', 'V'] },
  { action: 'New line in claude', keys: ['Shift', 'Enter'] },
  { action: 'Terminal text bigger / smaller', keys: ['Ctrl', '= / -'] },
  { action: 'All shortcuts', keys: ['Ctrl', 'Shift', '/'] },
]

export interface Faq {
  q: string
  a: string
}

export const FAQS: readonly Faq[] = [
  {
    q: 'Is Wraithgrid official?',
    a: 'No. It is an independent open-source project, not affiliated with Anthropic or Google. It runs the official claude, gemini and agy CLIs unchanged.',
  },
  {
    q: 'Does it see my login or my code?',
    a: 'No. For each pane it sets CLAUDE_CONFIG_DIR (claude) or GEMINI_CLI_HOME (gemini) to that account’s folder and starts the CLI. It never reads, copies or proxies anything inside those folders.',
  },
  {
    q: 'Can two Antigravity accounts use different Google logins?',
    a: 'Not on one computer. agy keeps its sign-in in the system keyring, so every Antigravity account shares it. That is a limit of agy itself. Claude and Gemini accounts each keep their own login.',
  },
  {
    q: 'Does it run on macOS?',
    a: 'Yes, since v1.4, on Apple silicon and Intel. The app is not notarized yet, so the first launch needs right-click → Open. App shortcuts use ⌘ instead of Ctrl.',
  },
  {
    q: 'Does it update itself?',
    a: 'On Windows and Linux, yes: Update & restart in Settings downloads the new version, installs it over the current one and relaunches. The .deb, .rpm and pacman packages ask for your password. On macOS it opens the release page. Versions 1.2.0 and older must be updated by hand once.',
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
    id: 'macArm',
    label: 'macOS',
    filePattern: 'Wraithgrid-*-mac-arm64.dmg',
    command: null,
    requirement: 'macOS on Apple silicon (M1 or newer).',
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
