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
import { Why } from './components/Why'
import { useMotion } from './hooks/useMotion'
import { initNavigation } from './lib/navigation'
import { useRelease } from './hooks/useRelease'
import { useTheme } from './hooks/useTheme'
import { detectOS } from './lib/os'

export function App() {
  const [os] = useState(detectOS)
  const release = useRelease()
  const theme = useTheme()
  useEffect(initNavigation, [])
  useMotion()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav themeMode={theme.mode} onThemeChange={theme.setMode} />
      {/* ScrollSmoother moves #smooth-content; the fixed nav stays outside it. */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main" tabIndex={-1}>
            <Hero os={os} release={release} theme={theme.resolved} />
            <Why />
            <HowItWorks />
            <Features />
            <Gallery />
            <Install os={os} release={release} />
            <Shortcuts />
            <Faq />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
