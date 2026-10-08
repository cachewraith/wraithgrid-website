/**
 * Build-time SEO and GEO (generative engine) files, made from the same copy as the page so
 * the two never disagree: JSON-LD, llms.txt, robots.txt and sitemap.xml. scripts/prerender.mjs
 * calls these after the build. Pure functions of the site URL and the latest release version.
 */
import {
  FAQS,
  FEATURES,
  GALLERY,
  HERO_ALT,
  INSTALL_TABS,
  SHORTCUTS,
  type ShotName,
} from '../content'
import { REPO_URL, RELEASES_URL } from './release'

export const SITE_NAME = 'Wraithgrid'
export const SUMMARY =
  'Wraithgrid is a free, open-source desktop app for running many Claude Code, Gemini CLI and Antigravity CLI sessions side by side, each with its own account, project folder and git branch. It runs on Windows, macOS and Linux.'
const AUTHOR = { name: 'cachewraith', url: 'https://github.com/cachewraith' }

/** Crawlers of AI search and assistant products, welcomed by name in robots.txt. */
export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'DuckAssistBot',
  'MistralAI-User',
] as const

const shot = (site: string, name: ShotName) => `${site}screenshots/${name}.png`

/** The schema.org graph for the page. `version` is null when GitHub couldn't be read at build. */
export function buildJsonLd(site: string, version: string | null): object {
  const author = { '@type': 'Person', '@id': `${site}#author`, ...AUTHOR, sameAs: [AUTHOR.url] }
  const app = {
    '@type': 'SoftwareApplication',
    '@id': `${site}#app`,
    name: SITE_NAME,
    description: SUMMARY,
    url: site,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Terminal multiplexer for AI coding agents',
    operatingSystem: 'Windows 10, Windows 11, macOS, Linux',
    ...(version && {
      softwareVersion: version,
      releaseNotes: `${REPO_URL}/releases/tag/v${version}`,
    }),
    downloadUrl: RELEASES_URL,
    installUrl: `${site}install`,
    softwareRequirements:
      'At least one of: Claude Code (claude), Gemini CLI (gemini), Antigravity CLI (agy)',
    featureList: FEATURES.map((f) => `${f.title}: ${f.body}`),
    screenshot: [
      {
        '@type': 'ImageObject',
        url: shot(site, 'grid-dark'),
        caption: HERO_ALT,
        width: 1920,
        height: 1080,
      },
      ...GALLERY.map((s) => ({
        '@type': 'ImageObject',
        url: shot(site, s.name),
        caption: s.alt,
        width: 1920,
        height: 1080,
      })),
    ],
    image: shot(site, 'grid-dark'),
    license: 'https://opensource.org/licenses/MIT',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@id': author['@id'] },
    publisher: { '@id': author['@id'] },
    sameAs: [REPO_URL],
  }
  const code = {
    '@type': 'SoftwareSourceCode',
    '@id': `${REPO_URL}#code`,
    name: SITE_NAME,
    codeRepository: REPO_URL,
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'Electron',
    license: 'https://opensource.org/licenses/MIT',
    targetProduct: { '@id': app['@id'] },
    author: { '@id': author['@id'] },
  }
  const faq = {
    '@type': 'FAQPage',
    '@id': `${site}#faq`,
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${site}#website`,
    name: SITE_NAME,
    url: site,
    description: SUMMARY,
    inLanguage: 'en',
    publisher: { '@id': author['@id'] },
    about: { '@id': app['@id'] },
  }
  return { '@context': 'https://schema.org', '@graph': [website, app, code, faq, author] }
}

/** `<script type="application/ld+json">`, with `<` escaped so text can't close the tag. */
export function jsonLdScript(site: string, version: string | null): string {
  const json = JSON.stringify(buildJsonLd(site, version)).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">${json}</script>`
}

/** https://llmstxt.org: a plain-Markdown brief for AI assistants and answer engines. */
export function buildLlmsTxt(site: string, version: string | null): string {
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SUMMARY}`,
    '',
    version
      ? `Latest release: v${version} (${REPO_URL}/releases/tag/v${version}).`
      : `Latest release: ${RELEASES_URL}.`,
    'License: MIT. Independent project, not affiliated with Anthropic or Google.',
    '',
    '## How it works',
    '',
    'Wraithgrid runs the official agent CLIs unchanged. For each pane it sets one environment variable that points the CLI at that account’s own config folder, so every account stays signed in at the same time:',
    '',
    '- Claude Code: `CLAUDE_CONFIG_DIR=~/.wraithgrid/accounts/<account> claude`',
    '- Gemini CLI: `GEMINI_CLI_HOME=~/.wraithgrid/accounts/<account> gemini`',
    '- Antigravity CLI: `agy`, which keeps its sign-in in the system keyring, so all Antigravity accounts on one computer share one Google login.',
    '',
    'It never reads, copies or proxies anything inside those folders, and it has no telemetry.',
    '',
    '## Features',
    '',
    ...FEATURES.map((f) => `- **${f.title}**: ${f.body}`),
    '',
    '## Install',
    '',
    ...INSTALL_TABS.map(
      (t) =>
        `- ${t.label}: \`${t.filePattern}\`. ${t.requirement}${t.command ? ` Install with \`${t.command(t.filePattern)}\`.` : ''}`,
    ),
    '- macOS (Intel): `Wraithgrid-*-mac-x64.dmg`.',
    `- All downloads and SHA256SUMS.txt: ${RELEASES_URL}`,
    '',
    '## Keyboard shortcuts',
    '',
    'On macOS, ⌘ replaces Ctrl.',
    '',
    ...SHORTCUTS.map((s) => `- ${s.action}: ${s.keys.join('+')}`),
    '',
    '## FAQ',
    '',
    ...FAQS.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    '## Links',
    '',
    `- [Website](${site})`,
    `- [Source code and README](${REPO_URL})`,
    `- [Releases and changelog](${REPO_URL}/releases)`,
    `- [Report an issue](${REPO_URL}/issues)`,
    '',
  ]
  return lines.join('\n')
}

export function buildRobotsTxt(site: string): string {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI search and assistant crawlers are welcome to read and cite this site.',
    ...AI_CRAWLERS.map((bot) => `User-agent: ${bot}`),
    'Allow: /',
    '',
    `Sitemap: ${site}sitemap.xml`,
    '',
  ].join('\n')
}

function xml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** One URL (the section paths are the same page, canonical to it) plus its screenshots. */
// Google dropped image:caption/title in 2022; only image:loc is read.
export function buildSitemap(site: string, lastmod: string): string {
  const shots: ShotName[] = ['grid-dark', ...GALLERY.map((s) => s.name)]
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '  <url>',
    `    <loc>${xml(site)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    ...shots.map(
      (name) => `    <image:image><image:loc>${xml(shot(site, name))}</image:loc></image:image>`,
    ),
    '  </url>',
    '</urlset>',
    '',
  ].join('\n')
}
