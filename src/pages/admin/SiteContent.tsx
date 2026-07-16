import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'
import { getSiteContent, updateSiteContent, type SiteContent, type NavItem, type StatItem, type FeatureItem, type StepItem, type PlanFeature, type SocialLink, type ValueItem, type TimelineItem, type TeamMember } from '@/services/siteContent'

type TabId = 'header' | 'hero' | 'footer' | 'contact' | 'about' | 'whyChooseUs' | 'pricing' | 'process' | 'newsletter'

interface TabDef {
  id: TabId
  label: string
  icon: string
}

const tabs: TabDef[] = [
  { id: 'header', label: 'Header', icon: 'M4 6h16M4 12h16M4 18h16' },
  { id: 'hero', label: 'Hero', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
  { id: 'footer', label: 'Footer', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
  { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id: 'about', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'whyChooseUs', label: 'Why Us', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: 'pricing', label: 'Pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'process', label: 'Process', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { id: 'newsletter', label: 'Newsletter', icon: 'M3 19L9 10l4 8 5-9 3 10' },
]

const inputClass = "w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm"
const labelClass = "block text-sm font-bold text-[#111]/60 mb-2"
const sectionTitleClass = "text-lg font-black text-[#111] mb-6"

function NavItemEditor({ items, onChange, label }: { items: NavItem[]; onChange: (items: NavItem[]) => void; label: string }) {
  const update = (i: number, field: keyof NavItem, value: string) => {
    const next = items.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    onChange(next)
  }
  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="text" value={item.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Label" className={`${inputClass} flex-1`} />
          <input type="text" value={item.href} onChange={(e) => update(i, 'href', e.target.value)} placeholder="/link" className={`${inputClass} flex-1`} />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="p-3 border-3 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, { label: '', href: '' }])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Item</button>
    </div>
  )
}

function StatEditor({ stats, onChange }: { stats: StatItem[]; onChange: (stats: StatItem[]) => void }) {
  const update = (i: number, field: keyof StatItem, value: string | number) => {
    const next = stats.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
    onChange(next)
  }
  return (
    <div className="space-y-3">
      <label className={labelClass}>Stats</label>
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-2 p-3 border-2 border-[#111]/20 bg-white">
          <input type="number" value={s.value} onChange={(e) => update(i, 'value', Number(e.target.value))} placeholder="Value" className={`${inputClass} w-24`} />
          <input type="text" value={s.suffix} onChange={(e) => update(i, 'suffix', e.target.value)} placeholder="+" className={`${inputClass} w-16`} />
          <input type="text" value={s.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Label" className={`${inputClass} flex-1`} />
          <button onClick={() => onChange(stats.filter((_, idx) => idx !== i))} className="p-3 border-3 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...stats, { value: 0, suffix: '', label: '' }])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Stat</button>
    </div>
  )
}

function FeatureEditor({ features, onChange }: { features: FeatureItem[]; onChange: (features: FeatureItem[]) => void }) {
  const update = (i: number, field: keyof FeatureItem, value: string) => {
    const next = features.map((f, idx) => idx === i ? { ...f, [field]: value } : f)
    onChange(next)
  }
  return (
    <div className="space-y-4">
      <label className={labelClass}>Features</label>
      {features.map((f, i) => (
        <div key={i} className="p-4 border-2 border-[#111]/20 bg-white space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-[#111]/40">Feature #{i + 1}</span>
            <button onClick={() => onChange(features.filter((_, idx) => idx !== i))} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={f.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Title" className={inputClass} />
            <div className="flex items-center gap-2">
              <input type="color" value={f.color} onChange={(e) => update(i, 'color', e.target.value)} className="w-10 h-10 border-3 border-[#111] cursor-pointer p-0.5 flex-shrink-0" />
              <input type="text" value={f.color} onChange={(e) => update(i, 'color', e.target.value)} placeholder="#HEX" className={inputClass} />
            </div>
          </div>
          <textarea value={f.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} placeholder="Description" className={`${inputClass} resize-none`} />
          <input type="text" value={f.icon} onChange={(e) => update(i, 'icon', e.target.value)} placeholder="SVG path data" className={inputClass} />
        </div>
      ))}
      <button onClick={() => onChange([...features, { title: '', description: '', color: '#60A5FA', icon: '' }])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Feature</button>
    </div>
  )
}

function StepEditor({ steps, onChange }: { steps: StepItem[]; onChange: (steps: StepItem[]) => void }) {
  const update = (i: number, field: keyof StepItem, value: string) => {
    const next = steps.map((s, idx) => idx === i ? { ...s, [field]: value } : s)
    onChange(next)
  }
  return (
    <div className="space-y-3">
      <label className={labelClass}>Steps</label>
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-2 p-3 border-2 border-[#111]/20 bg-white">
          <input type="text" value={s.number} onChange={(e) => update(i, 'number', e.target.value)} placeholder="01" className={`${inputClass} w-16 text-center font-bold`} />
          <div className="flex-1 space-y-2">
            <input type="text" value={s.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Title" className={inputClass} />
            <textarea value={s.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} placeholder="Description" className={`${inputClass} resize-none`} />
          </div>
          <button onClick={() => onChange(steps.filter((_, idx) => idx !== i))} className="p-3 border-3 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...steps, { number: String(steps.length + 1).padStart(2, '0'), title: '', description: '' }])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Step</button>
    </div>
  )
}

function PlanEditor({ plans, onChange }: { plans: PlanFeature[]; onChange: (plans: PlanFeature[]) => void }) {
  const update = (i: number, field: keyof PlanFeature, value: any) => {
    const next = plans.map((p, idx) => idx === i ? { ...p, [field]: value } : p)
    onChange(next)
  }
  const updateFeature = (planIdx: number, featIdx: number, value: string) => {
    const next = plans.map((p, idx) => {
      if (idx !== planIdx) return p
      const f = [...p.features]
      f[featIdx] = value
      return { ...p, features: f }
    })
    onChange(next)
  }
  return (
    <div className="space-y-4">
      <label className={labelClass}>Plans</label>
      {plans.map((p, i) => (
        <div key={i} className="p-4 border-2 border-[#111]/20 bg-white space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-[#111]/40">Plan #{i + 1}</span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[#111]/60 cursor-pointer">
                <input type="checkbox" checked={p.popular} onChange={(e) => update(i, 'popular', e.target.checked)} className="w-4 h-4 accent-[#60A5FA]" />
                Popular
              </label>
              <button onClick={() => onChange(plans.filter((_, idx) => idx !== i))} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="text" value={p.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Name" className={inputClass} />
            <input type="text" value={p.price} onChange={(e) => update(i, 'price', e.target.value)} placeholder="Price" className={inputClass} />
            <input type="text" value={p.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Description" className={inputClass} />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#111]/40">Features</span>
            {p.features.map((f, fi) => (
              <div key={fi} className="flex items-center gap-2">
                <input type="text" value={f} onChange={(e) => updateFeature(i, fi, e.target.value)} placeholder="Feature" className={inputClass} />
                <button onClick={() => {
                  const next = plans.map((pl, pi) => pi === i ? { ...pl, features: pl.features.filter((_, idx) => idx !== fi) } : pl)
                  onChange(next)
                }} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button onClick={() => {
              const next = plans.map((pl, pi) => pi === i ? { ...pl, features: [...pl.features, ''] } : pl)
              onChange(next)
            }} className="text-xs text-[#60A5FA] font-bold hover:underline mt-1">+ Add feature</button>
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...plans, { name: '', price: '', description: '', features: [''], popular: false }])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Plan</button>
    </div>
  )
}

function SocialLinkEditor({ links, onChange }: { links: SocialLink[]; onChange: (links: SocialLink[]) => void }) {
  const update = (i: number, field: keyof SocialLink, value: string) => {
    const next = links.map((l, idx) => idx === i ? { ...l, [field]: value } : l)
    onChange(next)
  }
  return (
    <div className="space-y-2">
      <label className={labelClass}>Social Links</label>
      {links.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="text" value={l.platform} onChange={(e) => update(i, 'platform', e.target.value)} placeholder="Platform" className={`${inputClass} w-40`} />
          <input type="url" value={l.url} onChange={(e) => update(i, 'url', e.target.value)} placeholder="https://" className={`${inputClass} flex-1`} />
          <button onClick={() => onChange(links.filter((_, idx) => idx !== i))} className="p-3 border-3 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...links, { platform: '', url: '' }])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Social Link</button>
    </div>
  )
}

function ValueEditor({ values, onChange }: { values: ValueItem[]; onChange: (values: ValueItem[]) => void }) {
  const update = (i: number, field: keyof ValueItem, value: string) => {
    const next = values.map((v, idx) => idx === i ? { ...v, [field]: value } : v)
    onChange(next)
  }
  return (
    <div className="space-y-3">
      <label className={labelClass}>Company Values</label>
      {values.map((v, i) => (
        <div key={i} className="p-3 border-2 border-[#111]/20 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111]/40">Value #{i + 1}</span>
            <button onClick={() => onChange(values.filter((_, idx) => idx !== i))} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={v.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Title" className={inputClass} />
            <input type="text" value={v.icon} onChange={(e) => update(i, 'icon', e.target.value)} placeholder="SVG path" className={inputClass} />
          </div>
          <textarea value={v.description} onChange={(e) => update(i, 'description', e.target.value)} rows={2} placeholder="Description" className={`${inputClass} resize-none`} />
        </div>
      ))}
      <button onClick={() => onChange([...values, { title: '', description: '', icon: '' }])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Value</button>
    </div>
  )
}

function TeamEditor({ members, onChange }: { members: TeamMember[]; onChange: (members: TeamMember[]) => void }) {
  const update = (i: number, field: keyof TeamMember, value: string) => {
    const next = members.map((m, idx) => idx === i ? { ...m, [field]: value } : m)
    onChange(next)
  }
  return (
    <div className="space-y-3">
      <label className={labelClass}>Team Members</label>
      {members.map((m, i) => (
        <div key={i} className="p-3 border-2 border-[#111]/20 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111]/40">Member #{i + 1}</span>
            <button onClick={() => onChange(members.filter((_, idx) => idx !== i))} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" value={m.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Name" className={inputClass} />
            <input type="text" value={m.role} onChange={(e) => update(i, 'role', e.target.value)} placeholder="Role" className={inputClass} />
          </div>
          <textarea value={m.bio} onChange={(e) => update(i, 'bio', e.target.value)} rows={2} placeholder="Bio" className={`${inputClass} resize-none`} />
        </div>
      ))}
      <button onClick={() => onChange([...members, { name: '', role: '', bio: '' }])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Member</button>
    </div>
  )
}

function TimelineEditor({ items, onChange }: { items: TimelineItem[]; onChange: (items: TimelineItem[]) => void }) {
  const update = (i: number, field: keyof TimelineItem, value: string) => {
    const next = items.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
    onChange(next)
  }
  return (
    <div className="space-y-3">
      <label className={labelClass}>Timeline</label>
      {items.map((t, i) => (
        <div key={i} className="p-3 border-2 border-[#111]/20 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111]/40">Event #{i + 1}</span>
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input type="text" value={t.year} onChange={(e) => update(i, 'year', e.target.value)} placeholder="Year" className={inputClass} />
            <input type="text" value={t.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Title" className={`${inputClass} col-span-2`} />
          </div>
          <textarea value={t.desc} onChange={(e) => update(i, 'desc', e.target.value)} rows={2} placeholder="Description" className={`${inputClass} resize-none`} />
        </div>
      ))}
      <button onClick={() => onChange([...items, { year: '', title: '', desc: '' }])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Event</button>
    </div>
  )
}

function StringListEditor({ items, onChange, label }: { items: string[]; onChange: (items: string[]) => void; label: string }) {
  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="text" value={item} onChange={(e) => {
            const next = items.map((x, idx) => idx === i ? e.target.value : x)
            onChange(next)
          }} placeholder="Value" className={inputClass} />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="p-3 border-3 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])} className="doodle-btn-outline px-4 py-2 text-xs">+ Add {label}</button>
    </div>
  )
}

export default function AdminSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('header')
  const [toast, setToast] = useState('')

  useEffect(() => {
    setContent(getSiteContent())
  }, [])

  const save = (msg: string) => {
    if (!content) return
    updateSiteContent(() => content)
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  if (!content) return null

  const tabContent = (tab: TabId) => {
    switch (tab) {
      case 'header':
        return (
          <motion.div key="header" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={sectionTitleClass}>Header Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Logo Text</label>
                  <input type="text" value={content.header.logo} onChange={(e) => setContent({ ...content, header: { ...content.header, logo: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Logo Highlight</label>
                  <input type="text" value={content.header.logoHighlight} onChange={(e) => setContent({ ...content, header: { ...content.header, logoHighlight: e.target.value } })} className={inputClass} />
                </div>
              </div>
              <NavItemEditor items={content.header.navItems} onChange={(items) => setContent({ ...content, header: { ...content.header, navItems: items } })} label="Navigation Items" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CTA Text</label>
                  <input type="text" value={content.header.cta} onChange={(e) => setContent({ ...content, header: { ...content.header, cta: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CTA Link</label>
                  <input type="text" value={content.header.ctaLink} onChange={(e) => setContent({ ...content, header: { ...content.header, ctaLink: e.target.value } })} className={inputClass} />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => save('Header saved!')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Header</button>
            </div>
          </motion.div>
        )

      case 'hero':
        return (
          <motion.div key="hero" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={sectionTitleClass}>Hero Settings</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Badge</label>
                <input type="text" value={content.hero.badge} onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })} className={inputClass} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Headline Part 1</label>
                  <input type="text" value={content.hero.headline1} onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline1: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Headline Part 2</label>
                  <input type="text" value={content.hero.headline2} onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline2: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Headline Highlight</label>
                  <input type="text" value={content.hero.headlineHighlight} onChange={(e) => setContent({ ...content, hero: { ...content.hero, headlineHighlight: e.target.value } })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={content.hero.description} onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })} rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CTA 1 Text</label>
                  <input type="text" value={content.hero.cta1} onChange={(e) => setContent({ ...content, hero: { ...content.hero, cta1: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CTA 1 Link</label>
                  <input type="text" value={content.hero.cta1Link} onChange={(e) => setContent({ ...content, hero: { ...content.hero, cta1Link: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CTA 2 Text</label>
                  <input type="text" value={content.hero.cta2} onChange={(e) => setContent({ ...content, hero: { ...content.hero, cta2: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CTA 2 Link</label>
                  <input type="text" value={content.hero.cta2Link} onChange={(e) => setContent({ ...content, hero: { ...content.hero, cta2Link: e.target.value } })} className={inputClass} />
                </div>
              </div>
              <StatEditor stats={content.hero.stats} onChange={(stats) => setContent({ ...content, hero: { ...content.hero, stats } })} />
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => save('Hero saved!')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Hero</button>
            </div>
          </motion.div>
        )

      case 'footer':
        return (
          <motion.div key="footer" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={sectionTitleClass}>Footer Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Logo Text</label>
                  <input type="text" value={content.footer.logo} onChange={(e) => setContent({ ...content, footer: { ...content.footer, logo: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Logo Highlight</label>
                  <input type="text" value={content.footer.logoHighlight} onChange={(e) => setContent({ ...content, footer: { ...content.footer, logoHighlight: e.target.value } })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={content.footer.description} onChange={(e) => setContent({ ...content, footer: { ...content.footer, description: e.target.value } })} rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <input type="text" value={content.footer.tagline} onChange={(e) => setContent({ ...content, footer: { ...content.footer, tagline: e.target.value } })} className={inputClass} />
              </div>
              <NavItemEditor items={content.footer.quickLinks} onChange={(items) => setContent({ ...content, footer: { ...content.footer, quickLinks: items } })} label="Quick Links" />
              <StringListEditor items={content.footer.services} onChange={(items) => setContent({ ...content, footer: { ...content.footer, services: items } })} label="Services List" />
              <div>
                <label className={labelClass}>Copyright</label>
                <input type="text" value={content.footer.copyright} onChange={(e) => setContent({ ...content, footer: { ...content.footer, copyright: e.target.value } })} className={inputClass} />
              </div>
              <NavItemEditor items={content.footer.legalLinks} onChange={(items) => setContent({ ...content, footer: { ...content.footer, legalLinks: items } })} label="Legal Links" />
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => save('Footer saved!')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Footer</button>
            </div>
          </motion.div>
        )

      case 'contact':
        return (
          <motion.div key="contact" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={sectionTitleClass}>Contact Settings</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Heading</label>
                <input type="text" value={content.contact.heading} onChange={(e) => setContent({ ...content, contact: { ...content.contact, heading: e.target.value } })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Subtext</label>
                <textarea value={content.contact.subtext} onChange={(e) => setContent({ ...content, contact: { ...content.contact, subtext: e.target.value } })} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <StringListEditor items={content.contact.serviceOptions} onChange={(items) => setContent({ ...content, contact: { ...content.contact, serviceOptions: items } })} label="Service Options" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={content.contact.info.email} onChange={(e) => setContent({ ...content, contact: { ...content.contact, info: { ...content.contact.info, email: e.target.value } } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="text" value={content.contact.info.phone} onChange={(e) => setContent({ ...content, contact: { ...content.contact, info: { ...content.contact.info, phone: e.target.value } } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input type="text" value={content.contact.info.location} onChange={(e) => setContent({ ...content, contact: { ...content.contact, info: { ...content.contact.info, location: e.target.value } } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp URL</label>
                  <input type="url" value={content.contact.info.whatsapp} onChange={(e) => setContent({ ...content, contact: { ...content.contact, info: { ...content.contact.info, whatsapp: e.target.value } } })} className={inputClass} />
                </div>
              </div>
              <SocialLinkEditor links={content.contact.socialLinks} onChange={(socialLinks) => setContent({ ...content, contact: { ...content.contact, socialLinks } })} />
              <div>
                <label className={labelClass}>Maps Embed URL</label>
                <textarea value={content.contact.mapsEmbed} onChange={(e) => setContent({ ...content, contact: { ...content.contact, mapsEmbed: e.target.value } })} rows={3} className={`${inputClass} resize-none font-mono text-xs`} />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => save('Contact saved!')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Contact</button>
            </div>
          </motion.div>
        )

      case 'about':
        return (
          <motion.div key="about" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={sectionTitleClass}>About Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Label</label>
                  <input type="text" value={content.about.label} onChange={(e) => setContent({ ...content, about: { ...content.about, label: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Heading</label>
                  <input type="text" value={content.about.heading} onChange={(e) => setContent({ ...content, about: { ...content.about, heading: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Heading Highlight</label>
                  <input type="text" value={content.about.headingHighlight} onChange={(e) => setContent({ ...content, about: { ...content.about, headingHighlight: e.target.value } })} className={inputClass} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Paragraphs</label>
                {content.about.paragraphs.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <textarea value={p} onChange={(e) => {
                      const next = content.about.paragraphs.map((x, idx) => idx === i ? e.target.value : x)
                      setContent({ ...content, about: { ...content.about, paragraphs: next } })
                    }} rows={3} className={`${inputClass} resize-none flex-1`} />
                    <button onClick={() => {
                      const next = content.about.paragraphs.filter((_, idx) => idx !== i)
                      setContent({ ...content, about: { ...content.about, paragraphs: next } })
                    }} className="p-3 border-3 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button onClick={() => setContent({ ...content, about: { ...content.about, paragraphs: [...content.about.paragraphs, ''] } })} className="doodle-btn-outline px-4 py-2 text-xs">+ Add Paragraph</button>
              </div>
              <StatEditor stats={content.about.stats} onChange={(stats) => setContent({ ...content, about: { ...content.about, stats } })} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CTA Text</label>
                  <input type="text" value={content.about.cta} onChange={(e) => setContent({ ...content, about: { ...content.about, cta: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CTA Link</label>
                  <input type="text" value={content.about.ctaLink} onChange={(e) => setContent({ ...content, about: { ...content.about, ctaLink: e.target.value } })} className={inputClass} />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => save('About saved!')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save About</button>
            </div>
          </motion.div>
        )

      case 'whyChooseUs':
        return (
          <motion.div key="whyChooseUs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={sectionTitleClass}>Why Choose Us Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Label</label>
                  <input type="text" value={content.whyChooseUs.label} onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, label: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Heading</label>
                  <input type="text" value={content.whyChooseUs.heading} onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, heading: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Heading Highlight</label>
                  <input type="text" value={content.whyChooseUs.headingHighlight} onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, headingHighlight: e.target.value } })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Subtext</label>
                <textarea value={content.whyChooseUs.subtext} onChange={(e) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, subtext: e.target.value } })} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <FeatureEditor features={content.whyChooseUs.features} onChange={(features) => setContent({ ...content, whyChooseUs: { ...content.whyChooseUs, features } })} />
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => save('Why Choose Us saved!')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Why Choose Us</button>
            </div>
          </motion.div>
        )

      case 'pricing':
        return (
          <motion.div key="pricing" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={sectionTitleClass}>Pricing Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Label</label>
                  <input type="text" value={content.pricing.label} onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, label: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Heading</label>
                  <input type="text" value={content.pricing.heading} onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, heading: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Heading Highlight</label>
                  <input type="text" value={content.pricing.headingHighlight} onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, headingHighlight: e.target.value } })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Subtext</label>
                <textarea value={content.pricing.subtext} onChange={(e) => setContent({ ...content, pricing: { ...content.pricing, subtext: e.target.value } })} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <PlanEditor plans={content.pricing.plans} onChange={(plans) => setContent({ ...content, pricing: { ...content.pricing, plans } })} />
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => save('Pricing saved!')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Pricing</button>
            </div>
          </motion.div>
        )

      case 'process':
        return (
          <motion.div key="process" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={sectionTitleClass}>Process Settings</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Label</label>
                  <input type="text" value={content.process.label} onChange={(e) => setContent({ ...content, process: { ...content.process, label: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Heading</label>
                  <input type="text" value={content.process.heading} onChange={(e) => setContent({ ...content, process: { ...content.process, heading: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Heading Highlight</label>
                  <input type="text" value={content.process.headingHighlight} onChange={(e) => setContent({ ...content, process: { ...content.process, headingHighlight: e.target.value } })} className={inputClass} />
                </div>
              </div>
              <StepEditor steps={content.process.steps} onChange={(steps) => setContent({ ...content, process: { ...content.process, steps } })} />
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => save('Process saved!')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Process</button>
            </div>
          </motion.div>
        )

      case 'newsletter':
        return (
          <motion.div key="newsletter" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={sectionTitleClass}>Newsletter Settings</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Heading</label>
                <input type="text" value={content.newsletter.heading} onChange={(e) => setContent({ ...content, newsletter: { ...content.newsletter, heading: e.target.value } })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Subtext</label>
                <textarea value={content.newsletter.subtext} onChange={(e) => setContent({ ...content, newsletter: { ...content.newsletter, subtext: e.target.value } })} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Placeholder</label>
                  <input type="text" value={content.newsletter.placeholder} onChange={(e) => setContent({ ...content, newsletter: { ...content.newsletter, placeholder: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Button Text</label>
                  <input type="text" value={content.newsletter.buttonText} onChange={(e) => setContent({ ...content, newsletter: { ...content.newsletter, buttonText: e.target.value } })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Success Message</label>
                  <input type="text" value={content.newsletter.successMessage} onChange={(e) => setContent({ ...content, newsletter: { ...content.newsletter, successMessage: e.target.value } })} className={inputClass} />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => save('Newsletter saved!')} className="doodle-btn-accent px-6 py-2.5 text-sm">Save Newsletter</button>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#111]">Site Content</h1>
        <p className="text-[#111]/60 text-sm mt-1">Edit all website content in one place</p>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all border-3 border-[#111] whitespace-nowrap ${
              activeTab === tab.id ? 'bg-[#60A5FA] text-[#111]' : 'bg-white text-[#111]/60 hover:bg-[#60A5FA]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="doodle-card p-6 md:p-8">
        {tabContent(activeTab)}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 doodle-btn-accent px-6 py-3 text-sm font-bold shadow-[4px_4px_0_#111] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
