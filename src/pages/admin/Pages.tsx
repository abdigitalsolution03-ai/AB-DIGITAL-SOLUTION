import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface PageSection {
  id: string
  type: 'hero' | 'text' | 'image' | 'cta' | 'features' | 'gallery'
  content: string
}

interface SitePage {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  lastModified: string
  sections: PageSection[]
}

const sectionTypes = ['hero', 'text', 'image', 'cta', 'features', 'gallery'] as const

const defaultSections: PageSection[] = [
  { id: crypto.randomUUID?.() || Date.now().toString(), type: 'hero', content: '' },
  { id: crypto.randomUUID?.() || (Date.now() + 1).toString(), type: 'text', content: '' },
]

export default function AdminPages() {
  const [pages, setPages] = useState<SitePage[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<SitePage | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', slug: '' })
  const [sections, setSections] = useState<PageSection[]>(defaultSections)
  const [editingSections, setEditingSections] = useState(false)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('adminPages') || '[]')
    setPages(data)
  }, [])

  const saveToLocal = (data: SitePage[]) => {
    localStorage.setItem('adminPages', JSON.stringify(data))
    setPages(data)
  }

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', slug: '' })
    setSections(defaultSections.map((s) => ({ ...s, id: Date.now().toString() + Math.random(), content: '' })))
    setEditingSections(false)
    setShowModal(true)
  }

  const openEdit = (page: SitePage) => {
    setEditing(page)
    setForm({ title: page.title, slug: page.slug })
    setSections(page.sections.length > 0 ? page.sections : defaultSections.map((s) => ({ ...s, id: Date.now().toString() + Math.random(), content: '' })))
    setEditingSections(true)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    let updated: SitePage[]
    if (editing) {
      updated = pages.map((p) =>
        p.id === editing.id
          ? { ...p, title: form.title, slug: form.slug || slugify(form.title), lastModified: new Date().toISOString(), sections }
          : p
      )
    } else {
      const newPage: SitePage = {
        id: Date.now().toString(),
        title: form.title,
        slug: form.slug || slugify(form.title),
        status: 'draft',
        lastModified: new Date().toISOString(),
        sections,
      }
      updated = [newPage, ...pages]
    }
    saveToLocal(updated)
    setShowModal(false)
    setEditing(null)
    setEditingSections(false)
  }

  const toggleStatus = (id: string) => {
    const updated = pages.map((p) =>
      p.id === id ? { ...p, status: p.status === 'published' ? 'draft' as const : 'published' as const, lastModified: new Date().toISOString() } : p
    )
    saveToLocal(updated)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    saveToLocal(pages.filter((p) => p.id !== deleteId))
    setDeleteId(null)
  }

  const duplicatePage = (page: SitePage) => {
    const newPage: SitePage = {
      id: Date.now().toString(),
      title: page.title + ' (Copy)',
      slug: page.slug + '-copy',
      status: 'draft',
      lastModified: new Date().toISOString(),
      sections: page.sections.map((s) => ({ ...s, id: Date.now().toString() + Math.random() })),
    }
    saveToLocal([newPage, ...pages])
  }

  const addSection = () => {
    const newSection: PageSection = {
      id: Date.now().toString() + Math.random(),
      type: 'text',
      content: '',
    }
    setSections([...sections, newSection])
  }

  const removeSection = (id: string) => {
    if (sections.length <= 1) return
    setSections(sections.filter((s) => s.id !== id))
  }

  const updateSection = (id: string, field: Partial<PageSection>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...field } : s)))
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    const updated = [...sections]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setSections(updated)
  }

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return
    const updated = [...sections]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setSections(updated)
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch {
      return iso
    }
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Pages</h1>
          <p className="text-[#111]/60 text-sm mt-1">Manage all site pages and their content</p>
        </div>
        <button onClick={openAdd} className="doodle-btn-accent px-5 py-2.5 text-sm">
          Add Page
        </button>
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111]">
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Page Name</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Slug</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Last Modified</th>
                <th className="text-right text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#111]/40 text-sm">No pages yet. Click "Add Page" to create one.</td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="border-b border-[#111]/10 hover:bg-[#60A5FA]/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#60A5FA] border-2 border-[#111] flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-bold text-[#111]">{page.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-[#111]/60 bg-[#60A5FA]/20 px-2 py-1 border-2 border-[#111]/30 font-mono">/{page.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleStatus(page.id)} className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 border-[#111] text-xs font-bold transition-all ${page.status === 'published' ? 'bg-[#4D7AFF] text-white' : 'bg-[#60A5FA] text-[#111]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${page.status === 'published' ? 'bg-white' : 'bg-[#111]'}`} />
                        {page.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60">{formatDate(page.lastModified)}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => duplicatePage(page)} title="Duplicate page" className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button onClick={() => openEdit(page)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteId(page.id)} className="p-2 border-2 border-[#111] text-[#111]/40 hover:bg-[#FF4D4D] hover:text-white transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-3xl doodle-card p-6 md:p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-black text-[#111] mb-6">{editing ? `Edit Page: ${editing.title}` : 'Add Page'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Page Title</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="Page title" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Slug</label>
                    <div className="flex items-center">
                      <span className="px-3 py-3 bg-[#60A5FA] border-3 border-r-0 border-[#111] text-[#111] text-sm font-bold">/</span>
                      <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none" placeholder="page-slug" />
                    </div>
                  </div>
                </div>

                {editingSections && (
                  <div className="border-t-3 border-[#111] pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-md font-black text-[#111]">Content Sections</h3>
                      <button onClick={addSection} className="px-3 py-1.5 border-2 border-[#111] text-[#111]/60 text-xs font-bold hover:bg-[#60A5FA] transition-all">
                        + Add Section
                      </button>
                    </div>
                    <div className="space-y-4">
                      {sections.map((section, index) => (
                        <motion.div key={section.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 border-3 border-[#111] bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#111]/40 uppercase">Section {index + 1}</span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => moveSectionUp(index)} disabled={index === 0} className="p-1 border border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                                <button onClick={() => moveSectionDown(index)} disabled={index === sections.length - 1} className="p-1 border border-[#111] text-[#111]/40 hover:bg-[#60A5FA] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select value={section.type} onChange={(e) => updateSection(section.id, { type: e.target.value as PageSection['type'] })} className="px-3 py-1.5 bg-white border-2 border-[#111] text-[#111] text-xs font-bold focus:outline-none">
                                {sectionTypes.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                              </select>
                              <button onClick={() => removeSection(section.id)} disabled={sections.length <= 1} className="p-1.5 border-2 border-[#111] text-[#FF4D4D] hover:bg-[#FF4D4D] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <textarea value={section.content} onChange={(e) => updateSection(section.id, { content: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none resize-none font-mono text-sm" placeholder={`Content for ${section.type} section...`} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-3 mt-6 border-t-3 border-[#111] pt-6">
                {!editingSections && editing && (
                  <button onClick={() => setEditingSections(true)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#60A5FA] transition-all">
                    Manage Sections
                  </button>
                )}
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#60A5FA] transition-all">Cancel</button>
                <button onClick={handleSave} className="doodle-btn-accent px-5 py-2.5 text-sm">{editing ? 'Save Changes' : 'Create Page'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-sm doodle-card p-6 md:p-8 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-[#FF4D4D] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_#111]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#111] mb-2">Delete Page</h3>
              <p className="text-[#111]/60 text-sm mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#60A5FA] transition-all">Cancel</button>
                <button onClick={confirmDelete} className="px-5 py-2.5 bg-[#FF4D4D] border-3 border-[#111] text-white font-bold text-sm shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

