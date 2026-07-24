import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { getAll, create, update, remove, type FAQ } from '@/services/cms'
import { Card, Button, Modal, Input, EmptyState, ConfirmDialog } from '@/components/ui'

export default function AdminFAQ() {
  const [items, setItems] = useState<FAQ[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ question: '', answer: '', category: '', status: 'published' as const })

  useEffect(() => { setItems(getAll('faqs')) }, [])

  const refresh = () => setItems(getAll('faqs'))

  const openCreate = () => {
    setEditing(null)
    setForm({ question: '', answer: '', category: '', status: 'published' })
    setShowModal(true)
  }

  const openEdit = (item: FAQ) => {
    setEditing(item)
    setForm({ question: item.question, answer: item.answer, category: item.category, status: item.status })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.question.trim() || !form.answer.trim()) return
    if (editing) {
      update('faqs', editing.id, form)
    } else {
      create('faqs', { ...form, order: items.length })
    }
    setShowModal(false)
    refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">FAQ</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage frequently asked questions</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>New FAQ</Button>
      </div>
      <Card>
        {items.length === 0 ? (
          <EmptyState title="No FAQs" description="Add your first FAQ" action={<Button variant="primary" size="sm" onClick={openCreate}>Add FAQ</Button>} />
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.question}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-2">{item.answer}</p>
                  {item.category && <span className="text-[10px] text-[var(--text-tertiary)] mt-1 inline-block bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">{item.category}</span>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(item)} />
                  <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(item.id)} className="text-red-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit FAQ' : 'New FAQ'}>
        <div className="space-y-4">
          <Input label="Question" value={form.question} onChange={v => setForm({ ...form, question: v })} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Answer</label>
            <textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
          <Input label="Category" value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="General, Pricing, Support..." />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { remove('faqs', deleteId); setDeleteId(null); refresh() } }} onCancel={() => setDeleteId(null)} title="Delete FAQ?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}
