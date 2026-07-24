import { useState, useEffect } from 'react'
import { get, updateSingle, type ThemeSettings } from '@/services/cms'
import { Card, Button, Input } from '@/components/ui'

export default function AdminTheme() {
  const [settings, setSettings] = useState<ThemeSettings>({
    primaryColor: '#3B82F6', secondaryColor: '#1E293B', accentColor: '#F59E0B',
    fontHeading: 'Inter', fontBody: 'Inter', borderRadius: 8,
    animationEnabled: true, darkModeEnabled: true, customCss: '',
  })

  useEffect(() => {
    const data = get<ThemeSettings>('theme')
    if (data) setSettings(data)
  }, [])

  const save = () => updateSingle('theme', settings)

  const update = (key: string, value: any) => setSettings(prev => ({ ...prev, [key]: value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Theme Settings</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Customize your website appearance</p>
        </div>
        <Button variant="primary" size="sm" onClick={save}>Save Changes</Button>
      </div>
      <div className="space-y-6">
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
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Secondary Color</label>
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
          <Input label="Heading Font" value={settings.fontHeading} onChange={v => update('fontHeading', v)} placeholder="Inter" />
          <Input label="Body Font" value={settings.fontBody} onChange={v => update('fontBody', v)} placeholder="Inter" className="mt-3" />
        </Card>
        <Card title="Layout">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Border Radius ({settings.borderRadius}px)</label>
            <input type="range" min={0} max={24} value={settings.borderRadius} onChange={e => update('borderRadius', parseInt(e.target.value))} className="w-full" />
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
          </div>
        </Card>
      </div>
    </div>
  )
}
