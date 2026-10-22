/**
 * The docs pages. Facts come from the app (README, docs/WHATS-NEW.md, docs/THEMES.md, v1.14);
 * don't add any the app doesn't have. Inline text: `code`, **bold**, [label](/path), ⟦key⟧.
 */
import type { DocPage } from '../lib/docs'
import { THEME_EXAMPLE } from '../lib/app-themes'

export const DOCS: readonly DocPage[] = [
  {
    slug: '',
    nav: 'Getting started',
    title: 'Getting started with Wraithgrid',
    description:
      'Install Wraithgrid, add an account, open a project and start your first chat with Claude Code, Codex, Gemini CLI or another agent CLI.',
    sections: [
      {
        id: 'install',
        title: 'Install',
        blocks: [
          {
            p: 'Download the installer for Windows, macOS or Linux from the [Install section](/install). On Linux you can also run the one-line installer, which picks the right package and checks its checksum:',
          },
          {
            code: 'curl -fsSL https://raw.githubusercontent.com/cachewraith/wraithgrid/main/scripts/install.sh | sh',
            label: 'Linux',
          },
          {
            p: 'Wraithgrid runs the official agent CLIs, so install at least one of them first: Claude Code (`claude`), Codex, Gemini CLI, Antigravity (`agy`), opencode, Cursor Agent or Copilot CLI. It finds them on your PATH, or you set a path in **Settings → Agents & CLIs**.',
          },
          {
            note: 'The macOS app is not notarized yet: the first launch needs right-click → Open.',
          },
        ],
      },
      {
        id: 'account',
        title: 'Add an account',
        blocks: [
          {
            p: 'An account is one login of one CLI, with its own config folder under `~/.wraithgrid/accounts`. Personal, work and client accounts can all be signed in at once.',
          },
          {
            steps: [
              'Click the account button at the bottom of the sidebar, then **New account**.',
              'Pick a name and the **CLI** it runs. To keep a login you already have, use **Import ~/.claude** instead: nothing is copied.',
              'Press **Login**. For claude a dialog runs its own sign-in: open the sign-in page, paste the code if it shows one. Other CLIs sign in from a terminal the first time a pane starts.',
            ],
          },
          {
            p: 'The account you pick in that menu is the one new chats use. **Manage accounts** opens the Accounts page, where you can also group accounts into folders.',
          },
        ],
      },
      {
        id: 'project',
        title: 'Open a project and a chat',
        blocks: [
          {
            steps: [
              'In the sidebar, **+** next to **Projects** opens **New project**: pick the folder (it fills in the name), the account its chats use and the machine it runs on.',
              'Press **New chat** (⟦Ctrl⟧ ⟦Shift⟧ ⟦N⟧): the project’s account and folder are picked already, so ⟦Enter⟧ starts it. **More options** has **Work on a new branch**, which gives the chat its own git worktree.',
              'Type your request and press ⟦Enter⟧.',
            ],
          },
          {
            p: 'New claude panes open as a chat; other CLIs open as terminals. Click a project in the sidebar for its screen: open chats, and the History of closed ones, with search.',
          },
        ],
      },
      {
        id: 'next',
        title: 'Next',
        blocks: [
          {
            list: [
              '[The chat view](/docs/chat): model, effort, modes, approvals and / commands.',
              '[Themes](/docs/themes): the five built-in themes, and how to make your own.',
              '[Usage](/docs/usage): your plan limits and what chats cost.',
              '[Accounts and mods](/docs/accounts): separate logins, a shared claude setup, mods.',
              '[Terminals, scripts and machines](/docs/terminal): keep agents running, the `wraithgrid` command, ssh.',
              '[Keyboard shortcuts](/docs/shortcuts).',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'chat',
    nav: 'The chat view',
    title: 'The chat view',
    description:
      'Chat with Claude Code in Wraithgrid: streamed answers, tool cards and approvals, model, effort and permission modes (plan, accept edits, auto), / commands for skills, and history.',
    sections: [
      {
        id: 'how',
        title: 'How it works',
        blocks: [
          {
            p: 'A chat pane runs the official `claude` CLI headless, with the pane’s account, folder, CLAUDE.md, skills and mods. Answers stream in as formatted text with code blocks you can copy. Commands, file edits (as a diff), searches and task lists show as small cards that open to show their output.',
          },
          {
            list: [
              'Paste a screenshot with ⟦Ctrl⟧ ⟦V⟧, or attach files with the paperclip or by dropping them (up to 20): images go as images, other files as paths claude reads.',
              'Close to a limit? The account chip under the message box → **Continue as…** carries the chat on under another claude account.',
              'Stop a turn with **Stop** or ⟦Esc⟧. A message sent while one runs waits its turn.',
              'Start over with the new-conversation button in the pane header, or `/new`.',
              'The Chat / Terminal switch in the header shows the CLI’s own screen, for signing in, `/config` and other interactive commands.',
            ],
          },
          {
            note: 'Chat is for Claude Code for now; other CLIs open as terminals. Chat agents stop when Wraithgrid quits and carry on the same conversation when it opens again.',
          },
        ],
      },
      {
        id: 'approvals',
        title: 'Approvals',
        blocks: [
          {
            p: 'When claude wants to run something that needs your OK, a card appears above the message box with what it will run: **Allow**, **Always allow** (saves the rule the CLI suggests) or **Deny**. The pane header and the sidebar show **needs you** until you answer.',
          },
        ],
      },
      {
        id: 'controls',
        title: 'Model, effort and mode',
        blocks: [
          {
            p: 'Three buttons sit under the message box. The lists come from the CLI itself, so each account shows the models it has.',
          },
          {
            table: {
              head: ['Button', 'What it does'],
              rows: [
                ['Model', 'Switches the model right away, mid-conversation.'],
                [
                  'Effort',
                  'How long the model thinks: Auto, Low, Medium, High, Extra high, Max. Changing it restarts the chat quietly; it carries on.',
                ],
                [
                  'Mode',
                  'How much claude may do without asking. Switches at once, and ⟦Shift⟧ ⟦Tab⟧ steps through the first ones.',
                ],
              ],
            },
          },
          {
            table: {
              head: ['Mode', 'Means'],
              rows: [
                [
                  'Ask before edits',
                  'Asks before it edits files or runs commands (claude’s normal mode).',
                ],
                ['Accept edits', 'Edits files on its own; still asks before commands.'],
                ['Plan', 'Reads and plans only; changes nothing.'],
                [
                  'Auto',
                  'Decides on its own what is safe to run. Shown only for models that support it.',
                ],
                ['Don’t ask', 'Refuses anything that is not already allowed.'],
                [
                  'Bypass permissions',
                  'Runs everything without asking. Takes a second click, and is never a default.',
                ],
              ],
            },
          },
          {
            p: 'When the mode is not the normal one, the pane header says so. **Settings → Chat** sets the model, effort and mode for new chats.',
          },
        ],
      },
      {
        id: 'slash',
        title: '/ commands and skills',
        blocks: [
          {
            p: 'Type `/` at the start of a message to list what this chat can run: Wraithgrid’s own commands first, then the account’s skills and commands (with the plugin they come from), claude’s built-in commands, and the ones that only work in its terminal. Keep typing to narrow the list; ⟦↑⟧ ⟦↓⟧ move, ⟦Enter⟧ or ⟦Tab⟧ picks, ⟦Esc⟧ closes.',
          },
          {
            table: {
              head: ['Command', 'Does'],
              rows: [
                ['`/new`', 'Starts a new conversation in this chat (also `/clear`).'],
                ['`/model`, `/effort`, `/mode`', 'Open those menus.'],
                ['`/usage`', 'Opens the Usage screen.'],
                ['`/terminal`', 'Shows the CLI’s own terminal screen.'],
              ],
            },
          },
          {
            p: 'Picking a skill puts `/name ` in the box so you can add what it should work on. A terminal-only command switches the pane to its terminal and types the command there, waiting for your ⟦Enter⟧.',
          },
        ],
      },
      {
        id: 'history',
        title: 'Projects and history',
        blocks: [
          {
            p: 'Each project has a screen: click it in the sidebar. **Open** lists its chats with what they are doing; **History** keeps chats you closed (the last 100), with search. Clicking one carries on the conversation where it stopped; the trash button deletes it after asking. A chat is named after its first message until you rename it.',
          },
        ],
      },
    ],
  },
  {
    slug: 'themes',
    nav: 'Themes',
    title: 'Themes',
    description:
      'Wraithgrid’s five built-in themes (Wraith, Midnight, Clay, Daylight, Paper), following the OS light or dark setting, interface zoom, and how to make, import and share your own theme file.',
    sections: [
      {
        id: 'built-in',
        title: 'Built-in themes',
        blocks: [
          { themes: true },
          {
            p: 'Pick one in **Settings → Appearance**: each card is a live preview in that theme’s colors. Terminals follow the theme too when **Terminal colors** is **Match app**.',
          },
        ],
      },
      {
        id: 'follow',
        title: 'Follow the OS',
        blocks: [
          {
            p: 'Turn on **Follow the OS light or dark setting** and Wraithgrid keeps one dark and one light pick: clicking a dark card sets the dark one, a light card the light one. The accent row can lay one of five colors over any theme; **Theme** keeps the theme’s own.',
          },
        ],
      },
      {
        id: 'size',
        title: 'Interface size',
        blocks: [
          {
            p: '⟦Ctrl⟧ ⟦=⟧ and ⟦Ctrl⟧ ⟦-⟧ make the whole app bigger or smaller (67% to 200%), ⟦Ctrl⟧ ⟦0⟧ resets it; it is saved. The same control is in **Settings → Appearance → Interface size**. The terminal font size is set separately below it. On macOS it is ⌘ instead of Ctrl.',
          },
        ],
      },
      {
        id: 'make',
        title: 'Make your own',
        blocks: [
          {
            p: 'A theme is one JSON file of colors. Only `name`, `mode` (`dark` or `light`), `colors.bg`, `colors.text` and `colors.accent` are required; the colors you leave out are mixed from those three, so a three-color theme still looks finished.',
          },
          { code: THEME_EXAMPLE, label: 'ocean.json' },
          {
            p: 'Import it from **Settings → Appearance → Import theme…**: Wraithgrid checks it and saves a copy in `~/.wraithgrid/themes`. To start from a built-in theme, right-click its card → **Export as a starting point…**. To share yours, send the file.',
          },
          {
            note: 'Every value must be a hex color: `#rgb`, `#rrggbb` or `#rrggbbaa`. Nothing else is accepted (no CSS, no `rgb()`), so a theme you are sent can’t carry CSS or script. A file with a mistake is listed in Appearance with the reason instead of being applied.',
          },
        ],
      },
      {
        id: 'colors',
        title: 'Color names',
        blocks: [
          {
            table: {
              head: ['Key', 'Colors'],
              rows: [
                ['`bg`', 'Main area background (required)'],
                ['`text`', 'Main text (required)'],
                ['`accent`', 'Buttons, focus, selection, cursor (required)'],
                ['`sidebar`', 'Sidebar and pane headers'],
                ['`panel`', 'Menus, dialogs, cards'],
                ['`raised`', 'Raised controls, the selected toggle'],
                ['`line`, `lineStrong`', 'Borders, quiet and strong'],
                ['`muted`, `faint`', 'Secondary and hint text'],
                ['`accentText`', 'Accent-colored text and links'],
                [
                  '`accentFill`, `accentFillHover`, `onAccent`',
                  'Filled accent buttons and the text on them',
                ],
                ['`terminal`', 'Terminal background'],
                ['`ok`, `warn`, `err`, `info`', 'Status colors: working, needs you, errors, info'],
                ['`selection`, `hover`', 'Selected and hovered rows'],
                ['`frame`', 'The window around the sidebar and main panels'],
              ],
            },
          },
          {
            p: 'An optional `terminal` object sets `background`, `foreground`, `cursor`, `selection` and the 16 ANSI colors (`black` … `white`, `brightBlack` … `brightWhite`). The file name in `~/.wraithgrid/themes` is its id: lowercase letters, digits and `-`; files can be up to 64 KB.',
          },
        ],
      },
    ],
  },
  {
    slug: 'usage',
    nav: 'Usage',
    title: 'Usage and limits',
    description:
      'See each account’s Claude session and weekly limits and when they reset, and what your Wraithgrid chats cost per day, project and chat.',
    sections: [
      {
        id: 'open',
        title: 'Where to find it',
        blocks: [
          {
            p: '**Usage** in the sidebar (with the current session % next to it), in the account menu, the gauge in the top bar, or `/usage` in a chat.',
          },
        ],
      },
      {
        id: 'limits',
        title: 'Plan limits',
        blocks: [
          {
            p: 'For each claude account: **Current session** and **Weekly**, each as a bar with the % used and when it resets. Bars are grey, amber from 70%, red from 90% with “almost out”.',
          },
          {
            note: 'These numbers are what claude itself reports after each chat turn, so an account shows its limits after its first chat turn, and they are as of its last one.',
          },
        ],
      },
      {
        id: 'spend',
        title: 'Spend',
        blocks: [
          {
            p: 'A summary of cost, turns and tokens for Today, 7 days or 30 days, a column chart of cost per day (hover a day for its value), and tables per project and per chat.',
          },
          {
            list: [
              'Cost is at API prices: on a Pro or Max plan you pay your plan, not this.',
              'Only chat panes are measured; terminal panes are not.',
              'Kept on your computer in Wraithgrid’s settings folder (`usage.json`, 90 days). Nothing is sent anywhere.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'accounts',
    nav: 'Accounts and mods',
    title: 'Accounts, logins and mods',
    description:
      'How Wraithgrid keeps each account’s login separate per CLI, shares one claude setup across accounts, and manages claude mods for every account.',
    sections: [
      {
        id: 'logins',
        title: 'Separate logins',
        blocks: [
          {
            p: 'For each pane, Wraithgrid points the CLI at its account’s folder through the CLI’s own variable and starts it. It never reads, copies or proxies anything inside those folders.',
          },
          {
            table: {
              head: ['CLI', 'Variable', 'Login'],
              rows: [
                ['Claude Code', '`CLAUDE_CONFIG_DIR`', 'Per account'],
                ['Gemini CLI', '`GEMINI_CLI_HOME`', 'Per account'],
                ['Codex', '`CODEX_HOME`', 'Per account, or shared through the keyring'],
                [
                  'Cursor Agent',
                  '`CURSOR_CONFIG_DIR`',
                  'Per account, or shared through the keyring',
                ],
                ['Copilot CLI', '`COPILOT_HOME`', 'Per account, or shared through the keyring'],
                ['Antigravity, opencode', 'none', 'One login per computer'],
              ],
            },
          },
        ],
      },
      {
        id: 'shared',
        title: 'One claude setup',
        blocks: [
          {
            p: 'By default every claude account uses the `CLAUDE.md`, `settings.json`, `skills/`, `plugins/`, `agents/` and `commands/` of your normal `~/.claude`, so your instructions and plugins work everywhere. Logins and history stay separate. **Settings → Agents & CLIs → Shared CLAUDE.md and skills → Each account its own** turns it off.',
          },
          {
            note: 'A running claude reads these files when it starts: restart its panes after a change.',
          },
        ],
      },
      {
        id: 'mods',
        title: 'Mods',
        blocks: [
          {
            p: 'Claude mods (plugins that change claude’s own screen: side panes, a band above the prompt, status lines) run in every claude pane. The Mods screen (`⋯` in the top bar → **Mods**) lists what every account has installed, searches the marketplaces and the community list, and installs, updates and uninstalls for every account at once.',
          },
        ],
      },
    ],
  },
  {
    slug: 'terminal',
    nav: 'Terminals and scripts',
    title: 'Terminals, scripts and machines',
    description:
      'Terminal panes that keep running after you close Wraithgrid, the wraithgrid command line for scripts and agents, attach, and running a project on another computer over ssh.',
    sections: [
      {
        id: 'running',
        title: 'Agents that keep running',
        blocks: [
          {
            p: 'Terminal panes run in a small background process, not in the window. Close the window with agents running and pick **Keep running**: a tray icon shows how many, and opening Wraithgrid again shows every pane as it is now. **Stop all agents and quit** in the tray, or **Settings → General → When the window closes**, changes that.',
          },
        ],
      },
      {
        id: 'cli',
        title: 'The wraithgrid command',
        blocks: [
          {
            p: 'Turn on **Settings → Advanced → Command line** first; it is off by default. Then any terminal, or an agent in another pane, can drive your panes:',
          },
          {
            code: `wraithgrid list                        # panes: id, title, project, account, state
wraithgrid send alpha "fix the failing test"
wraithgrid wait alpha --until idle     # also: running, blocked, exited
wraithgrid read alpha --lines 50
wraithgrid new --account work --cwd ~/proj/api -- --model opus
wraithgrid split alpha                 # beside alpha, same account and folder
wraithgrid attach alpha                # the pane in this terminal; Ctrl+] leaves it
wraithgrid stop                        # stop every agent`,
            label: 'Shell',
          },
          {
            p: 'Name a pane by its id or title. Inside a pane, `$WRAITHGRID_PANE` holds its own id, so an agent can split itself or prompt another pane. The command sees terminal panes only.',
          },
        ],
      },
      {
        id: 'machines',
        title: 'Another computer',
        blocks: [
          {
            p: 'Add a computer under **Settings → Advanced → Machines** (a host from `~/.ssh/config`, or `user@host`; **Test** checks it), then right-click an empty project → **Run on …**. Its panes start there with that computer’s CLIs, folders and logins, and keep running when you disconnect.',
          },
          {
            note: 'The other computer needs Wraithgrid installed with `wraithgrid` on its PATH, and ssh that logs in with a key or an agent.',
          },
        ],
      },
    ],
  },
  {
    slug: 'shortcuts',
    nav: 'Keyboard shortcuts',
    title: 'Keyboard shortcuts',
    description:
      'Every Wraithgrid keyboard shortcut: new chat, search, git diff, zoom, chat modes, / commands, and how to rebind them.',
    sections: [
      {
        id: 'list',
        title: 'Shortcuts',
        blocks: [
          {
            table: {
              head: ['Action', 'Keys'],
              rows: [
                ['New chat or pane', '⟦Ctrl⟧ ⟦Shift⟧ ⟦N⟧'],
                ['Search panes and commands', '⟦Ctrl⟧ ⟦Shift⟧ ⟦P⟧'],
                ['Show changes (git diff)', '⟦Ctrl⟧ ⟦Shift⟧ ⟦D⟧'],
                ['Close pane', '⟦Ctrl⟧ ⟦Shift⟧ ⟦W⟧'],
                ['Zoom a pane / back to grid', '⟦Ctrl⟧ ⟦Shift⟧ ⟦Z⟧'],
                ['Move focus', '⟦Ctrl⟧ ⟦Alt⟧ ⟦Arrow⟧'],
                ['Switch project', '⟦Ctrl⟧ ⟦Shift⟧ ⟦1…9⟧'],
                ['Zoom the whole app in / out / reset', '⟦Ctrl⟧ ⟦=⟧ ⟦-⟧ ⟦0⟧'],
                ['Next chat mode', '⟦Shift⟧ ⟦Tab⟧ in the message box'],
                ['Skills and commands', '⟦/⟧ at the start of a message'],
                ['Stop a chat turn', '⟦Esc⟧'],
                ['Paste a screenshot', '⟦Ctrl⟧ ⟦V⟧'],
                ['New line in claude', '⟦Shift⟧ ⟦Enter⟧'],
                ['All shortcuts', '⟦Ctrl⟧ ⟦Shift⟧ ⟦/⟧'],
              ],
            },
          },
          {
            p: 'On macOS the app shortcuts use ⌘ instead of Ctrl. **Settings → Keyboard** rebinds search, new pane, close pane, zoom, the git diff and the shortcuts sheet; a new shortcut needs Ctrl (⌘) with Shift or Alt, so terminals keep their own keys.',
          },
        ],
      },
    ],
  },
]
