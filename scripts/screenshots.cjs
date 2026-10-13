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
  const pane = (id, accountId, dir) => ({
    id,
    accountId,
    cwd: `~/code/${dir}`,
    args: [],
    shell: false,
    title: dir,
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
            pane('p1', 'a-work', 'api-server'),
            pane('p2', 'a-personal', 'web-app'),
            pane('p3', 'a-acme', 'infra'),
            pane('p4', 'a-work', 'mobile'),
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
        accent: 'violet',
      },
    }),
  )
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
    await win
      .locator('section.pane')
      .first()
      .click({ position: { x: 300, y: 200 } })
    // Long enough for every pane to print and for the git chips to poll.
    await pause(4500)
    await shot('grid-dark')

    await win.locator('section.pane').first().locator('.gitc').click()
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

    await win
      .locator('.sb-sec, section, div')
      .filter({ hasText: /^Accounts/ })
      .getByRole('button', { name: 'Manage', exact: true })
      .last()
      .click()
    await pause(800)
    await shot('accounts')

    // Settings opens at General, which shows this run's temp paths; start at Appearance.
    await win.getByRole('button', { name: 'Settings' }).click()
    await pause(800)
    await win
      .locator('h2.sgrp', { hasText: 'Appearance' })
      .evaluate((el) => el.scrollIntoView({ block: 'start' }))
    await pause(500)
    await shot('settings')

    await win.getByRole('radio', { name: 'Light' }).first().click()
    await win.locator('button', { hasText: 'main' }).first().click()
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
