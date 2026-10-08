# wraithgrid-website

The landing page for [Wraithgrid](https://github.com/cachewraith/wraithgrid). It's built with Vite,
React 19, TypeScript and plain CSS. Its runtime dependencies are only `react` and `react-dom`.

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

`pnpm build` writes a static site to `dist/`, served from `/`. `SITE_URL` sets the absolute URL used
for canonical, Open Graph, `robots.txt` and `sitemap.xml` (see Deploy). To serve from a subpath
instead, set `BASE_PATH` (e.g. `/docs/`) for both `pnpm build` and `pnpm preview`.

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

The screenshots and icon come from the app repo (`docs/screenshots/*.png`, `build/icon.{svg,png}`).
Refreshing them requires ImageMagick (`magick`):

```sh
pnpm assets                         # copies from ../wraithgrid if it exists, else downloads from GitHub
WRAITHGRID_DIR=/path/to/wraithgrid pnpm assets
```

The script copies the PNGs into `public/` and writes WebP versions at 960 px and full width. The
page serves WebP and falls back to PNG. If a screenshot's pixel size changes, update `SHOT_WIDTH` and
`SHOT_HEIGHT` in `src/content.ts`, and the `og:image` size in `index.html`. Otherwise the reserved
space won't match.

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

| Platform               | Pattern           |
| ---------------------- | ----------------- |
| Windows                | `-Setup-.*\.exe$` |
| Ubuntu / Debian / Kali | `amd64\.deb$`     |
| Fedora                 | `x86_64\.rpm$`    |
| Arch                   | `\.pacman$`       |
| AppImage               | `\.AppImage$`     |

`src/lib/os.ts` chooses the hero button: Windows gets the `.exe`, Linux gets the Install section
with the AppImage tab selected (the distro can't be detected reliably), and everything else sees
"Available for Windows and Linux".

## Motion

- **Hero entrance**: CSS keyframes (`[data-intro]` in `sections.css`). It runs on first paint.
- **Everything else** (`src/lib/motion.ts`, GSAP): ScrollSmoother smooth scrolling, scroll reveals,
  the how-it-works diagram drawing itself, and the hero screenshot flattening as you scroll.
  `useMotion` imports it after the page `load` event, when the browser is idle, so GSAP never
  competes with the hero image.
- **Phones and tablets** keep native scrolling (ScrollSmoother's default for touch); reveals
  still run.
- **`prefers-reduced-motion: reduce`** turns all of it off, and the page is fully static.
- The hero tilt's starting angle is in both `sections.css` and `motion.ts`; change them together.

## Layout

```
public/            icon, screenshots (PNG + WebP), theme-init.js (runs before first paint)
scripts/assets.mjs screenshot/icon import and WebP conversion
src/content.ts     all page copy: features, shortcuts, FAQ, install commands
src/lib/           framework-free logic + tests (release, os, theme)
src/hooks/         useRelease, useTheme, useMotion
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

Wraithgrid is an independent project, not affiliated with Anthropic. MIT licensed.
