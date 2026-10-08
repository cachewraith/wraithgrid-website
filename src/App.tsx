import { useEffect, useState } from 'react'
import { Faq } from './components/Faq'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Install } from './components/Install'
import { Nav } from './components/Nav'
import { Shortcuts } from './components/Shortcuts'
import { initNavigation } from './lib/navigation'
import { useReleaseInfo } from './hooks/useRelease'
import { useTheme } from './hooks/useTheme'
import { detectOS } from './lib/os'

export function App() {
  const [os] = useState(detectOS)
  const info = useReleaseInfo()
  const release = info?.latest ?? null
  const theme = useTheme()
  useEffect(initNavigation, [])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav themeMode={theme.mode} onThemeChange={theme.setMode} />
      <main id="main" tabIndex={-1}>
        <Hero
          os={os}
          release={release}
          downloads={info?.totalDownloads ?? null}
          theme={theme.resolved}
        />
        <HowItWorks />
        <Features />
        <Gallery />
        <Install os={os} release={release} />
        <Shortcuts />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
