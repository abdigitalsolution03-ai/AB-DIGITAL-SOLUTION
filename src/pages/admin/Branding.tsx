import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { get, updateSingle, type Branding } from '@/services/cms'
import { Card, Button, Input } from '@/components/ui'

export default function AdminBranding() {
  const [settings, setSettings] = useState<Branding>({
    logo: '', logoDark: '', favicon: '', companyName: '', email: '', phone: '', address: '', socialLinks: [],
  })

  useEffect(() => {
    const data = get<Branding>('branding')
    if (data) setSettings(data)
  }, [])

  const save = () => updateSingle('branding', settings)
  const update = (key: string, value: any) => setSettings(prev => ({ ...prev, [key]: value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Branding</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage your brand identity</p>
        </div>
        <Button variant="primary" size="sm" onClick={save}>Save Changes</Button>
      </div>
      <div className="space-y-6">
        <Card title="Logos">
          <Input label="Light Logo URL" value={settings.logo} onChange={v => update('logo', v)} placeholder="https://example.com/logo-light.png" />
          {settings.logo && <img src={settings.logo} alt="" className="h-10 mt-2 object-contain rounded bg-white p-1" />}
          <Input label="Dark Logo URL" value={settings.logoDark} onChange={v => update('logoDark', v)} className="mt-3" placeholder="https://example.com/logo-dark.png" />
          {settings.logoDark && <img src={settings.logoDark} alt="" className="h-10 mt-2 object-contain rounded bg-black p-1" />}
          <Input label="Favicon URL" value={settings.favicon} onChange={v => update('favicon', v)} className="mt-3" placeholder="https://example.com/favicon.ico" />
        </Card>
        <Card title="Company Details">
          <Input label="Company Name" value={settings.companyName} onChange={v => update('companyName', v)} />
          <Input label="Email" value={settings.email} onChange={v => update('email', v)} className="mt-3" />
          <Input label="Phone" value={settings.phone} onChange={v => update('phone', v)} className="mt-3" />
          <div className="mt-3">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Address</label>
            <textarea value={settings.address} onChange={e => update('address', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
        </Card>
        <Card title="Social Media Links">
          {settings.socialLinks.map((link, i) => (
            <div key={i} className="flex gap-2 mt-2">
              <Input value={link.platform} onChange={v => { const s = [...settings.socialLinks]; s[i].platform = v; setSettings({ ...settings, socialLinks: s }) }} placeholder="Platform" />
              <Input value={link.url} onChange={v => { const s = [...settings.socialLinks]; s[i].url = v; setSettings({ ...settings, socialLinks: s }) }} placeholder="URL" />
              <button onClick={() => setSettings({ ...settings, socialLinks: settings.socialLinks.filter((_, j) => j !== i) })} className="text-red-500 shrink-0"><FiTrash2 /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" icon={<FiPlus />} onClick={() => setSettings({ ...settings, socialLinks: [...settings.socialLinks, { platform: '', url: '' }] })} className="mt-2">Add Social Link</Button>
        </Card>
      </div>
    </div>
  )
}
