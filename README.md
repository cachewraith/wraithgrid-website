# wraithgrid-website

The landing page and docs for [Wraithgrid](https://github.com/cachewraith/wraithgrid). Vite,
React 19, TypeScript and plain CSS; prerendered to static HTML.

## Run

```sh
bun install
bun run dev                       # http://localhost:5173
bun run build && bun run preview  # production build under the real CSP, http://localhost:4173
```

## Check

```sh
bun run lint && bun run typecheck && bun run test
```

## Where things are

- `src/content.ts`: all page copy (features, FAQ, shortcuts, install). Facts come from the app's
  README and `docs/WHATS-NEW.md`.
- `src/docs/pages.ts`: the `/docs` pages, as data.
- `scripts/prerender.mjs`: static HTML per page plus `robots.txt`, `sitemap.xml`, `llms.txt`.
- `scripts/screenshots.cjs`: retakes `public/screenshots/` from an app build next to this repo,
  then `bun run assets` writes the WebP versions.

The version and download links come from the GitHub Releases API (in the browser, and at build
time for SEO), so redeploy after each app release.

## Deploy

Vercel, with `vercel.json` (Bun install and build, output `dist`). Set `SITE_URL` for a custom
domain.

MIT. Not affiliated with Anthropic, Google or OpenAI.
