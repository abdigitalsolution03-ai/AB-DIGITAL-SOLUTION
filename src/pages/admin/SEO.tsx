import { useState, useEffect } from 'react'
import { get, updateSingle, type SEOSettings } from '@/services/cms'
import { Card, Button, Input } from '@/components/ui'

export default function AdminSEO() {
  const [settings, setSettings] = useState<SEOSettings>({
    globalTitle: '', globalDescription: '', keywords: '', ogImage: '',
    twitterHandle: '', googleAnalytics: '', googleVerification: '', facebookPixel: '', customHead: '',
  })

  useEffect(() => {
    const data = get<SEOSettings>('seo')
    if (data) setSettings(data)
  }, [])

  const save = () => updateSingle('seo', settings)

  const update = (key: string, value: any) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">SEO Manager</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage SEO settings</p>
        </div>
        <Button variant="primary" size="sm" onClick={save}>Save Changes</Button>
      </div>
      <div className="space-y-6">
        <Card title="Global SEO">
          <Input label="Site Title" value={settings.globalTitle} onChange={v => update('globalTitle', v)} placeholder="My Website" />
          <div className="mt-3">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Meta Description</label>
            <textarea value={settings.globalDescription} onChange={e => update('globalDescription', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
          <Input label="Keywords" value={settings.keywords} onChange={v => update('keywords', v)} className="mt-3" placeholder="keyword1, keyword2, keyword3" />
          <Input label="Open Graph Image URL" value={settings.ogImage} onChange={v => update('ogImage', v)} className="mt-3" />
          <Input label="Twitter Handle" value={settings.twitterHandle} onChange={v => update('twitterHandle', v)} className="mt-3" placeholder="@username" />
        </Card>
        <Card title="Analytics & Verification">
          <Input label="Google Analytics ID" value={settings.googleAnalytics} onChange={v => update('googleAnalytics', v)} placeholder="G-XXXXXXXXXX" />
          <Input label="Google Site Verification" value={settings.googleVerification} onChange={v => update('googleVerification', v)} className="mt-3" />
          <Input label="Facebook Pixel ID" value={settings.facebookPixel} onChange={v => update('facebookPixel', v)} className="mt-3" />
        </Card>
        <Card title="Custom Head Code">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Custom &lt;head&gt; HTML</label>
            <textarea value={settings.customHead} onChange={e => update('customHead', e.target.value)} rows={6} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono" placeholder="<meta name='custom' content='...' />" />
          </div>
        </Card>
      </div>
    </div>
  )
}
