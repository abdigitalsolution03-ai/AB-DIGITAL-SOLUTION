import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiMove } from 'react-icons/fi'
import { get, updateSingle, type HeaderSettings, type NavItem } from '@/services/cms'
import { Card, Button, Input } from '@/components/ui'

export default function AdminHeader() {
  const [settings, setSettings] = useState<HeaderSettings>({
    logo: '', logoAlt: '', sticky: true, ctaText: 'Get Started', ctaUrl: '/contact',
    announcementBar: { enabled: false, text: '', url: '' },
    navItems: [],
  })

  useEffect(() => {
    const data = get<HeaderSettings>('header')
    if (data) setSettings(data)
  }, [])

  const save = () => { updateSingle('header', settings) }

  const updateField = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setTimeout(() => updateSingle('header', { ...settings, [key]: value }), 0)
  }

  const addNavItem = () => {
    const items = [...settings.navItems, { id: 'nav_' + Date.now(), label: '', url: '/', children: [], order: settings.navItems.length }]
    updateField('navItems', items)
  }

  const updateNavItem = (id: string, field: string, value: any) => {
    const items = settings.navItems.map(n => n.id === id ? { ...n, [field]: value } : n)
    updateField('navItems', items)
  }

  const removeNavItem = (id: string) => {
    updateField('navItems', settings.navItems.filter(n => n.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Header</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage header, logo and navigation</p>
        </div>
        <Button variant="primary" size="sm" onClick={save}>Save Changes</Button>
      </div>
      <div className="space-y-6">
        <Card title="Logo">
          <div className="space-y-4">
            <Input label="Logo URL" value={settings.logo} onChange={v => updateField('logo', v)} placeholder="https://example.com/logo.png" />
            <Input label="Logo Alt Text" value={settings.logoAlt} onChange={v => updateField('logoAlt', v)} placeholder="Company logo" />
            {settings.logo && <img src={settings.logo} alt={settings.logoAlt} className="h-10 object-contain rounded" />}
          </div>
        </Card>
        <Card title="Announcement Bar">
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.announcementBar.enabled} onChange={e => updateField('announcementBar', { ...settings.announcementBar, enabled: e.target.checked })} className="rounded" />
              <span className="text-sm text-[var(--text-primary)]">Enable announcement bar</span>
            </label>
            <Input label="Announcement Text" value={settings.announcementBar.text} onChange={v => updateField('announcementBar', { ...settings.announcementBar, text: v })} />
            <Input label="Link URL" value={settings.announcementBar.url} onChange={v => updateField('announcementBar', { ...settings.announcementBar, url: v })} />
          </div>
        </Card>
        <Card title="CTA Button">
          <div className="space-y-4">
            <Input label="Button Text" value={settings.ctaText} onChange={v => updateField('ctaText', v)} />
            <Input label="Button URL" value={settings.ctaUrl} onChange={v => updateField('ctaUrl', v)} />
          </div>
        </Card>
        <Card title="Navigation Menu">
          <div className="space-y-2">
            {settings.navItems.map((item, i) => (
              <div key={item.id} className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-secondary)]">
                <FiMove className="text-[var(--text-tertiary)] shrink-0" />
                <Input value={item.label} onChange={v => updateNavItem(item.id, 'label', v)} placeholder="Label" className="flex-1" />
                <Input value={item.url} onChange={v => updateNavItem(item.id, 'url', v)} placeholder="/url" className="flex-1" />
                <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => removeNavItem(item.id)} className="text-red-500 shrink-0" />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" icon={<FiPlus />} onClick={addNavItem} className="mt-3">Add Menu Item</Button>
        </Card>
        <Card title="Settings">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.sticky} onChange={e => updateField('sticky', e.target.checked)} className="rounded" />
            <span className="text-sm text-[var(--text-primary)]">Sticky header</span>
          </label>
        </Card>
      </div>
    </div>
  )
}
