import { useEffect, useState } from 'react'
import { get } from '@/services/cms'

function applyTheme() {
  const t = get<any>('theme')
  if (!t) return
  const primary = t.primaryColor || '#3B82F6'
  const secondary = t.secondaryColor || '#1E293B'
  const accent = t.accentColor || '#F59E0B'
  const radius = typeof t.borderRadius === 'number' ? t.borderRadius : 8
  const heading = t.fontHeading || 'Space Grotesk'
  const body = t.fontBody || 'Inter'

  const css = `
:root {
  --ab-primary: ${primary};
  --ab-secondary: ${secondary};
  --ab-accent: ${accent};
  --ab-radius: ${radius}px;
  --ab-font-heading: '${heading}', sans-serif;
  --ab-font-body: '${body}', sans-serif;
}
[class*="text-[#60A5FA]"] { color: var(--ab-accent) !important; }
[class*="bg-[#60A5FA]"] { background-color: var(--ab-accent) !important; }
[class*="border-[#111111]"] { border-color: var(--ab-secondary) !important; }
h1, h2, h3, h4, h5, h6 { font-family: var(--ab-font-heading) !important; }
body, p, a, span, li, input, textarea, select, button { font-family: var(--ab-font-body) !important; }
${t.customCss || ''}
`
  let el = document.getElementById('ab-theme-style') as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = 'ab-theme-style'
    document.head.appendChild(el)
  }
  el.textContent = css
}

export default function ThemeApplier() {
  const [, setTick] = useState(0)

  useEffect(() => {
    applyTheme()
    const refresh = () => setTick(t => t + 1)
    window.addEventListener('cms:updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('cms:updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  useEffect(() => {
    applyTheme()
  })

  return null
}