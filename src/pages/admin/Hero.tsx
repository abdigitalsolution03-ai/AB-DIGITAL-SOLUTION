import { useState, useEffect } from 'react'
import { Card, Button, Input } from '@/components/ui'

export default function AdminHero() {
  const [form, setForm] = useState({
    title: 'Welcome', subtitle: 'Your Digital Partner',
    description: 'We help businesses grow with modern digital solutions.',
    ctaText: 'Get Started', ctaUrl: '/contact',
    secondaryCtaText: 'Learn More', secondaryCtaUrl: '/about',
    image: '', background: '',
  })

  useEffect(() => {
    const stored = localStorage.getItem('cms_hero')
    if (stored) {
      try { setForm(JSON.parse(stored)) } catch {}
    }
  }, [])

  const save = () => {
    localStorage.setItem('cms_hero', JSON.stringify(form))
  }

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Hero Section</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage homepage hero</p>
        </div>
        <Button variant="primary" size="sm" onClick={save}>Save Changes</Button>
      </div>
      <div className="space-y-6">
        <Card title="Hero Content">
          <Input label="Title" value={form.title} onChange={v => update('title', v)} />
          <Input label="Subtitle (badge)" value={form.subtitle} onChange={v => update('subtitle', v)} className="mt-3" />
          <div className="mt-3">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
        </Card>
        <Card title="Call to Action">
          <Input label="Primary Button Text" value={form.ctaText} onChange={v => update('ctaText', v)} />
          <Input label="Primary Button URL" value={form.ctaUrl} onChange={v => update('ctaUrl', v)} className="mt-3" />
          <Input label="Secondary Button Text" value={form.secondaryCtaText} onChange={v => update('secondaryCtaText', v)} className="mt-3" />
          <Input label="Secondary Button URL" value={form.secondaryCtaUrl} onChange={v => update('secondaryCtaUrl', v)} className="mt-3" />
        </Card>
        <Card title="Media">
          <Input label="Hero Image URL" value={form.image} onChange={v => update('image', v)} />
          {form.image && <img src={form.image} alt="" className="mt-2 h-40 object-cover rounded-xl" />}
        </Card>
      </div>
    </div>
  )
}
