import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Card, Button, Modal, Input, EmptyState, ConfirmDialog } from '@/components/ui'

interface ServiceItem {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  price: string
  slug: string
}

export default function AdminServices() {
  const [items, setItems] = useState<ServiceItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ServiceItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', icon: '', features: '', price: '', slug: '' })

  const load = () => {
    try { setItems(JSON.parse(localStorage.getItem('cms_services') || '[]')) } catch { setItems([]) }
  }

  useEffect(() => { load() }, [])

  const save = (data: ServiceItem[]) => {
    localStorage.setItem('cms_services', JSON.stringify(data))
    load()
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', description: '', icon: '', features: '', price: '', slug: '' })
    setShowModal(true)
  }

  const openEdit = (item: ServiceItem) => {
    setEditing(item)
    setForm({ title: item.title, description: item.description, icon: item.icon, features: item.features.join('\n'), price: item.price, slug: item.slug })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    const data: ServiceItem = {
      id: editing?.id || Date.now().toString(36),
      title: form.title,
      description: form.description,
      icon: form.icon,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      price: form.price,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }
    if (editing) {
      save(items.map(i => i.id === editing.id ? data : i))
    } else {
      save([...items, data])
    }
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Services</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage services</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>New Service</Button>
      </div>
      <Card>
        {items.length === 0 ? (
          <EmptyState title="No services" description="Add your first service" action={<Button variant="primary" size="sm" onClick={openCreate}>Add Service</Button>} />
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 text-lg shrink-0">
                  {item.icon || '○'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{item.features.length} features · {item.price || 'No price'}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
          <Input label="Icon (emoji or text)" value={form.icon} onChange={v => setForm({ ...form, icon: v })} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Features (one per line)</label>
            <textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
          <Input label="Price" value={form.price} onChange={v => setForm({ ...form, price: v })} placeholder="$999" />
          <Input label="URL Slug" value={form.slug} onChange={v => setForm({ ...form, slug: v })} placeholder="web-development" />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { save(items.filter(i => i.id !== deleteId)); setDeleteId(null) } }} onCancel={() => setDeleteId(null)} title="Delete Service?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}
