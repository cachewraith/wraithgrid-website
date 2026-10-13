# wraithgrid-website

The landing page for [Wraithgrid](https://github.com/cachewraith/wraithgrid). It's built with Vite,
React 19, TypeScript and plain CSS. Its only runtime dependencies are `react` and `react-dom`.

## Run

```sh
pnpm install
pnpm dev          # http://localhost:5173
```

The dev server drops the CSP meta tag, because Vite's hot-reload preamble is an inline script.
To test the page under the real CSP, use a production build:

```sh
pnpm build && pnpm preview    # http://localhost:4173
```

## Check

```sh
pnpm lint         # ESLint + Prettier --check
pnpm typecheck
pnpm test         # Vitest: release lookup, OS detection, theme storage
pnpm format       # Prettier --write
```

## Build

`pnpm build` writes a static site to `dist/`, served from `/`. It runs in three steps:

1. `vite build`: the client bundle and `index.html`.
2. `vite build --ssr src/entry-server.tsx`: the same page for Node, into `dist-ssr/` (deleted
   afterwards).
3. `scripts/prerender.mjs`: renders the page into `dist/index.html` and writes the SEO files (see
   below). The client then hydrates that HTML instead of building it from nothing.

`SITE_URL` sets the absolute URL used for canonical, Open Graph, JSON-LD, `robots.txt`,
`sitemap.xml` and `llms.txt` (see Deploy). To serve from a subpath instead, set `BASE_PATH`
(e.g. `/docs/`) for both `pnpm build` and `pnpm preview`.

## SEO and GEO

The page is prerendered, so search engines and AI crawlers that don't run JavaScript (GPTBot,
ClaudeBot, PerplexityBot and most others) read the full text. `src/lib/seo.ts` builds everything
else from `src/content.ts`, the same copy the page shows, so they can't drift apart:

| Output              | What it is                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| JSON-LD in `<head>` | `SoftwareApplication` (version, features, screenshots), `FAQPage`, `WebSite`, source code, author |
| `/llms.txt`         | A Markdown brief for AI assistants ([llmstxt.org](https://llmstxt.org)), linked from `<head>`     |
| `/robots.txt`       | Allows everyone, names the AI search crawlers, links the sitemap                                  |
| `/sitemap.xml`      | The page and its screenshots (image sitemap)                                                      |

The release version in the JSON-LD and `llms.txt` comes from GitHub at build time. If GitHub
doesn't answer, the build still succeeds and leaves the version out, so redeploy after a release.
Rendering only uses neutral defaults (dark theme, no detected OS, no release); the theme, OS and
download links are filled in right after hydration (`useSyncExternalStore` server snapshots).

To verify ownership in Google Search Console or Bing Webmaster Tools with a meta tag, set
`GOOGLE_SITE_VERIFICATION` and/or `BING_SITE_VERIFICATION` to the token and redeploy. DNS
verification needs nothing here.

## Deploy (Vercel)

Import the repo in Vercel. It detects Vite, so the defaults work:

| Setting          | Value          |
| ---------------- | -------------- |
| Framework        | Vite           |
| Install command  | `pnpm install` |
| Build command    | `pnpm build`   |
| Output directory | `dist`         |

You don't need to set `BASE_PATH`, because Vercel serves the site from `/`. Canonical, Open Graph,
`robots.txt` and `sitemap.xml` use the project's production domain
(`VERCEL_PROJECT_PRODUCTION_URL`). After you add a custom domain, set `SITE_URL` (e.g.
`https://wraithgrid.example.org/`) under **Settings → Environment Variables** and redeploy.

### Section URLs

Sections have clean paths: `/features`, `/install`, `/shortcuts`, `/faq`. They're the same page,
scrolled to that section (`src/lib/navigation.ts`). Old `/#install` links are redirected to
`/install`. `vercel.json` rewrites those four paths to `index.html`, and any other path is a normal 404. If you add a section, add its id to `SECTION_IDS` in `src/lib/sections.ts` and to the rewrite
in `vercel.json`.

## Update the screenshots

The screenshots are taken from a real Wraithgrid build. `scripts/screenshots.cjs` launches the
app with a demo config: five accounts (claude, gemini, agy), four git repos with uncommitted
changes, and `scripts/demo-agent.sh` standing in for the three CLIs. Then it saves seven
1920×1080 PNGs to `public/screenshots/`. It needs the app checkout next to this repo (or
`WRAITHGRID_DIR`), built, and Linux or macOS:

```sh
(cd ../wraithgrid && pnpm install && pnpm build)
node scripts/screenshots.cjs        # grid-dark, grid-light, diff, palette, new-pane, accounts, settings
pnpm assets                         # icon from the app repo + WebP at 960 px and full width (ImageMagick)
```

The page serves WebP and falls back to PNG. If a screenshot's pixel size changes, update
`SHOT_WIDTH` and `SHOT_HEIGHT` in `src/content.ts`, the `og:image` size in `index.html`, and the
`1920w` in `public/theme-init.js`. Otherwise the reserved space won't match.

## How the download buttons and counter work

`src/lib/release.ts` fetches
`https://api.github.com/repos/cachewraith/wraithgrid/releases?per_page=100` once per browser
session. The result, including a failure, is cached in `sessionStorage`, and the request times out
after 5 s. That one response gives both values the page needs:

- **The latest release**: the newest entry that is not a pre-release (GitHub's own definition of
  "latest"). Its installers drive the download buttons and the version label.
- **The download counter** under the hero buttons: the `download_count` of every installer,
  summed over all listed releases, pre-releases included. Checksums, `.blockmap` files and the
  `latest*.yml` files the in-app updater polls are not counted, since they aren't installs.
  Releases past the 100 most recent aren't counted either.

It keeps only assets whose URL starts with
`https://github.com/cachewraith/wraithgrid/releases/download/` and matches them to platforms by
filename. If anything fails (network, 403 rate limit, 404, bad JSON, a renamed file), every
button links to the releases page, and the version label and the counter are hidden. The page
never shows a count it couldn't read. Filenames are matched by these patterns, so keep release
file names in this shape:

| Platform               | Pattern            |
| ---------------------- | ------------------ |
| Windows                | `-Setup-.*\.exe$`  |
| macOS (Apple silicon)  | `-mac-arm64\.dmg$` |
| macOS (Intel)          | `-mac-x64\.dmg$`   |
| Ubuntu / Debian / Kali | `amd64\.deb$`      |
| Fedora                 | `x86_64\.rpm$`     |
| Arch                   | `\.pacman$`        |
| AppImage               | `\.AppImage$`      |

The macOS `.zip` builds aren't linked or counted; the `.dmg` is what people install.

`src/lib/os.ts` chooses the hero button: Windows gets the `.exe`. macOS and Linux go to the Install
section with the macOS or AppImage tab selected, since neither the Mac's CPU nor the Linux distro
can be detected reliably. Everything else goes to the Install section too.

## Design

The page follows the app's own look since v1.4: neutral greys, hairline rules, a monochrome
primary button, and the violet accent kept for links and focus (`src/styles/tokens.css` mirrors
the app's tokens). There is no scroll animation library. The only motion is a short CSS fade on
the hero text at first paint, and `prefers-reduced-motion: reduce` turns that off.

## Layout

```
public/            icon, screenshots (PNG + WebP), theme-init.js (runs before first paint)
scripts/           prerender.mjs (static HTML + SEO files), screenshots.cjs + demo-agent.sh
                   (capture), assets.mjs (icon, WebP)
src/content.ts     all page copy: features, shortcuts, FAQ, install commands
src/lib/           framework-free logic + tests (release, os, theme, seo)
src/entry-server.tsx  render to HTML for scripts/prerender.mjs
src/hooks/         useRelease, useTheme
src/components/    one component per section
src/styles/        tokens.css (design tokens), base.css, sections.css
```

## Privacy and security

- No analytics, trackers or cookies. The only third-party request is the GitHub API call above.
- A CSP meta tag allows only same-origin scripts, styles, fonts and fetches, plus the GitHub API
  (`connect-src 'self' https://api.github.com`). `'self'` lets tools such as Lighthouse read
  `robots.txt`. The theme script is a separate file, `public/theme-init.js`, because inline
  scripts are blocked.
- No `dangerouslySetInnerHTML` (an ESLint rule enforces this). All external links use
  `rel="noopener noreferrer"`.

Wraithgrid is an independent project, not affiliated with Anthropic or Google. MIT licensed.
