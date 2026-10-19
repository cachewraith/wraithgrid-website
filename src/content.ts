/** Page copy and data. Product facts come from the app's README and WHATS-NEW; don't invent others. */
import type { Platform, Release } from './lib/release'

export const SHOT_WIDTH = 1920
export const SHOT_HEIGHT = 1080

export type ShotName =
  'grid-dark' | 'grid-light' | 'diff' | 'palette' | 'new-pane' | 'accounts' | 'mods' | 'settings'

export interface Shot {
  name: ShotName
  title: string
  alt: string
}

export const HERO_ALT =
  'Wraithgrid with four panes in a 2×2 grid: three claude panes and one Gemini CLI pane, each with its own account, project folder and git branch. One is running, one needs approval, two are idle. The sidebar lists the panes of the main workspace and the accounts, two of them in a Work folder.'

export const GALLERY: readonly Shot[] = [
  {
    name: 'mods',
    title: 'Mods',
    alt: 'The Mods screen: the mods the claude accounts have installed as one list, each with Add to all accounts, Update, Uninstall and an on/off switch, and below them a searchable catalog of the marketplace with install counts and an Install button per mod.',
  },
  {
    name: 'diff',
    title: 'Changes',
    alt: 'The Changes panel open next to the grid, showing the git diff of the api-server pane: package.json and src/routes/auth.ts with added and removed lines, one untracked test file, and below them a commit message box with Commit all, Push and Pull request buttons.',
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
    title: 'Seven agent CLIs',
    body: 'Each account picks the CLI its panes run: Claude Code, Codex, Gemini CLI, Antigravity, opencode, Cursor Agent or Copilot CLI. Mix them in one grid. Wraithgrid finds them on your PATH, or you set the path.',
  },
  {
    title: 'Logins stay separate',
    body: 'Every account gets its own config folder, so claude and gemini logins and history never touch another account. Codex, Cursor and Copilot may keep the sign-in in your keyring; agy and opencode share one.',
  },
  {
    title: 'Claude mods',
    body: 'Panes draw what claude mods draw: side panes, a band above the prompt, status lines, toasts. The Mods screen searches the marketplaces, installs, updates and uninstalls for every account, and manages marketplaces.',
  },
  {
    title: 'Git and worktrees',
    body: 'Press Ctrl+Shift+D for a pane’s diff, then commit, push and open a pull request from the same panel. Open a pane on a fresh branch in its own git worktree, and remove it when its last pane closes.',
  },
  {
    title: 'Paste screenshots',
    body: 'Copy an image and press Ctrl+V in a pane. It is saved to a temp file and pasted as a path the CLI can read. Works on Wayland too.',
  },
  {
    title: 'Know which pane needs you',
    body: 'Each pane shows running, needs approval, done or idle. A desktop notification tells you when a pane you aren’t looking at finishes or asks.',
  },
  {
    title: 'Search everything',
    body: 'Ctrl+Shift+P finds any pane in any workspace, switches workspace, opens an account in a new pane or runs an app command. Rebind the app shortcuts in Settings.',
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
    title: 'Pick up where you left off',
    body: 'When Wraithgrid restarts, each pane you prompted continues its last conversation (claude --continue, codex resume --last). Updates install from Settings with Update & restart.',
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
    a: 'No. It is an independent open-source project, not affiliated with Anthropic, Google, OpenAI, GitHub or Cursor. It runs the official agent CLIs unchanged.',
  },
  {
    q: 'Does it see my login or my code?',
    a: 'No. For each pane it points the CLI at that account’s folder through the CLI’s own variable (CLAUDE_CONFIG_DIR, GEMINI_CLI_HOME, CODEX_HOME, CURSOR_CONFIG_DIR or COPILOT_HOME) and starts it. It never reads, copies or proxies anything inside those folders.',
  },
  {
    q: 'Does every CLI keep a separate login per account?',
    a: 'Claude and Gemini accounts do. Antigravity and opencode have no per-account folder, so their accounts share one login on a computer. Codex, Cursor and Copilot keep settings and history per account, but may keep the sign-in in the system keyring, and then their accounts share it too.',
  },
  {
    q: 'Does it work with claude mods?',
    a: 'Yes, since v1.7. Mods run inside each claude pane, and the Mods screen lists what every account has installed, lets you search, install, update and uninstall for every account, manages marketplaces, and loads a mod folder you are building into every pane. Wraithgrid asks the account’s own claude for all of it. Pictures a mod draws show as their text description.',
  },
  {
    q: 'Do my conversations survive a restart?',
    a: 'Yes, since v1.9. A pane you sent a prompt to starts with its CLI’s continue option when Wraithgrid opens again, so the conversation goes on. Turn it off per pane by right-clicking its header. Running agents still stop when Wraithgrid quits.',
  },
  {
    q: 'Can I change the keyboard shortcuts?',
    a: 'Yes, since v1.9: Settings → Keyboard shortcuts rebinds search, new pane, close pane, zoom, the git diff and the shortcuts sheet. A new shortcut needs Ctrl (⌘ on macOS) with Shift or Alt, so the terminal keeps its own keys.',
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

/** scripts/install.sh in the app repo (since v1.9): picks the package, checks SHA256SUMS. */
export const INSTALL_SCRIPT =
  'curl -fsSL https://raw.githubusercontent.com/cachewraith/wraithgrid/main/scripts/install.sh | sh'
