import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiEye, FiClock, FiX, FiChevronDown, FiChevronUp, FiPlus, FiTrash2, FiRefreshCw } from 'react-icons/fi'
import { Button, Modal, Input, ConfirmDialog } from '@/components/ui'
import { getPageData, savePageSections, savePageSEO, savePageStatus, addRevision, getAllPageData } from '@/services/cms'
import { pageRegistry, getSectionDefinition, type SectionType } from '@/services/pageRegistry'

interface PageEditorProps {
  route: string
  onClose: () => void
}

export default function PageEditor({ route, onClose }: PageEditorProps) {
  const reg = pageRegistry.find(p => p.route === route)
  const [data, setData] = useState(getPageData(route))
  const [sections, setSections] = useState<Record<string, any>>({})
  const [seoOpen, setSeoOpen] = useState(false)
  const [seoForm, setSeoForm] = useState({ title: '', description: '', keywords: '', ogImage: '', canonicalUrl: '', schema: '' })
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [tab, setTab] = useState<'sections' | 'seo' | 'revisions'>('sections')
  const [status, setStatus] = useState<string>('published')
  const [saved, setSaved] = useState(false)
  const [revisionLabel, setRevisionLabel] = useState('')

  useEffect(() => {
    const d = getPageData(route)
    setData(d)
    if (d) {
      setSections(JSON.parse(JSON.stringify(d.sections)))
      setSeoForm({ ...d.seo })
      setStatus(d.status)
    }
  }, [route])

  if (!reg || !data) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex items-center justify-center">
        <p className="text-[var(--text-tertiary)]">Page not registered: {route}</p>
      </div>
    )
  }

  const handleFieldChange = (sectionType: string, fieldKey: string, value: any) => {
    setSections(prev => ({
      ...prev,
      [sectionType]: { ...prev[sectionType], [fieldKey]: value },
    }))
    setSaved(false)
  }

  const handleRepeaterAdd = (sectionType: string, fieldKey: string) => {
    const def = getSectionDefinition(sectionType as SectionType)
    const field = def.fields.find(f => f.key === fieldKey)
    if (!field?.fields) return
    const item: Record<string, any> = {}
    for (const f of field.fields) {
      item[f.key] = f.default ?? ''
    }
    setSections(prev => ({
      ...prev,
      [sectionType]: {
        ...prev[sectionType],
        [fieldKey]: [...(prev[sectionType]?.[fieldKey] || []), item],
      },
    }))
    setSaved(false)
  }

  const handleRepeaterRemove = (sectionType: string, fieldKey: string, index: number) => {
    setSections(prev => ({
      ...prev,
      [sectionType]: {
        ...prev[sectionType],
        [fieldKey]: prev[sectionType][fieldKey].filter((_: any, i: number) => i !== index),
      },
    }))
    setSaved(false)
  }

  const handleRepeaterFieldChange = (sectionType: string, fieldKey: string, index: number, subKey: string, value: any) => {
    setSections(prev => {
      const items = [...(prev[sectionType]?.[fieldKey] || [])]
      items[index] = { ...items[index], [subKey]: value }
      return { ...prev, [sectionType]: { ...prev[sectionType], [fieldKey]: items } }
    })
    setSaved(false)
  }

  const handleSave = () => {
    savePageSections(route, sections)
    savePageSEO(route, seoForm)
    savePageStatus(route, status as 'published' | 'draft')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCreateRevision = () => {
    if (!revisionLabel.trim()) return
    addRevision(route, revisionLabel)
    setRevisionLabel('')
    setData(getPageData(route))
  }

  const handleRestoreRevision = (revData: string) => {
    const parsed = JSON.parse(revData)
    setSections(parsed)
    setSaved(false)
  }

  const renderField = (sectionType: string, field: any) => {
    const value = sections[sectionType]?.[field.key]

    switch (field.type) {
      case 'text':
        return (
          <Input
            label={field.label}
            value={value ?? ''}
            onChange={v => handleFieldChange(sectionType, field.key, v)}
            placeholder={field.placeholder}
          />
        )
      case 'textarea':
      case 'richtext':
        return (
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{field.label}</label>
            <textarea
              value={value ?? ''}
              onChange={e => handleFieldChange(sectionType, field.key, e.target.value)}
              rows={field.type === 'richtext' ? 8 : 3}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono"
              placeholder={field.placeholder}
            />
          </div>
        )
      case 'image':
        return (
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{field.label}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={value ?? ''}
                onChange={e => handleFieldChange(sectionType, field.key, e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
                placeholder="Image URL"
              />
              {value && (
                <img src={value} alt="" className="w-12 h-12 rounded-lg object-cover border border-[var(--border-primary)]" />
              )}
            </div>
          </div>
        )
      case 'color':
        return (
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{field.label}</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={value || '#000000'}
                onChange={e => handleFieldChange(sectionType, field.key, e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={value ?? ''}
                onChange={e => handleFieldChange(sectionType, field.key, e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        )
      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{field.label}</label>
            <input
              type="number"
              value={value ?? 0}
              onChange={e => handleFieldChange(sectionType, field.key, parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )
      case 'boolean':
        return (
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={e => handleFieldChange(sectionType, field.key, e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border-primary)] text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-[var(--text-primary)]">{field.label}</span>
          </label>
        )
      case 'select':
        return (
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">{field.label}</label>
            <select
              value={value ?? ''}
              onChange={e => handleFieldChange(sectionType, field.key, e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm"
            >
              {field.options?.map((opt: { label: string; value: string }) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )
      case 'repeater':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">{field.label}</label>
              <button
                onClick={() => handleRepeaterAdd(sectionType, field.key)}
                className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400"
              >
                <FiPlus size={12} /> Add {field.label}
              </button>
            </div>
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[var(--text-tertiary)]">Item {idx + 1}</span>
                    <button
                      onClick={() => handleRepeaterRemove(sectionType, field.key, idx)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {field.fields?.map((subField: any) => (
                      <div key={subField.key}>
                        {renderRepeaterField(sectionType, field.key, idx, subField, item)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(value || []).length === 0 && (
                <p className="text-xs text-[var(--text-tertiary)]">No items yet. Click "{field.label}" to add one.</p>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderRepeaterField = (sectionType: string, fieldKey: string, index: number, subField: any, item: any) => {
    const val = item[subField.key]
    switch (subField.type) {
      case 'text':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{subField.label}</label>
            <input
              type="text"
              value={val ?? ''}
              onChange={e => handleRepeaterFieldChange(sectionType, fieldKey, index, subField.key, e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )
      case 'textarea':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{subField.label}</label>
            <textarea
              value={val ?? ''}
              onChange={e => handleRepeaterFieldChange(sectionType, fieldKey, index, subField.key, e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )
      case 'image':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{subField.label}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={val ?? ''}
                onChange={e => handleRepeaterFieldChange(sectionType, fieldKey, index, subField.key, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
                placeholder="URL"
              />
              {val && <img src={val} alt="" className="w-10 h-10 rounded-lg object-cover border border-[var(--border-primary)]" />}
            </div>
          </div>
        )
      case 'number':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{subField.label}</label>
            <input
              type="number"
              value={val ?? 0}
              onChange={e => handleRepeaterFieldChange(sectionType, fieldKey, index, subField.key, parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
            />
          </div>
        )
      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!val}
              onChange={e => handleRepeaterFieldChange(sectionType, fieldKey, index, subField.key, e.target.checked)}
              className="w-3.5 h-3.5 rounded"
            />
            <span className="text-xs text-[var(--text-primary)]">{subField.label}</span>
          </label>
        )
      case 'select':
        return (
          <div>
            <label className="block text-xs text-[var(--text-tertiary)] mb-0.5">{subField.label}</label>
            <select
              value={val ?? ''}
              onChange={e => handleRepeaterFieldChange(sectionType, fieldKey, index, subField.key, e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm"
            >
              {subField.options?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] overflow-hidden flex flex-col">
      <header className="sticky top-0 z-10 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
            <FiX size={18} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">{reg.name}</h2>
            <p className="text-xs text-[var(--text-tertiary)]">/{reg.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-xs outline-none"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <a
            href={route}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
          >
            <FiEye size={14} /> Preview
          </a>
          <Button variant="primary" size="sm" icon={<FiSave />} onClick={handleSave}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </header>

      <div className="flex border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 lg:px-6">
        <button onClick={() => setTab('sections')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === 'sections' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}>
          Sections
        </button>
        <button onClick={() => setTab('seo')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === 'seo' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}>
          SEO & Meta
        </button>
        <button onClick={() => setTab('revisions')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === 'revisions' ? 'border-blue-500 text-blue-500' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}>
          Revisions
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 lg:p-6">
          {tab === 'sections' && (
            <div className="space-y-4">
              {reg.sections.map((sec, i) => {
                const def = getSectionDefinition(sec.type)
                const isOpen = activeSection === sec.type
                return (
                  <motion.div
                    key={sec.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveSection(isOpen ? null : sec.type)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 font-medium text-xs">
                          {i + 1}
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{def.name}</h3>
                          <p className="text-xs text-[var(--text-tertiary)]">{def.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOpen ? <FiChevronUp size={16} className="text-[var(--text-tertiary)]" /> : <FiChevronDown size={16} className="text-[var(--text-tertiary)]" />}
                      </div>
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className="border-t border-[var(--border-primary)]"
                      >
                        <div className="p-4 space-y-4">
                          {def.fields.map(field => (
                            <div key={field.key}>
                              {renderField(sec.type, field)}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}

          {tab === 'seo' && (
            <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">SEO & Meta Settings</h3>
              <Input label="Meta Title" value={seoForm.title} onChange={v => setSeoForm({ ...seoForm, title: v })} placeholder="Page title for search engines" />
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Meta Description</label>
                <textarea value={seoForm.description} onChange={e => setSeoForm({ ...seoForm, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" placeholder="Page description for search results" />
              </div>
              <Input label="Keywords" value={seoForm.keywords} onChange={v => setSeoForm({ ...seoForm, keywords: v })} placeholder="keyword1, keyword2, keyword3" />
              <Input label="OG Image URL" value={seoForm.ogImage} onChange={v => setSeoForm({ ...seoForm, ogImage: v })} placeholder="https://..." />
              <Input label="Canonical URL" value={seoForm.canonicalUrl} onChange={v => setSeoForm({ ...seoForm, canonicalUrl: v })} placeholder="https://yourdomain.com/page" />
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">JSON-LD Schema</label>
                <textarea value={seoForm.schema} onChange={e => setSeoForm({ ...seoForm, schema: e.target.value })} rows={6} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono" placeholder="Paste structured data markup here" />
              </div>
            </div>
          )}

          {tab === 'revisions' && (
            <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">Revision History</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={revisionLabel}
                  onChange={e => setRevisionLabel(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm"
                  placeholder="Label for this revision (e.g. 'Updated hero text')"
                />
                <Button variant="primary" size="sm" icon={<FiPlus />} onClick={handleCreateRevision}>Save Snapshot</Button>
              </div>
              <div className="space-y-2">
                {(data.revisions || []).length === 0 && (
                  <p className="text-sm text-[var(--text-tertiary)] text-center py-8">No revisions saved yet.</p>
                )}
                {(data.revisions || []).map((rev, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)]">
                    <div className="flex items-center gap-3">
                      <FiClock size={14} className="text-[var(--text-tertiary)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{rev.label}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{rev.timestamp}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestoreRevision(rev.data)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    >
                      <FiRefreshCw size={12} /> Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
