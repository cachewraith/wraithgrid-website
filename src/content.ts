/** Page copy and data. Product facts come from the app's README and WHATS-NEW; don't invent others. */
import type { Platform, Release } from './lib/release'

export const SHOT_WIDTH = 1920
export const SHOT_HEIGHT = 1080

export type ShotName =
  | 'grid-dark'
  | 'grid-light'
  | 'chat'
  | 'slash'
  | 'usage'
  | 'diff'
  | 'palette'
  | 'new-pane'
  | 'accounts'
  | 'mods'
  | 'settings'

export interface Shot {
  name: ShotName
  title: string
  alt: string
}

export const HERO_ALT =
  'Wraithgrid with four panes in a 2×2 grid: two claude chats (one adding rate limiting to a login route, with tool cards and a code block; one that wrote tests), a Gemini CLI terminal and a claude terminal waiting for approval. Each has its own account, folder and git branch. The sidebar lists the projects and shows Usage at 42%.'

export const GALLERY: readonly Shot[] = [
  {
    name: 'chat',
    title: 'Chat',
    alt: 'One claude chat zoomed: the request, tool cards for reading a file, installing a package, editing and running the tests, and the answer with a code block. Under the message box: the model (Opus 5.5), effort and mode buttons.',
  },
  {
    name: 'slash',
    title: '/ commands',
    alt: 'Typing /te in a chat lists matching commands: /terminal, the superpowers test-driven-development skill, a frontend-design skill and /security-review, each with what it does.',
  },
  {
    name: 'usage',
    title: 'Usage',
    alt: 'The Usage screen: per account, the current session and weekly limits as bars with the percentage and reset time (one account at 91%, almost out), then cost over the last 7 days, a column chart of cost per day, and tables by project and by chat.',
  },
  {
    name: 'settings',
    title: 'Themes',
    alt: 'Settings → Appearance: the five built-in themes (Wraith, Midnight, Clay, Daylight, Paper) as live previews, Import theme, following the OS light or dark setting, interface size and accent.',
  },
  {
    name: 'diff',
    title: 'Changes',
    alt: 'The Changes panel open next to the grid, showing the git diff of the api-server chat: package.json and src/routes/auth.ts with added and removed lines, one untracked test file, and a commit message box with Commit all, Push and Pull request buttons.',
  },
  {
    name: 'mods',
    title: 'Mods',
    alt: 'The Mods screen: the mods the claude accounts have installed as one list, each with Update, Uninstall and an on/off switch, and below them a searchable catalog of the marketplace with install counts and an Install button per mod.',
  },
  {
    name: 'accounts',
    title: 'Accounts',
    alt: 'The Accounts page: five accounts running claude, gemini or agy, grouped into a Work folder, each with its config folder, login state and open panes. One claude account still needs to sign in and shows a Login button.',
  },
  {
    name: 'palette',
    title: 'Search',
    alt: 'The search palette (Ctrl+Shift+P) listing every pane of the work account across projects, with its folder, branch and status.',
  },
  {
    name: 'new-pane',
    title: 'New chat',
    alt: 'The New chat dialog: the account, the folder with recent folders, chat or terminal, and switches for a git worktree or a plain shell.',
  },
  {
    name: 'grid-light',
    title: 'Light theme',
    alt: 'The same four-pane grid in the Daylight theme.',
  },
]

export interface Feature {
  title: string
  body: string
}

export const FEATURES: readonly Feature[] = [
  {
    title: 'Chat or terminal',
    body: 'A claude pane can be a chat, like Claude or ChatGPT desktop: streamed answers, tool cards with diffs, inline approvals, attached files. The official CLI still does the work underneath. Flip any pane back to its terminal from the header.',
  },
  {
    title: 'Model, effort and mode',
    body: 'Pick the model and effort under the message box. Mode sets how much the agent may do on its own: ask before edits, accept edits, plan, auto or don’t ask. Shift+Tab steps through them, like in Claude Code.',
  },
  {
    title: 'Skills with /',
    body: 'Type / in a chat to list that account’s skills and commands, with what each does. Pick one with the arrow keys and Enter.',
  },
  {
    title: 'Continue as another account',
    body: 'Close to a limit? The account chip under the message box carries the chat on under another claude account, in place, with a divider marking the switch.',
  },
  {
    title: 'Usage and limits',
    body: 'The Usage screen shows each account’s current session and weekly limits as claude reports them, with when they reset, and what your chats cost per day, project and chat.',
  },
  {
    title: 'Themes, yours too',
    body: 'Five built-in themes (Wraith, Midnight, Clay, Daylight, Paper), or import your own: a theme is a small JSON file of colors you can share. Ctrl+= and Ctrl+- make the whole app bigger or smaller.',
  },
  {
    title: 'Seven agent CLIs',
    body: 'Each account picks the CLI its panes run: Claude Code, Codex, Gemini CLI, Antigravity, opencode, Cursor Agent or Copilot CLI. Mix them in one grid. Wraithgrid finds them on your PATH, or you set the path.',
  },
  {
    title: 'Logins stay separate',
    body: 'Every account gets its own config folder, so claude and gemini logins and history never touch another account. Codex, Cursor and Copilot may keep the sign-in in your keyring; agy and opencode share one.',
  },
  {
    title: 'Agents keep running',
    body: 'Close the window and pick Keep running: terminal agents carry on in the background, a tray icon shows how many, and the next launch shows every pane exactly as it is.',
  },
  {
    title: 'Drive panes from a script',
    body: 'Turn on Settings → Command line, then wraithgrid list, send, wait, read, new and split work from any terminal, or from an agent in another pane. wraithgrid attach watches one pane.',
  },
  {
    title: 'Run on another computer',
    body: 'Add a machine from your ~/.ssh/config and a project runs its panes there over ssh, with the remote’s own CLIs and logins.',
  },
  {
    title: 'Claude mods',
    body: 'Panes draw what claude mods draw: side panes, a band above the prompt, status lines, toasts. The Mods screen searches the marketplaces, installs, updates and uninstalls for every account, and manages marketplaces.',
  },
  {
    title: 'Git and worktrees',
    body: 'Press Ctrl+Shift+D for a pane’s diff, then commit, push, pull and open a pull request from the same panel. History shows every branch as a commit graph. Open a pane on a fresh branch in its own git worktree, and switch branches from its header.',
  },
  {
    title: 'Projects and layouts',
    body: 'New project picks a folder, an account and a machine in one step. Each project has a screen with its open chats and History, so a closed chat carries on where it stopped. One pane, two, 2×2 or three columns; drag to resize or swap. The layout adapts down to a 640 px window.',
  },
  {
    title: 'Know which pane needs you',
    body: 'Each pane shows working, needs you, done or idle, and the sidebar shows it per project. A desktop notification tells you when a pane you aren’t looking at finishes or asks.',
  },
  {
    title: 'Search and paste',
    body: 'Ctrl+Shift+P finds any pane in any project or runs an app command. Copy a screenshot and press Ctrl+V in a pane: it is saved and pasted as a path the CLI can read, on Wayland too.',
  },
  {
    title: 'Nothing leaves your machine',
    body: 'No telemetry. Wraithgrid never reads, copies or proxies what is inside the account folders; it only points each CLI at one. Usage numbers come from what the CLI already reports.',
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
  { action: 'New chat', keys: ['Ctrl', 'Shift', 'N'] },
  { action: 'Search panes and commands', keys: ['Ctrl', 'Shift', 'P'] },
  { action: 'Show changes (git diff)', keys: ['Ctrl', 'Shift', 'D'] },
  { action: 'Close pane', keys: ['Ctrl', 'Shift', 'W'] },
  { action: 'Zoom pane', keys: ['Ctrl', 'Shift', 'Z'] },
  { action: 'Move focus', keys: ['Ctrl', 'Alt', 'Arrow'] },
  { action: 'Switch project', keys: ['Ctrl', 'Shift', '1…9'] },
  { action: 'Paste a screenshot', keys: ['Ctrl', 'V'] },
  { action: 'New line in claude', keys: ['Shift', 'Enter'] },
  { action: 'Skills and commands in a chat', keys: ['/'] },
  { action: 'Next chat mode (ask, edits, plan, auto)', keys: ['Shift', 'Tab'] },
  { action: 'Zoom the whole app in / out', keys: ['Ctrl', '= / -'] },
  { action: 'Reset the zoom', keys: ['Ctrl', '0'] },
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
    a: 'No. For each pane it points the CLI at that account’s folder through the CLI’s own variable (CLAUDE_CONFIG_DIR, GEMINI_CLI_HOME, CODEX_HOME, CURSOR_CONFIG_DIR or COPILOT_HOME) and starts it. It never reads, copies or proxies anything inside those folders, except one conversation when you continue a chat as another account yourself.',
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
    q: 'Can I chat with claude instead of using its terminal?',
    a: 'Yes, since v1.11. New claude panes open as a chat: streamed answers, tool cards, inline approvals, a model, effort and mode picker, and / for skills. It runs the official claude CLI headless with your account, folder, CLAUDE.md, skills and mods. Any pane switches back to the terminal from its header. Other CLIs open as terminals for now.',
  },
  {
    q: 'Do I need a terminal to sign in?',
    a: 'Not for claude, since v1.12: Login on an account opens a dialog that runs claude’s own sign-in in that account’s folder. Open the sign-in page, paste the code if it shows one, done. Other CLIs still sign in from a terminal the first time a pane starts.',
  },
  {
    q: 'Can I carry on a chat on another account when I hit a limit?',
    a: 'Yes, since v1.13. The account chip under the message box → Continue as… copies that conversation into the other claude account and carries on there, in place. The original stays, and Usage counts each turn to the account that ran it.',
  },
  {
    q: 'Can I see how close I am to my Claude limits?',
    a: 'Yes, since v1.11. The Usage screen (in the sidebar, or /usage in a chat) shows each account’s current session and weekly limits and when they reset, as claude itself reports them after each chat turn, plus what chats cost per day, project and chat. Costs are at API prices; on Pro or Max you pay your plan. Terminal panes are not measured.',
  },
  {
    q: 'Can I make my own theme?',
    a: 'Yes, since v1.11. A theme is a JSON file with a name, dark or light, and at least three colors (background, text, accent); the rest is mixed from those. Import it in Settings → Appearance, or export a built-in one as a starting point. Only hex colors are accepted, so a shared theme can’t carry CSS or script.',
  },
  {
    q: 'Do my agents keep running when I close Wraithgrid?',
    a: 'Terminal panes can, since v1.10: close the window and pick Keep running, and a tray icon shows how many are still working. Chat panes stop on quit, and carry on the same conversation when Wraithgrid opens again.',
  },
  {
    q: 'Do my conversations survive a restart?',
    a: 'Yes. A chat pane resumes its conversation by its id. A terminal pane you sent a prompt to starts with its CLI’s continue option. Closed chats stay in their project’s History, and opening one from there carries on where it stopped.',
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
    a: 'On Windows and Linux, yes: Update & restart in Settings downloads the new version, installs it over the current one and relaunches. The .deb, .rpm and pacman packages ask for your password. On macOS it opens the release page. Settings → About keeps the release notes of each version. Versions 1.2.0 and older must be updated by hand once.',
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
