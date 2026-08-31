import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '@/context/ThemeContext'
import App from './App'
import './styles/globals.css'
import { pullCMS, seedAllIfEmpty } from './services/cms'
import { useAnalyticsInit, usePageTracking } from '@/hooks/useAnalytics'

seedAllIfEmpty()
void pullCMS()

function AppWithAnalytics() {
  useAnalyticsInit()
  usePageTracking()
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AppWithAnalytics />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
