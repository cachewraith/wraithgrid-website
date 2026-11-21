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
  | 'scheduled'

export interface Shot {
  name: ShotName
  title: string
  alt: string
}

export const HERO_ALT =
  'Wraithgrid with four panes in a 2×2 grid: three claude chats (adding rate limiting to a login route, with tool cards and a code block; bumping a staging node pool with terraform; writing tests) and a Gemini CLI terminal. Each has its own account, folder and git branch. The sidebar shows the work account at 42% of its 5-hour limit and 58% of its week, and the main project’s chats as a tree.'

export const GALLERY: readonly Shot[] = [
  {
    name: 'chat',
    title: 'Chat',
    alt: 'One claude chat zoomed: the request, steps for reading a file, installing a package, editing and running the tests, and the answer with a code block. Under the message box: the account (work), the model (Opus 5.5), effort and mode buttons, attach and Send later.',
  },
  {
    name: 'slash',
    title: '/ commands',
    alt: 'Typing /re in a chat lists matching commands: the code-review and skill-creator skills, /security-review, frontend-design and the superpowers test-driven-development skill, each with what it does.',
  },
  {
    name: 'usage',
    title: 'Usage',
    alt: 'The Usage screen: per account, the current session and weekly limits as bars with the percentage and reset time (one account at 91%, almost out), how many panes each has open, and what Gemini and Antigravity accounts can’t report.',
  },
  {
    name: 'settings',
    title: 'Themes',
    alt: 'Settings → Appearance: Browse community, Customize and Import theme, the five built-in themes (Wraith, Midnight, Clay, Daylight, Paper) as live previews, following the OS light or dark setting, interface size, accent and terminal colors.',
  },
  {
    name: 'diff',
    title: 'Changes',
    alt: 'The Changes panel open next to the grid, showing the git diff of the api-server chat: package.json and src/routes/auth.ts with added and removed lines, one untracked test file, and a commit message box with Commit all, Pull, Push and Pull request buttons.',
  },
  {
    name: 'scheduled',
    title: 'Scheduled',
    alt: 'The Scheduled page: four jobs as cards, each with its project and account, the prompt, the schedule (weekdays 09:00, every 6 hours, when a limit resets, Fridays), the next run and the last result: done, waiting at a limit, or missed while one job is switched off.',
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
    alt: 'The New chat dialog: the account to use (claude, gemini and agy accounts with their plans), the project’s folder with its git branch and recent folders, More options, and Start chat.',
  },
  {
    name: 'grid-light',
    title: 'Light theme',
    alt: 'The same four-pane grid in the Daylight theme.',
  },
]

export type FeatureGroupId = 'chat' | 'limits' | 'parallel' | 'ship' | 'private'

export interface FeatureGroup {
  id: FeatureGroupId
  title: string
  blurb: string
}

/** The Features section shows FEATURES in these groups, in this order. */
export const FEATURE_GROUPS: readonly FeatureGroup[] = [
  {
    id: 'chat',
    title: 'Chat with any agent',
    blurb: 'A real chat on top of the official CLIs, or their own terminal.',
  },
  {
    id: 'limits',
    title: 'Stay ahead of limits',
    blurb: 'See every account’s limits, and keep working when one runs out.',
  },
  {
    id: 'parallel',
    title: 'Work in parallel',
    blurb: 'Many agents, many projects, one window that tells you which needs you.',
  },
  {
    id: 'ship',
    title: 'Review and ship',
    blurb: 'Diffs, commits, previews and remote machines next to the chat.',
  },
  {
    id: 'private',
    title: 'Private and yours',
    blurb: 'Separate logins, no telemetry, and a look you choose.',
  },
]

export interface Feature {
  title: string
  body: string
  group: FeatureGroupId
}

export const FEATURES: readonly Feature[] = [
  {
    title: 'A chat for every agent',
    body: 'Claude Code, Codex and Antigravity open as a chat, like Claude or ChatGPT desktop: answers that blur in word by word, steps with diffs, inline approvals, Claude’s questions as options to pick, attached files. While it thinks, the chat’s own logo pops and turns. The official CLI still does the work underneath; other CLIs open as terminals.',
    group: 'chat',
  },
  {
    title: 'Model, effort and mode',
    body: 'Pick the model and effort under the message box. Mode sets how much the agent may do on its own: ask before edits, accept edits, plan, auto or don’t ask. Shift+Tab steps through them, like in Claude Code.',
    group: 'chat',
  },
  {
    title: 'Reply to any part',
    body: 'Select text in a chat message and click Reply: it goes above the message box as a quote, and the sent message shows each quote as its own card with Show in chat. Type @ to pick a project file or folder, and ↑ brings back the prompts you sent.',
    group: 'chat',
  },
  {
    title: 'Skills with /',
    body: 'Type / in a chat to list that account’s skills and commands, with what each does. Pick one with the arrow keys and Enter.',
    group: 'chat',
  },
  {
    title: 'Never stuck at a limit',
    body: 'When a Claude or Codex chat’s account reaches its limit, it offers your next account of the same CLI, with both accounts’ use and what carries over, then goes on there with the whole conversation. Or let it switch on its own, or pick one yourself under the message box, even another CLI.',
    group: 'limits',
  },
  {
    title: 'Usage and limits',
    body: 'Each Claude account’s 5-hour and weekly use updates on its own every 2 minutes, including use from claude.ai or another computer (not on macOS yet). The Usage screen shows every account’s limits, when they reset, and what your chats cost per day, project and chat.',
    group: 'limits',
  },
  {
    title: 'Scheduled chats',
    body: 'Start chats on a schedule: once, daily, on chosen days, every few hours, or the moment an account’s limit resets. The Scheduled page shows each job as a card with its next and last run. Send later queues a message for when your limit resets.',
    group: 'limits',
  },
  {
    title: 'A team per project',
    body: 'Save a team of agents on a project, any providers, each with a role, a model, a first message and its own branch folder, and start them all with one click, laid out side by side.',
    group: 'parallel',
  },
  {
    title: 'See what it built',
    body: 'Preview runs the project’s dev server and shows the site in a pane beside the chat. Attach to chat sends a screenshot of the page, its console errors and failed requests, so the agent sees them.',
    group: 'ship',
  },
  {
    title: 'Themes, yours too',
    body: 'Five built-in themes (Wraith, Midnight, Clay, Daylight, Paper) that differ in shape and depth too. Customize… edits any of them live over the whole app, and Browse community… installs themes others share on GitHub. Ctrl+= and Ctrl+- make the whole app bigger or smaller.',
    group: 'private',
  },
  {
    title: 'Seven agent CLIs',
    body: 'Each account picks the CLI its panes run: Claude Code, Codex, Gemini CLI, Antigravity, opencode, Cursor Agent or Copilot CLI. Mix them in one grid. Wraithgrid finds them on your PATH, or you set the path.',
    group: 'chat',
  },
  {
    title: 'Logins stay separate',
    body: 'Every account gets its own config folder, so claude and gemini logins and history never touch another account. The Accounts page groups them in folders, and Add account signs in or reuses the login already in ~/.claude or ~/.codex. Instructions and skills can still be one per provider.',
    group: 'private',
  },
  {
    title: 'Agents keep running',
    body: 'Close the window and pick Keep running: terminal agents carry on in a background host written in Rust (about 5 MB of memory while idle), a tray icon shows how many, and the next launch shows every pane exactly as it is.',
    group: 'parallel',
  },
  {
    title: 'Drive panes from a script',
    body: 'Turn on Settings → Command line, then wraithgrid list, send, wait, read, new and split work from any terminal, or from an agent in another pane. wraithgrid attach watches one pane.',
    group: 'ship',
  },
  {
    title: 'Run on another computer',
    body: 'Add a machine from your ~/.ssh/config and a project runs its panes there over ssh, with the remote’s own CLIs and logins. A Linux machine needs nothing installed: Wraithgrid copies its small host there once per version.',
    group: 'ship',
  },
  {
    title: 'Claude mods',
    body: 'Panes draw what claude mods draw: side panes, a band above the prompt, status lines, toasts. The Mods screen searches the marketplaces, installs, updates and uninstalls for every account, and manages marketplaces.',
    group: 'chat',
  },
  {
    title: 'A branch per pane',
    body: 'The top bar shows the focused pane’s branch and changed files; click it to commit, pull, push, switch branch, or start a new pane on a branch of its own, in its own git worktree. Ctrl+Shift+D opens the diff, with a pull request button. History shows every branch as a commit graph.',
    group: 'ship',
  },
  {
    title: 'Projects and layouts',
    body: 'New project picks a folder, an account and a machine in one step. Each project has a screen with its open chats and History, so a closed chat carries on where it stopped. One pane, two, 2×2 or three columns; drag to resize or swap. The layout adapts down to a 640 px window.',
    group: 'parallel',
  },
  {
    title: 'Know which pane needs you',
    body: 'Each pane shows working, needs you, done or idle, and the sidebar shows it per project. A desktop notification tells you when a pane you aren’t looking at finishes or asks.',
    group: 'parallel',
  },
  {
    title: 'Search and paste',
    body: 'Ctrl+Shift+P finds any pane in any project or runs an app command. Copy a screenshot and press Ctrl+V in a pane: it is saved and pasted as a path the CLI can read, on Wayland too.',
    group: 'parallel',
  },
  {
    title: 'Your code stays yours',
    body: 'No telemetry. Your free Wraithgrid account only signs you in; it never sees your agent logins, code or chats. Wraithgrid never reads, copies or proxies what is inside the account folders; it only points each CLI at one.',
    group: 'private',
  },
]

export interface Spotlight {
  shot: ShotName
  eyebrow: string
  title: string
  body: string
  points: readonly string[]
}

/** The four screens the landing page explains in depth, each beside its screenshot. */
export const SPOTLIGHTS: readonly Spotlight[] = [
  {
    shot: 'chat',
    eyebrow: 'Chat',
    title: 'A proper chat, with the official CLI underneath',
    body: 'Claude Code, Codex and Antigravity open as a chat, like Claude or ChatGPT desktop. The official CLI still does the work, headless, with your account and folder.',
    points: [
      'Answers stream in word by word, with each step and its diff',
      'Approve tools inline, and answer Claude’s questions one tab at a time',
      'Model, effort and mode under the message box; Shift+Tab steps through modes',
      'Type / for skills and commands, @ for files, or Reply to part of an answer',
    ],
  },
  {
    shot: 'usage',
    eyebrow: 'Limits',
    title: 'Hit a limit, and the chat moves on',
    body: 'When a Claude or Codex account reaches its limit, the chat carries on as your next account of the same CLI, with the whole conversation.',
    points: [
      'Asks first, with both accounts’ use; or set it to switch on its own, or off',
      'Each Claude account’s 5-hour and weekly use updates live, every 2 minutes',
      'The Usage screen shows every account’s limits and when they reset',
      'Costs per day, project and chat, at API prices',
    ],
  },
  {
    shot: 'scheduled',
    eyebrow: 'Scheduled',
    title: 'Agents that start while you’re away',
    body: 'Start chats once, daily, on chosen days, every few hours, or the moment an account’s limit resets. Each job is a card with its next and last run.',
    points: [
      'Send later queues one message for when your limit resets',
      'Runs missed by over an hour are recorded, not run late',
      'With jobs on, closing the window keeps the tray icon so they still run',
    ],
  },
  {
    shot: 'diff',
    eyebrow: 'Changes',
    title: 'Review every change before it lands',
    body: 'Press Ctrl+Shift+D for a pane’s git diff, then commit, push, pull and open a pull request from the same panel.',
    points: [
      'The top bar shows the focused pane’s branch and how many files changed',
      'Run tasks side by side, each pane on its own branch in its own worktree',
      'History shows every branch as a commit graph',
    ],
  },
]

export interface Step {
  title: string
  body: string
}

/** Getting started in three steps; the docs' Getting started page has the details. */
export const STEPS: readonly Step[] = [
  {
    title: 'Add your accounts',
    body: 'Sign in to Wraithgrid once, then add your agent accounts: one login of one CLI each, in its own folder under ~/.wraithgrid/accounts. Add account can reuse the login already in ~/.claude or ~/.codex.',
  },
  {
    title: 'Open a project',
    body: 'Pick a folder, the account its chats use and the machine it runs on: this computer, or one from your ~/.ssh/config.',
  },
  {
    title: 'Run them side by side',
    body: 'One pane, two, 2×2 or three columns. Each pane has its own account, folder and git branch, and shows when it needs you.',
  },
]

/** The agent CLIs Wraithgrid runs, as named in the app. */
export const AGENT_CLIS: readonly string[] = [
  'Claude Code',
  'Codex',
  'Gemini CLI',
  'Antigravity',
  'opencode',
  'Cursor Agent',
  'Copilot CLI',
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
  { action: 'Reply to the selected text', keys: ['Ctrl', 'Shift', 'R'] },
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
    a: 'No. It is an independent project, not affiliated with Anthropic, Google, OpenAI, GitHub or Cursor. It runs the official agent CLIs unchanged.',
  },
  {
    q: 'Do I need a Wraithgrid account?',
    a: 'Yes, since v2.4.0, and it is free: sign in or create one the first time you open the app (email and password with a 6-digit code, or Google or GitHub when offered). After that Wraithgrid opens as before, even offline. The account only signs you in; your Claude, Codex and other agent accounts stay separate, on your computer.',
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
    q: 'Can I chat with an agent instead of using its terminal?',
    a: 'Yes. Claude Code, Codex and Antigravity (agy) always open as a chat: streamed answers, steps, inline approvals and a model, effort and mode picker. It runs the official CLI headless with your account and folder. agy can’t ask before a tool in a chat, so it says what it skipped and how to allow it. Gemini CLI, opencode, Cursor and Copilot open as terminals, as do plain shells and panes on another machine.',
  },
  {
    q: 'Do I need a terminal to sign in?',
    a: 'Not for claude (since v1.12) or codex (since v1.15): Login on an account opens a dialog that runs the CLI’s own sign-in in that account’s folder. For claude, open the sign-in page and paste the code if it shows one; for codex, enter the one-time code on the page. Other CLIs still sign in from a terminal the first time a pane starts.',
  },
  {
    q: 'Can I carry on a chat on another account when I hit a limit?',
    a: 'Yes. When a Claude or Codex chat reaches its account’s limit, it asks before carrying on as your next account of the same CLI (since v1.25), showing both accounts’ use and what carries over; Settings → Switch account at limit sets Ask first, Automatically or Off. The account button under the message box → Continue as… does it by hand, to another CLI too.',
  },
  {
    q: 'Can I see how close I am to my Claude limits?',
    a: 'Yes. The Usage screen (in the sidebar, or /usage in a chat) shows each account’s current session and weekly limits and when they reset, plus what chats cost per day, project and chat. Since v1.25 they update on their own every 2 minutes, including use from claude.ai or another computer (not on macOS yet). Costs are at API prices; on Pro or Max you pay your plan.',
  },
  {
    q: 'Can agents work while I’m away?',
    a: 'Yes, since v1.21. The Scheduled page starts chats once, daily, on chosen days, every few hours, or when an account’s limit resets, and Send later queues one message in a chat. Runs missed by over an hour are recorded, not run late. With jobs on, closing the window keeps the tray icon so they still run.',
  },
  {
    q: 'Can I make my own theme?',
    a: 'Yes. Since v1.15, Settings → Appearance → Customize… edits any theme live over the whole app (colors, fonts, corners, depth, density, motion), flags hard-to-read text with a one-click fix, and saves it as a new theme. A theme is a JSON file with a name, dark or light, and at least three colors; only hex colors and fixed style options are accepted, so a shared theme can’t carry CSS or script. Share yours on the community gallery from the theme template.',
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
    a: 'On Windows and Linux, yes: Settings → About downloads the new version, checks it and restarts into it, showing each step. The .deb, .rpm and pacman packages ask for your password. On macOS it opens the release page. About also lists every version’s release notes. Versions 1.2.0 and older must be updated by hand once.',
  },
  {
    q: 'Is it free?',
    a: 'Yes. Wraithgrid is free to download and use, and open source under the MIT license: the source code is at github.com/cachewraith/wraithgrid-app. Download the app from the releases at github.com/cachewraith/wraithgrid, which only has published versions.',
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
