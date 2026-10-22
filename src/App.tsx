import { useEffect, useSyncExternalStore } from 'react'
import { Faq } from './components/Faq'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Install } from './components/Install'
import { Nav } from './components/Nav'
import { Shortcuts } from './components/Shortcuts'
import { Themes } from './components/Themes'
import { DocsPage } from './components/docs/DocsPage'
import { DOCS } from './docs/pages'
import { docFromPath } from './lib/docs'
import { initNavigation } from './lib/navigation'
import { useReleaseInfo } from './hooks/useRelease'
import { useTheme } from './hooks/useTheme'
import { detectOS, type OS } from './lib/os'

const noSubscribe = () => () => undefined

interface Props {
  /** The URL path: the landing page, or a docs page under /docs. */
  path: string
}

export function App({ path }: Props) {
  // 'other' matches the prerendered HTML; React re-renders with the real OS after hydration.
  const os = useSyncExternalStore(noSubscribe, detectOS, (): OS => 'other')
  const info = useReleaseInfo()
  const release = info?.latest ?? null
  const theme = useTheme()
  useEffect(initNavigation, [])
  const doc = docFromPath(path, import.meta.env.BASE_URL, DOCS)

  if (doc)
    return (
      <>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav themeMode={theme.mode} onThemeChange={theme.setMode} current="docs" />
        <main id="main" tabIndex={-1}>
          <DocsPage page={doc} />
        </main>
        <Footer />
      </>
    )

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav themeMode={theme.mode} onThemeChange={theme.setMode} />
      <main id="main" tabIndex={-1}>
        <Hero os={os} release={release} downloads={info?.totalDownloads ?? null} />
        <HowItWorks />
        <Features />
        <Themes />
        <Gallery />
        {/* Keyed so the default tab follows the OS once it's known. */}
        <Install key={os} os={os} release={release} />
        <Shortcuts />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
