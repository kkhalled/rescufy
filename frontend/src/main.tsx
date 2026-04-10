import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Initialize i18n before React renders
import './i18n'

import './styles/index.css'
import './styles/themes.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
      <App />
)
