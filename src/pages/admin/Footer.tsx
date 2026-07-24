import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { get, updateSingle, type FooterSettings } from '@/services/cms'
import { Card, Button, Input } from '@/components/ui'

export default function AdminFooter() {
  const [settings, setSettings] = useState<FooterSettings>({
    logo: '', description: '', copyright: '© 2025 All rights reserved.',
    socialLinks: [], contact: { email: '', phone: '', address: '' },
    columns: [], paymentIcons: [], newsletterEnabled: true,
  })

  useEffect(() => {
    const data = get<FooterSettings>('footer')
    if (data) setSettings(data)
  }, [])

  const sync = (data: FooterSettings) => {
    setSettings(data)
    updateSingle('footer', data)
  }

  const update = (key: string, value: any) => sync({ ...settings, [key]: value })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Footer</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage footer content</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => sync(settings)}>Save Changes</Button>
      </div>
      <div className="space-y-6">
        <Card title="Footer Logo & Description">
          <Input label="Logo URL" value={settings.logo} onChange={v => update('logo', v)} />
          <div className="mt-3">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
            <textarea value={settings.description} onChange={e => update('description', e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
        </Card>
        <Card title="Contact Information">
          <Input label="Email" value={settings.contact.email} onChange={v => update('contact', { ...settings.contact, email: v })} />
          <Input label="Phone" value={settings.contact.phone} onChange={v => update('contact', { ...settings.contact, phone: v })} className="mt-3" />
          <div className="mt-3">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Address</label>
            <textarea value={settings.contact.address} onChange={e => update('contact', { ...settings.contact, address: e.target.value })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
        </Card>
        <Card title="Footer Columns / Links">
          {settings.columns.map((col, i) => (
            <div key={i} className="mb-4 p-3 rounded-xl bg-[var(--bg-secondary)]">
              <Input label="Column Title" value={col.title} onChange={v => { const c = [...settings.columns]; c[i].title = v; update('columns', c) }} />
              {col.links.map((link, j) => (
                <div key={j} className="flex gap-2 mt-2">
                  <Input value={link.label} onChange={v => { const c = [...settings.columns]; c[i].links[j].label = v; update('columns', c) }} placeholder="Label" />
                  <Input value={link.url} onChange={v => { const c = [...settings.columns]; c[i].links[j].url = v; update('columns', c) }} placeholder="/url" />
                  <button onClick={() => { const c = [...settings.columns]; c[i].links.splice(j, 1); update('columns', c) }} className="text-red-500 shrink-0"><FiTrash2 /></button>
                </div>
              ))}
              <Button variant="ghost" size="sm" icon={<FiPlus />} onClick={() => { const c = [...settings.columns]; c[i].links.push({ label: '', url: '' }); update('columns', c) }} className="mt-2">Add Link</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" icon={<FiPlus />} onClick={() => update('columns', [...settings.columns, { title: '', links: [] }])}>Add Column</Button>
        </Card>
        <Card title="Social Links">
          {settings.socialLinks.map((link, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <Input value={link.platform} onChange={v => { const s = [...settings.socialLinks]; s[i].platform = v; update('socialLinks', s) }} placeholder="Platform" />
              <Input value={link.url} onChange={v => { const s = [...settings.socialLinks]; s[i].url = v; update('socialLinks', s) }} placeholder="URL" />
              <Input value={link.icon} onChange={v => { const s = [...settings.socialLinks]; s[i].icon = v; update('socialLinks', s) }} placeholder="Icon name" />
              <button onClick={() => update('socialLinks', settings.socialLinks.filter((_, j) => j !== i))} className="text-red-500"><FiTrash2 /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" icon={<FiPlus />} onClick={() => update('socialLinks', [...settings.socialLinks, { platform: '', url: '', icon: '' }])} className="mt-2">Add Social Link</Button>
        </Card>
        <Card title="Copyright">
          <Input label="Copyright Text" value={settings.copyright} onChange={v => update('copyright', v)} />
        </Card>
      </div>
    </div>
  )
}
