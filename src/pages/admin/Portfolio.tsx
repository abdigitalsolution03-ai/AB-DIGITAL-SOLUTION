import { useState, useEffect, useMemo, useRef } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiImage, FiInstagram, FiYoutube } from 'react-icons/fi'
import { getAll, create, update, remove, seedPortfolioIfEmpty } from '@/services/cms'
import { Card, Button, Modal, Input, Badge, EmptyState, ConfirmDialog } from '@/components/ui'
import MediaPicker from '@/components/admin/MediaPicker'

const CATEGORIES = ['Social Media', 'Video Editing', 'Ads', 'Design', 'SEO', 'Web Development']

interface PortfolioItem {
  id: string
  title: string
  category: string
  description: string
  image: string
  videoUrl: string
  videoThumb: string
  channelAvatar: string
  instagramUrl: string
  clientName: string
  results: string
  displayOrder: number
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

function toMetrics(results: string): string[] {
  return results.split('\n').map(r => r.trim()).filter(Boolean)
}

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [pickerField, setPickerField] = useState<'image' | 'videoThumb' | 'channelAvatar' | null>(null)
  const [form, setForm] = useState({
    title: '', category: 'Social Media', description: '', image: '', videoUrl: '',
    videoThumb: '', channelAvatar: '', instagramUrl: '', clientName: '', results: '',
    displayOrder: 0, status: 'published' as const,
  })

  useEffect(() => {
    seedPortfolioIfEmpty()
    refresh()
  }, [])

  const refresh = () => setItems(getAll<PortfolioItem>('portfolio'))

  const allCategories = useMemo(() => {
    const set = new Set<string>(CATEGORIES)
    items.forEach(i => set.add(i.category))
    return [...set]
  }, [items])

  const filtered = useMemo(() => {
    let list = items
    if (filter !== 'all') list = list.filter(i => i.status === filter)
    if (categoryFilter !== 'all') list = list.filter(i => i.category === categoryFilter)
    return [...list].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  }, [items, filter, categoryFilter])

  const counts = useMemo(() => ({
    published: items.filter(i => i.status === 'published').length,
    draft: items.filter(i => i.status === 'draft').length,
  }), [items])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', category: 'Social Media', description: '', image: '', videoUrl: '', videoThumb: '', channelAvatar: '', instagramUrl: '', clientName: '', results: '', displayOrder: items.length, status: 'published' })
    setShowModal(true)
  }

  const openEdit = (item: PortfolioItem) => {
    setEditing(item)
    setForm({
      title: item.title, category: item.category || 'Social Media', description: item.description || '',
      image: item.image || '', videoUrl: item.videoUrl || '', videoThumb: item.videoThumb || '',
      channelAvatar: item.channelAvatar || '', instagramUrl: item.instagramUrl || '',
      clientName: item.clientName || '', results: item.results || '', displayOrder: item.displayOrder || 0,
      status: item.status || 'published',
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const data = {
      title: form.title, category: form.category, description: form.description,
      image: form.image, videoUrl: form.videoUrl, videoThumb: form.videoThumb,
      channelAvatar: form.channelAvatar, instagramUrl: form.instagramUrl,
      clientName: form.clientName, results: form.results,
      displayOrder: form.displayOrder, status: form.status,
    }
    if (editing) {
      update('portfolio', editing.id, data)
    } else {
      create('portfolio', data)
    }
    setShowModal(false)
    refresh()
  }

  const thumbFor = (item: PortfolioItem) => item.videoThumb || item.image

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Portfolio</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">{items.length} projects · {counts.published} published · {counts.draft} drafts</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>New Project</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['all', 'published', 'draft'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
              filter === s
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-[var(--border-primary)] text-[var(--text-tertiary)] hover:border-blue-300'
            }`}
          >
            {s} {s !== 'all' && `(${counts[s]})`}
          </button>
        ))}
        {allCategories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[var(--border-primary)] text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] outline-none focus:border-blue-500 ml-auto"
          >
            <option value="all">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title={items.length === 0 ? 'No projects' : 'Nothing found'} description="Showcase your work — add a project" action={<Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>New Project</Button>} />
        ) : (
          <div className="space-y-2">
            {filtered.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-secondary)] group">
                {thumbFor(item) ? (
                  <img src={thumbFor(item)} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0"><FiImage size={16} /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{item.category}{item.clientName ? ` · ${item.clientName}` : ''}{item.results ? ` · ${toMetrics(item.results).length} results` : ''}</p>
                </div>
                <div className="hidden md:flex items-center gap-1.5 shrink-0">
                  {item.instagramUrl && <FiInstagram size={13} className="text-pink-500" />}
                  {item.videoUrl && <FiYoutube size={13} className="text-red-500" />}
                </div>
                <Badge variant={item.status === 'published' ? 'success' : 'default'}>{item.status}</Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {item.status === 'published' && <Button variant="ghost" size="sm" icon={<FiEye />} onClick={() => window.open('/portfolio', '_blank')} />}
                  <Button variant="ghost" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(item)} />
                  <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(item.id)} className="text-red-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Project' : 'New Project'} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input label="Project Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm">
                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input label="Client Name" value={form.clientName} onChange={v => setForm({ ...form, clientName: v })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1 flex items-center justify-between">
              <span>Project Image</span>
              <Button variant="outline" size="xs" icon={<FiImage />} onClick={() => setPickerField('image')}>Browse Media</Button>
            </label>
            <div className="flex items-center gap-3">
              {form.image && <img src={form.image} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />}
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Paste image URL or browse media" className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Client YouTube Link" value={form.videoUrl} onChange={v => setForm({ ...form, videoUrl: v })} placeholder="https://youtube.com/…" />
            <Input label="Client Instagram Link" value={form.instagramUrl} onChange={v => setForm({ ...form, instagramUrl: v })} placeholder="https://instagram.com/…" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1 flex items-center justify-between">
                <span>Video Thumbnail</span>
                <Button variant="outline" size="xs" icon={<FiImage />} onClick={() => setPickerField('videoThumb')}>Browse Media</Button>
              </label>
              <div className="flex items-center gap-3">
                {form.videoThumb && <img src={form.videoThumb} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />}
                <input value={form.videoThumb} onChange={e => setForm({ ...form, videoThumb: e.target.value })} placeholder="i.ytimg.com thumbnail URL" className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1 flex items-center justify-between">
                <span>Channel Logo</span>
                <Button variant="outline" size="xs" icon={<FiImage />} onClick={() => setPickerField('channelAvatar')}>Browse Media</Button>
              </label>
              <div className="flex items-center gap-3">
                {form.channelAvatar && <img src={form.channelAvatar} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />}
                <input value={form.channelAvatar} onChange={e => setForm({ ...form, channelAvatar: e.target.value })} placeholder="yt3.googleusercontent.com URL" className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Results (one per line — shows as highlight tags)</label>
            <textarea value={form.results} onChange={e => setForm({ ...form, results: e.target.value })} rows={3} placeholder={'Instagram Management\nPost Design\nContent Calendar'} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Display Order" type="number" value={String(form.displayOrder)} onChange={v => setForm({ ...form, displayOrder: parseInt(v) || 0 })} />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      <MediaPicker
        open={pickerField !== null}
        onClose={() => setPickerField(null)}
        onSelect={url => {
          if (pickerField) setForm(prev => ({ ...prev, [pickerField]: url }))
          setPickerField(null)
        }}
      />

      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { remove('portfolio', deleteId); setDeleteId(null); refresh() } }} onCancel={() => setDeleteId(null)} title="Delete Project?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}