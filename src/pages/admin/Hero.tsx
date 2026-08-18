import { useState, useEffect } from 'react'
import { FiImage } from 'react-icons/fi'
import { Card, Button, Input } from '@/components/ui'
import { get, updateSingle } from '@/services/cms'
import MediaPicker from '@/components/admin/MediaPicker'

export default function AdminHero() {
  const [form, setForm] = useState({
    title: 'Welcome', subtitle: 'Your Digital Partner',
    description: 'We help businesses grow with modern digital solutions.',
    ctaText: 'Get Started', ctaUrl: '/contact',
    secondaryCtaText: 'Learn More', secondaryCtaUrl: '/about',
    image: '', background: '',
  })
  const [saved, setSaved] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    const stored = get<any>('hero')
    if (stored) {
      setForm({
        title: stored.title || form.title,
        subtitle: stored.subtitle || stored.badge || form.subtitle,
        description: stored.description || form.description,
        ctaText: stored.ctaText || stored.cta1?.text || form.ctaText,
        ctaUrl: stored.ctaUrl || stored.cta1?.url || form.ctaUrl,
        secondaryCtaText: stored.secondaryCtaText || stored.cta2?.text || form.secondaryCtaText,
        secondaryCtaUrl: stored.secondaryCtaUrl || stored.cta2?.url || form.secondaryCtaUrl,
        image: stored.image || '',
        background: stored.backgroundImage || '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = () => {
    updateSingle('hero', {
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      ctaText: form.ctaText,
      ctaUrl: form.ctaUrl,
      secondaryCtaText: form.secondaryCtaText,
      secondaryCtaUrl: form.secondaryCtaUrl,
      image: form.image,
      backgroundImage: form.background,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Hero Section</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage homepage hero — changes apply to the live site</p>
        </div>
        <Button variant="primary" size="sm" onClick={save}>{saved ? 'Saved ✓' : 'Save Changes'}</Button>
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
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1 flex items-center justify-between">
            <span>Hero Image</span>
            <Button variant="outline" size="xs" icon={<FiImage />} onClick={() => setPickerOpen(true)}>Browse Media</Button>
          </label>
          <div className="flex items-center gap-3">
            {form.image && <img src={form.image} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" />}
            <input value={form.image} onChange={e => update('image', e.target.value)} placeholder="Paste image URL or browse media" className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
        </Card>
      </div>
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={url => { update('image', url); setPickerOpen(false) }} />
    </div>
  )
}