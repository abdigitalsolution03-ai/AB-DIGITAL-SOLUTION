import { useState, useEffect } from 'react'
import { get, updateSingle, type ThemeSettings } from '@/services/cms'
import { Card, Button, Input } from '@/components/ui'

const PRESETS: { name: string; primary: string; secondary: string; accent: string }[] = [
  { name: 'Classic Blue', primary: '#3B82F6', secondary: '#1E293B', accent: '#F59E0B' },
  { name: 'Ocean', primary: '#0EA5E9', secondary: '#0F172A', accent: '#22C55E' },
  { name: 'Royal', primary: '#6366F1', secondary: '#111827', accent: '#EC4899' },
  { name: 'Forest', primary: '#10B981', secondary: '#064E3B', accent: '#F59E0B' },
  { name: 'Sunset', primary: '#F97316', secondary: '#431407', accent: '#FACC15' },
  { name: 'Graphite', primary: '#64748B', secondary: '#0F172A', accent: '#38BDF8' },
]

const FONTS = [
  'Inter', 'Poppins', 'Roboto', 'Space Grotesk', 'Montserrat',
  'Nunito Sans', 'Lato', 'Open Sans', 'Raleway', 'Playfair Display',
]

function emitUpdated() {
  window.dispatchEvent(new Event('cms:updated'))
}

export default function AdminTheme() {
  const [settings, setSettings] = useState<ThemeSettings>({
    primaryColor: '#3B82F6', secondaryColor: '#1E293B', accentColor: '#F59E0B',
    fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 8,
    animationEnabled: true, darkModeEnabled: true, customCss: '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const data = get<ThemeSettings>('theme')
    if (data) setSettings(data)
  }, [])

  const save = () => {
    updateSingle('theme', settings)
    emitUpdated()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const applyPreset = (p: typeof PRESETS[0]) => {
    setSettings(prev => ({ ...prev, primaryColor: p.primary, secondaryColor: p.secondary, accentColor: p.accent }))
  }

  const update = (key: string, value: any) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      return next
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Theme Editor</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Customize colors, fonts and layout — changes apply to the live site instantly</p>
        </div>
        <Button variant="primary" size="sm" onClick={save}>{saved ? 'Saved ✓' : 'Save Changes'}</Button>
      </div>

      <div className="space-y-6 max-w-3xl">
        <Card title="Color Presets">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESETS.map(p => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                  settings.primaryColor === p.primary
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                    : 'border-[var(--border-primary)] hover:border-blue-300'
                }`}
              >
                <div className="flex -space-x-1.5">
                  <span className="w-5 h-5 rounded-full border-2 border-white dark:border-[var(--bg-secondary)]" style={{ background: p.primary }} />
                  <span className="w-5 h-5 rounded-full border-2 border-white dark:border-[var(--bg-secondary)]" style={{ background: p.secondary }} />
                  <span className="w-5 h-5 rounded-full border-2 border-white dark:border-[var(--bg-secondary)]" style={{ background: p.accent }} />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">{p.name}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Colors">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Primary Color</label>
              <div className="flex gap-2">
                <input type="color" value={settings.primaryColor} onChange={e => update('primaryColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <Input value={settings.primaryColor} onChange={v => update('primaryColor', v)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Secondary / Dark Color</label>
              <div className="flex gap-2">
                <input type="color" value={settings.secondaryColor} onChange={e => update('secondaryColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <Input value={settings.secondaryColor} onChange={v => update('secondaryColor', v)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Accent Color</label>
              <div className="flex gap-2">
                <input type="color" value={settings.accentColor} onChange={e => update('accentColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                <Input value={settings.accentColor} onChange={v => update('accentColor', v)} />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Typography">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Heading Font</label>
              <select
                value={settings.fontHeading}
                onChange={e => update('fontHeading', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Body Font</label>
              <select
                value={settings.fontBody}
                onChange={e => update('fontBody', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </Card>

        <Card title="Layout">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Border Radius ({settings.borderRadius}px)</label>
            <input type="range" min={0} max={24} value={settings.borderRadius} onChange={e => update('borderRadius', parseInt(e.target.value))} className="w-full" />
            <div className="flex gap-2 mt-3">
              {[0, 4, 8, 12, 16, 20, 24].map(r => (
                <button
                  key={r}
                  onClick={() => update('borderRadius', r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    settings.borderRadius === r
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'border-[var(--border-primary)] text-[var(--text-tertiary)] hover:border-blue-300'
                  }`}
                >
                  {r}px
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Features">
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.animationEnabled} onChange={e => update('animationEnabled', e.target.checked)} className="rounded" />
              <span className="text-sm text-[var(--text-primary)]">Enable animations</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.darkModeEnabled} onChange={e => update('darkModeEnabled', e.target.checked)} className="rounded" />
              <span className="text-sm text-[var(--text-primary)]">Enable dark mode</span>
            </label>
          </div>
        </Card>

        <Card title="Custom CSS">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Custom CSS</label>
            <textarea value={settings.customCss} onChange={e => update('customCss', e.target.value)} rows={8} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono" placeholder="/* Your custom CSS here */" />
            <p className="text-xs text-[var(--text-tertiary)] mt-1.5">Tip: use --ab-primary, --ab-accent and --ab-radius variables in your custom CSS.</p>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="md" onClick={save}>{saved ? 'Saved ✓' : 'Save Changes'}</Button>
        </div>
      </div>
    </div>
  )
}