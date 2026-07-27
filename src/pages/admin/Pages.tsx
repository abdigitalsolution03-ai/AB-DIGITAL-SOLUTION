import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiEye, FiChevronUp, FiChevronDown, FiExternalLink, FiSettings } from 'react-icons/fi'
import { getAll, create, update, remove, type Page } from '@/services/cms'
import { Card, Button, Modal, Input, EmptyState, ConfirmDialog } from '@/components/ui'
import { pageRegistry, getSectionDefinition } from '@/services/pageRegistry'
import PageEditor from './PageEditor'

const editSections = [
  { label: 'Hero Section', path: '/admin/hero', desc: 'Homepage hero (title, subtitle, CTA, image)' },
  { label: 'Header', path: '/admin/header', desc: 'Logo, navigation menu, CTA button, announcement bar' },
  { label: 'Footer', path: '/admin/footer', desc: 'Footer columns, links, social, contact, copyright' },
  { label: 'Services', path: '/admin/services', desc: 'Service cards with features and pricing' },
  { label: 'Blog', path: '/admin/blog', desc: 'Blog posts with categories, tags, SEO' },
  { label: 'Media Library', path: '/admin/media', desc: 'Upload images, videos, PDFs, documents' },
  { label: 'Testimonials', path: '/admin/testimonials', desc: 'Client testimonials with ratings' },
  { label: 'FAQ', path: '/admin/faq', desc: 'Frequently asked questions' },
  { label: 'Team', path: '/admin/team', desc: 'Team members with social links' },
  { label: 'Theme', path: '/admin/theme', desc: 'Colors, fonts, animations, custom CSS' },
  { label: 'Branding', path: '/admin/branding', desc: 'Logos, company info, social links' },
  { label: 'SEO', path: '/admin/seo', desc: 'Meta tags, analytics, custom head code' },
  { label: 'Subscribers', path: '/admin/subscribers', desc: 'Newsletter email list' },
  { label: 'Enquiries', path: '/admin/enquiries', desc: 'Contact form submissions' },
  { label: 'Settings', path: '/admin/settings', desc: 'Maintenance mode, custom code, backup' },
]

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Page | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [tab, setTab] = useState<'builtin' | 'custom' | 'sections'>('builtin')
  const [form, setForm] = useState({ title: '', slug: '', content: '', status: 'published' as const, seo: { title: '', description: '', keywords: '' } })
  const [editingPageRoute, setEditingPageRoute] = useState<string | null>(null)

  useEffect(() => { setPages(getAll('pages')) }, [])

  const refresh = () => setPages(getAll('pages'))

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', slug: '', content: '', status: 'published', seo: { title: '', description: '', keywords: '' } })
    setShowModal(true)
  }

  const openEdit = (page: Page) => {
    setEditing(page)
    setForm({ title: page.title, slug: page.slug, content: page.content, status: page.status, seo: page.seo || { title: '', description: '', keywords: '' } })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (editing) {
      update('pages', editing.id, { ...form, slug })
    } else {
      create('pages', { ...form, slug, sections: [], order: pages.length })
    }
    setShowModal(false)
    refresh()
  }

  const handleDelete = () => {
    if (deleteId) { remove('pages', deleteId); setDeleteId(null); refresh() }
  }

  const handleDuplicate = (page: Page) => {
    create('pages', { ...page, title: page.title + ' (Copy)', slug: page.slug + '-copy', id: undefined, createdAt: undefined, updatedAt: undefined })
    refresh()
  }

  const movePage = (id: string, dir: number) => {
    const sorted = [...pages].sort((a, b) => (a.order || 0) - (b.order || 0))
    const idx = sorted.findIndex(p => p.id === id)
    if (idx === -1 || (dir === -1 && idx === 0) || (dir === 1 && idx === sorted.length - 1)) return
    const temp = sorted[idx].order
    sorted[idx].order = sorted[idx + dir].order
    sorted[idx + dir].order = temp
    sorted.forEach(p => update('pages', p.id, { order: p.order }))
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Website Pages</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">All pages across your website</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>New Custom Page</Button>
      </div>

      <div className="flex gap-1.5 mb-6 overflow-x-auto">
        <button onClick={() => setTab('builtin')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === 'builtin' ? 'bg-blue-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}>Built-in Pages</button>
        <button onClick={() => setTab('custom')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === 'custom' ? 'bg-blue-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}>Custom Pages ({pages.length})</button>
        <button onClick={() => setTab('sections')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === 'sections' ? 'bg-blue-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}>All Edit Sections</button>
      </div>

      {tab === 'builtin' && (
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pageRegistry.map((reg, i) => {
              const sectionNames = reg.sections.map(s => getSectionDefinition(s.type).name)
              return (
                <motion.div
                  key={reg.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-blue-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{reg.name}</h3>
                    <div className="flex gap-1">
                      <a href={reg.route} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]">
                        <FiExternalLink size={14} />
                      </a>
                      <button onClick={() => setEditingPageRoute(reg.route)} className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10">
                        <FiEdit2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">/{reg.route}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">{reg.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {sectionNames.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{s}</span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      )}

      {tab === 'custom' && (
        <Card>
          {pages.length === 0 ? (
            <EmptyState title="No custom pages" description="Create a new page with the page builder" action={<Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>Create Page</Button>} />
          ) : (
            <div className="space-y-2">
              {pages.sort((a, b) => (a.order || 0) - (b.order || 0)).map(page => (
                <div key={page.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] group">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => movePage(page.id, -1)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><FiChevronUp size={14} /></button>
                    <button onClick={() => movePage(page.id, 1)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"><FiChevronDown size={14} /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{page.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">/{page.slug} · {page.status}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" icon={<FiEye />} onClick={() => window.open('/' + page.slug, '_blank')} />
                    <Button variant="ghost" size="sm" icon={<FiCopy />} onClick={() => handleDuplicate(page)} />
                    <Button variant="ghost" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(page)} />
                    <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(page.id)} className="text-red-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'sections' && (
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {editSections.map((sec, i) => (
              <Link key={sec.path} to={sec.path}
                className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-blue-500/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">{sec.label}</h3>
                  <FiSettings size={14} className="text-[var(--text-tertiary)] group-hover:text-blue-500" />
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">{sec.desc}</p>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Page' : 'New Page'}>
        <div className="space-y-4">
          <Input label="Page Title" value={form.title} onChange={v => { setForm({ ...form, title: v }); if (!editing && !form.slug) setForm(prev => ({ ...prev, title: v, slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })) }} placeholder="Enter page title" />
          <Input label="URL Slug" value={form.slug} onChange={v => setForm({ ...form, slug: v })} placeholder="page-url-slug" />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" placeholder="Page content (HTML or plain text)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="border-t border-[var(--border-primary)] pt-4">
            <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-3">SEO</p>
            <Input label="Meta Title" value={form.seo.title || ''} onChange={v => setForm({ ...form, seo: { ...form.seo, title: v } })} />
            <div className="mt-3">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Meta Description</label>
              <textarea value={form.seo.description || ''} onChange={e => setForm({ ...form, seo: { ...form.seo, description: e.target.value } })} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
            </div>
            <div className="mt-3">
              <Input label="Keywords" value={form.seo.keywords || ''} onChange={v => setForm({ ...form, seo: { ...form.seo, keywords: v } })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} title="Delete Page?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
      {editingPageRoute && (
        <PageEditor route={editingPageRoute} onClose={() => setEditingPageRoute(null)} />
      )}
    </div>
  )
}
