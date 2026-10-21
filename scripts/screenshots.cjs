// Takes the page's screenshots from a real Wraithgrid build, with demo accounts, git repos and
// scripted agent output (scripts/demo-agent.sh stands in for claude, gemini and agy).
//
//   cd ../wraithgrid && pnpm build                       # the app must be built first
//   node scripts/screenshots.cjs                         # writes public/screenshots/*.png
//   WRAITHGRID_DIR=/path node scripts/screenshots.cjs    # explicit app checkout
//
// Linux/macOS only. Then run `pnpm assets` to write the WebP versions.
const { createRequire } = require('node:module')
const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const ROOT = path.resolve(__dirname, '..')
const APP = path.resolve(ROOT, process.env.WRAITHGRID_DIR ?? '../wraithgrid')
const OUT = path.join(ROOT, 'public/screenshots')
const { _electron: electron } = createRequire(path.join(APP, 'package.json'))('@playwright/test')
const W = 1920
const H = 1080

const git = (cwd, ...args) =>
  execFileSync('git', args, {
    cwd,
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'dev',
      GIT_AUTHOR_EMAIL: 'dev@example.com',
      GIT_COMMITTER_NAME: 'dev',
      GIT_COMMITTER_EMAIL: 'dev@example.com',
      GIT_CONFIG_GLOBAL: '/dev/null',
    },
  })

function write(dir, files) {
  for (const [f, c] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true })
    fs.writeFileSync(path.join(dir, f), c)
  }
}

/** A repo with one commit on main, optionally on a new branch, with uncommitted edits. */
function repo(dir, branch, files, edits) {
  fs.mkdirSync(dir, { recursive: true })
  git(dir, 'init', '-q', '-b', 'main')
  write(dir, files)
  git(dir, 'add', '.')
  git(dir, 'commit', '-qm', 'init')
  if (branch !== 'main') git(dir, 'checkout', '-qb', branch)
  write(dir, edits)
}

const AUTH_BEFORE = `import { Router } from 'express'
import { login, logout } from '../handlers/session'

export const router = Router()

router.post('/login', login)
router.post('/logout', logout)
`
const AUTH_AFTER = `import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { login, logout } from '../handlers/session'

export const router = Router()

// Five attempts per minute per IP; the sixth gets a 429.
const loginLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

router.post('/login', loginLimiter, login)
router.post('/logout', logout)
`
const pkg = (deps) =>
  `{\n  "name": "api-server",\n  "dependencies": {\n${deps.map((d) => `    ${d}`).join(',\n')}\n  }\n}\n`

function setup(home, userData) {
  const code = path.join(home, 'code')
  repo(
    path.join(code, 'api-server'),
    'feat/login-limit',
    { 'src/routes/auth.ts': AUTH_BEFORE, 'package.json': pkg(['"express": "^5.1.0"']) },
    {
      'src/routes/auth.ts': AUTH_AFTER,
      'package.json': pkg(['"express": "^5.1.0"', '"express-rate-limit": "^8.1.0"']),
      'test/auth.limit.test.ts':
        "import { test } from 'vitest'\n\ntest.todo('sixth attempt gets 429')\n",
    },
  )
  repo(
    path.join(code, 'web-app'),
    'main',
    { 'src/app/layout.tsx': 'export default function Layout() {}\n' },
    {
      'src/app/layout.tsx': 'export default function Layout() {\n  // theme set before paint\n}\n',
    },
  )
  repo(
    path.join(code, 'infra'),
    'staging-pool',
    { 'terraform/staging/main.tf': 'node_pool = "n1"\n' },
    { 'terraform/staging/main.tf': 'node_pool = "n2"\n' },
  )
  repo(path.join(code, 'mobile'), 'main', { 'lib/sync/queue.dart': '// queue\n' }, {})

  const account = (id, name, cli, color, icon, folderId, signedIn = true) => ({
    id,
    name,
    cli,
    configDir: `~/.wraithgrid/accounts/${name}`,
    color,
    signedIn,
    imported: false,
    icon,
    folderId,
  })
  const pane = (id, accountId, dir, chat = null) => ({
    id,
    accountId,
    cwd: `~/code/${dir}`,
    args: [],
    shell: false,
    title: chat?.title ?? dir,
    view: chat ? 'chat' : 'terminal',
    chatSessionId: chat ? `s-${dir}` : null,
    hasConversation: !!chat,
  })
  fs.mkdirSync(userData, { recursive: true })
  fs.writeFileSync(
    path.join(userData, 'config.json'),
    JSON.stringify({
      version: 1,
      claudePath: '',
      accounts: [
        account('a-work', 'work', 'claude', '#2dd4bf', 'material:work', 'f-work'),
        account('a-acme', 'client-acme', 'claude', '#f5a524', 'lucide:building-2', 'f-work'),
        account('a-personal', 'personal', 'gemini', '#7c5cff', '🦊', null),
        account('a-oss', 'oss', 'agy', '#f43f5e', '🐙', null),
        account('a-lab', 'lab', 'claude', '#7c5cff', 'material:science', null, false),
      ],
      accountFolders: [{ id: 'f-work', name: 'Work', collapsed: false, icon: '', color: '' }],
      workspaces: [
        {
          id: 'ws-main',
          name: 'main',
          icon: 'material:rocket-launch',
          color: '#7c5cff',
          layout: null,
          panes: [
            pane('p1', 'a-work', 'api-server', { title: 'Rate limit /login' }),
            pane('p2', 'a-personal', 'web-app'),
            pane('p3', 'a-acme', 'infra'),
            pane('p4', 'a-work', 'mobile', { title: 'Offline sync tests' }),
          ],
        },
        {
          id: 'ws-side',
          name: 'side-projects',
          icon: 'lucide:flask-conical',
          color: '#2dd4bf',
          layout: null,
          panes: [],
        },
      ],
      activeWorkspace: 'ws-main',
      recentFolders: ['~/code/api-server', '~/code/web-app', '~/code/infra'],
      settings: {
        checkUpdatesOnLaunch: false,
        notifyPanes: false,
        theme: 'dark',
        defaultAccountId: 'a-work',
      },
    }),
  )
  stageChats(userData)
  stageUsage(userData)
}

const tool = (id, name, toolKind, subtitle, output, preview = null) => ({
  kind: 'tool',
  id,
  name,
  toolKind,
  subtitle,
  preview,
  output,
  isError: false,
  approval: null,
})

/** The two chat panes' conversations, as the app saves a chat view (userData/chats). */
function stageChats(userData) {
  const dir = path.join(userData, 'chats')
  fs.mkdirSync(dir, { recursive: true })
  const save = (id, items) =>
    fs.writeFileSync(
      path.join(dir, `${id}.json`),
      JSON.stringify({
        v: 1,
        sessionId: `s-${id}`,
        model: 'claude-opus-5-5',
        seq: 40,
        models: [],
        items,
      }),
    )
  save('p1', [
    {
      kind: 'user',
      id: 'u1',
      text: 'Add rate limiting to the /login endpoint: five attempts a minute per IP',
      images: 0,
    },
    {
      kind: 'assistant',
      id: 'a1',
      text: "I'll put `express-rate-limit` in front of the login route and add a test for the limit.",
    },
    tool('t1', 'Read', 'read', 'src/routes/auth.ts', 'Read 7 lines'),
    tool('t2', 'Bash', 'shell', 'pnpm add express-rate-limit', '+ express-rate-limit 8.1.0', {
      type: 'code',
      text: 'pnpm add express-rate-limit',
    }),
    tool('t3', 'Edit', 'edit', 'src/routes/auth.ts', 'Updated', {
      type: 'diff',
      path: 'src/routes/auth.ts',
      before: AUTH_BEFORE,
      after: AUTH_AFTER,
    }),
    tool('t4', 'Bash', 'shell', 'pnpm test auth', '✓ 23 passed (1.4s)', {
      type: 'code',
      text: 'pnpm test auth',
    }),
    {
      kind: 'assistant',
      id: 'a2',
      text: "Done. `/login` now allows **five attempts per minute** per IP; the sixth gets a `429`:\n\n```ts\nconst loginLimiter = rateLimit({ windowMs: 60_000, max: 5 })\nrouter.post('/login', loginLimiter, login)\n```\n\nThe 23 auth tests pass. I left a `test.todo` for the 429 case in `test/auth.limit.test.ts`.",
    },
    { kind: 'turn', id: 'r1', costUsd: 0.42, durationMs: 48000, error: null },
  ])
  save('p4', [
    { kind: 'user', id: 'u1', text: 'Write tests for the offline sync queue', images: 0 },
    tool('t1', 'TodoWrite', 'todo', 'Plan', 'Updated', {
      type: 'todos',
      items: [
        { text: 'Read the queue and its retry logic', status: 'done' },
        { text: 'Cover retry, ordering and conflicts', status: 'done' },
        { text: 'Run the suite', status: 'done' },
      ],
    }),
    tool('t2', 'Read', 'read', 'lib/sync/queue.dart', 'Read 96 lines'),
    tool('t3', 'Write', 'edit', 'test/sync/queue_test.dart', 'Wrote 74 lines'),
    tool('t4', 'Bash', 'shell', 'flutter test test/sync', '✓ 11 passed', {
      type: 'code',
      text: 'flutter test test/sync',
    }),
    {
      kind: 'assistant',
      id: 'a1',
      text: 'Added **11 tests** covering retry with backoff, ordering after a reconnect, and conflict handling when the server copy changed.',
    },
    { kind: 'turn', id: 'r1', costUsd: 0.18, durationMs: 31000, error: null },
  ])
}

/** A month of chat usage and both claude accounts' limits (userData/usage.json). */
function stageUsage(userData) {
  const now = Date.now()
  const day = (ms) => {
    const d = new Date(ms)
    const p = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
  }
  const chats = [
    ['p1', 'ws-main', 'Rate limit /login', 'a-work', 1.1],
    ['p4', 'ws-main', 'Offline sync tests', 'a-work', 0.6],
    ['p9', 'ws-side', 'Plan the docs site', 'a-work', 0.4],
    ['p8', 'ws-main', 'Bump the staging node pool', 'a-acme', 0.5],
  ]
  const buckets = []
  for (let i = 0; i < 30; i++)
    for (const [paneId, workspaceId, title, accountId, scale] of chats) {
      const c = Math.max(0, (Math.sin(i * 0.8 + scale * 7) + 1.15) * scale)
      if (c < 0.15) continue
      buckets.push({
        day: day(now - i * 86_400_000),
        accountId,
        workspaceId,
        paneId,
        title,
        costUsd: c,
        input: 900 * c,
        output: 8000 * c,
        cacheRead: 140_000 * c,
        cacheWrite: 18_000 * c,
        turns: Math.ceil(c * 5),
      })
    }
  const limits = {
    'a-work': {
      fiveHour: { utilization: 0.42, resetsAt: now + 8_040_000 },
      sevenDay: { utilization: 0.58, resetsAt: now + 3 * 86_400_000 },
      at: now - 120_000,
    },
    'a-acme': {
      fiveHour: { utilization: 0.91, resetsAt: now + 1_560_000 },
      sevenDay: { utilization: 0.72, resetsAt: now + 5 * 86_400_000 },
      at: now - 300_000,
    },
  }
  fs.writeFileSync(path.join(userData, 'usage.json'), JSON.stringify({ buckets, limits }))
}

/** claude, gemini and agy on PATH, all pointing at the demo script. */
function fakeBin(tmp) {
  const bin = path.join(tmp, 'bin')
  fs.mkdirSync(bin)
  const agent = path.join(bin, 'agent')
  fs.copyFileSync(path.join(__dirname, 'demo-agent.sh'), agent)
  fs.chmodSync(agent, 0o755)
  for (const name of ['claude', 'gemini', 'agy']) fs.symlinkSync('agent', path.join(bin, name))
  return bin
}

;(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wraithgrid-shots-'))
  const home = path.join(tmp, 'home')
  const userData = path.join(tmp, 'userdata')
  setup(home, userData)
  const app = await electron.launch({
    args: [path.join(APP, 'out/main/index.js')],
    env: {
      ...process.env,
      HOME: home,
      // TERM set: skip the login-shell PATH probe, so only the demo CLIs are found.
      TERM: 'xterm-256color',
      PATH: `${fakeBin(tmp)}:/usr/bin:/bin`,
      WRAITHGRID_USER_DATA_DIR: userData,
    },
  })
  const win = await app.firstWindow()
  const shot = (name) => win.screenshot({ path: path.join(OUT, `${name}.png`) })
  const pause = (ms) => win.waitForTimeout(ms)
  try {
    await win.setViewportSize({ width: W, height: H })
    await win.getByRole('button', { name: '2×2 grid' }).click()
    const pane = (n) => win.locator('section.pane').nth(n)
    await pane(0).locator('.ph-title').click()
    // Long enough for every pane to print, the chats to start and the git chips to poll.
    await pause(5000)
    await shot('grid-dark')

    await pane(0).locator('.gitc').click()
    await pause(1200)
    await shot('diff')
    await win.keyboard.press('Control+Shift+D')
    await pause(400)

    await win.keyboard.press('Control+Shift+P')
    await win.getByRole('textbox', { name: 'Search' }).fill('work')
    await pause(500)
    await shot('palette')
    await win.keyboard.press('Escape')

    await win.keyboard.press('Control+Shift+N')
    await pause(500)
    await win.locator('#np-dir').fill('~/code/api-server')
    await pause(500)
    await shot('new-pane')
    await win.keyboard.press('Escape')
    await pause(300)

    // One chat, zoomed: the conversation, then the / menu over it.
    await pane(0).locator('.ph-title').click()
    await win.keyboard.press('Control+Shift+Z')
    await pause(800)
    await shot('chat')
    const box = pane(0).getByLabel('Message', { exact: true })
    await box.fill('/')
    await box.pressSequentially('te')
    await pause(500)
    await shot('slash')
    await box.fill('')
    await win.keyboard.press('Control+Shift+Z')
    await pause(400)

    await win.locator('.u-pill').click()
    await pause(900)
    await shot('usage')

    await win.getByRole('button', { name: /Switch account/ }).click()
    await win.getByRole('menuitem', { name: 'Manage accounts' }).click()
    await pause(800)
    await shot('accounts')

    // Mods: from the installed mods down, so the catalog shows below them.
    await win.getByRole('button', { name: 'More' }).click()
    await win.getByRole('menuitem', { name: 'Mods' }).click()
    await win.getByText('most installed first').waitFor()
    await win
      .locator('h2.sgrp', { hasText: 'Installed' })
      .evaluate((el) => el.scrollIntoView({ block: 'start' }))
    await pause(500)
    await shot('mods')

    await win.getByRole('button', { name: 'More' }).click()
    await win.getByRole('menuitem', { name: 'Settings' }).click()
    await win.getByRole('tab', { name: 'Appearance' }).click()
    await pause(800)
    await shot('settings')

    await win
      .getByRole('radiogroup', { name: 'Theme' })
      .getByRole('radio', { name: 'Daylight' })
      .click()
    await win.locator('.top .btn.gh').first().click()
    await pause(2500)
    await shot('grid-light')
  } finally {
    await app.close()
    fs.rmSync(tmp, { recursive: true, force: true })
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
