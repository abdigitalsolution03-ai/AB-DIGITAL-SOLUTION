import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi'
import { getAll, create, update, remove, type Testimonial } from '@/services/cms'
import { Card, Button, Modal, Input, Badge, EmptyState, ConfirmDialog } from '@/components/ui'

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', role: '', company: '', content: '', avatar: '', rating: 5, status: 'published' as const })

  useEffect(() => { setItems(getAll('testimonials')) }, [])

  const refresh = () => setItems(getAll('testimonials'))

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', role: '', company: '', content: '', avatar: '', rating: 5, status: 'published' })
    setShowModal(true)
  }

  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({ name: item.name, role: item.role, company: item.company, content: item.content, avatar: item.avatar, rating: item.rating, status: item.status })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.content.trim()) return
    if (editing) {
      update('testimonials', editing.id, form)
    } else {
      create('testimonials', form)
    }
    setShowModal(false)
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Testimonials</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage client testimonials</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>New Testimonial</Button>
      </div>
      <Card>
        {items.length === 0 ? (
          <EmptyState title="No testimonials" description="Add your first testimonial" action={<Button variant="primary" size="sm" onClick={openCreate}>Add Testimonial</Button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-[var(--bg-secondary)] group relative">
                <div className="flex items-center gap-3 mb-2">
                  {item.avatar && <img src={item.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />}
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{item.role}{item.company ? ` · ${item.company}` : ''}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] italic">&ldquo;{item.content}&rdquo;</p>
                <div className="flex items-center gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={12} className={i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--text-tertiary)]'} />
                  ))}
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(item)} />
                  <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(item.id)} className="text-red-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Testimonial' : 'New Testimonial'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Input label="Role" value={form.role} onChange={v => setForm({ ...form, role: v })} />
          <Input label="Company" value={form.company} onChange={v => setForm({ ...form, company: v })} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
          <Input label="Avatar URL" value={form.avatar} onChange={v => setForm({ ...form, avatar: v })} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Rating ({form.rating}/5)</label>
            <input type="range" min={1} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) })} className="w-full" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { remove('testimonials', deleteId); setDeleteId(null); refresh() } }} onCancel={() => setDeleteId(null)} title="Delete Testimonial?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}
