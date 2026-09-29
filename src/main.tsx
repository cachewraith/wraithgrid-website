import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('#root is missing from index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
