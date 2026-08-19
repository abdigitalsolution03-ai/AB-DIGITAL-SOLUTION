import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { getAll, create, update, remove } from '@/services/cms'
import { Card, Button, Modal, Input, Badge, EmptyState, ConfirmDialog } from '@/components/ui'
import { iconByName } from '@/components/ServiceIcon'

interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  category: string
  status: 'published' | 'draft'
  displayOrder: number
}

const CATEGORIES = ['Marketing', 'Advertising', 'Development', 'Creative', 'Other']

export default function AdminServices() {
  const [items, setItems] = useState<ServiceItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ServiceItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [form, setForm] = useState({ title: '', description: '', icon: '', category: 'Marketing', status: 'published' as const })

  const refresh = () => setItems(getAll('services'))

  useEffect(() => { refresh() }, [])

  const filtered = items
    .filter(i => filter === 'all' || i.status === filter)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

  const counts = {
    published: items.filter(i => i.status === 'published').length,
    draft: items.filter(i => i.status === 'draft').length,
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', description: '', icon: '', category: 'Marketing', status: 'published' })
    setShowModal(true)
  }

  const openEdit = (item: ServiceItem) => {
    setEditing(item)
    setForm({ title: item.title, description: item.description, icon: item.icon, category: item.category || 'Marketing', status: item.status || 'published' })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const data = {
      title: form.title,
      description: form.description,
      icon: form.icon,
      category: form.category,
      status: form.status,
      slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }
    if (editing) {
      update('services', editing.id, data)
    } else {
      create('services', { ...data, displayOrder: items.length })
    }
    setShowModal(false)
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Services</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">{items.length} services · {counts.published} published · {counts.draft} drafts</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>New Service</Button>
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
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title={items.length === 0 ? 'No services' : 'Nothing found'} description="Add your first service" action={<Button variant="primary" size="sm" onClick={openCreate}>Add Service</Button>} />
        ) : (
          <div className="space-y-2">
            {filtered.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 text-lg shrink-0">
                  {iconByName(item.icon) || '○'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{item.category || 'General'} · {item.description?.slice(0, 60) || 'No description'}{item.description?.length > 60 ? '…' : ''}</p>
                </div>
                <Badge variant={item.status === 'published' ? 'success' : 'default'}>{item.status || 'draft'}</Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.status === 'published' && <Button variant="ghost" size="sm" icon={<FiEye />} onClick={() => window.open('/services', '_blank')} />}
                  <Button variant="ghost" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(item)} />
                  <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(item.id)} className="text-red-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Service' : 'New Service'}>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Icon (emoji or text)" value={form.icon} onChange={v => setForm({ ...form, icon: v })} />
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none text-sm">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { remove('services', deleteId); setDeleteId(null); refresh() } }} onCancel={() => setDeleteId(null)} title="Delete Service?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}