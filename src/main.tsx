import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './dark-theme.css'
import App from './App.tsx'

// Restore the saved theme. index.html does this too, but a cached copy of it (service worker)
// may predate that script, so it is repeated here.
try {
  if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark')
} catch {
  // storage unavailable: stay on the default light theme
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
