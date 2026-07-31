import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { Card, Button, Modal, Input, EmptyState, ConfirmDialog } from '@/components/ui'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  order: number
  status: 'published' | 'draft'
  socialLinks: { platform: string; url: string }[]
}

export default function AdminTeam() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', role: '', bio: '', image: '', socialLinks: '' })

  const load = () => {
    const stored = localStorage.getItem('cms_db')
    if (stored) {
      try { const db = JSON.parse(stored); setItems(db.team || []) } catch { setItems([]) }
    }
  }

  const saveItems = (data: TeamMember[]) => {
    const stored = localStorage.getItem('cms_db')
    if (stored) {
      try { const db = JSON.parse(stored); db.team = data; localStorage.setItem('cms_db', JSON.stringify(db)) } catch { /* ignore */ }
    }
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm({ name: '', role: '', bio: '', image: '', socialLinks: '' }); setShowModal(true) }
  const openEdit = (item: TeamMember) => {
    setEditing(item)
    setForm({
      name: item.name, role: item.role, bio: item.bio, image: item.image,
      socialLinks: (item.socialLinks || []).map(s => `${s.platform}:${s.url}`).join('\n'),
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    const data: TeamMember = {
      id: editing?.id || Date.now().toString(36),
      name: form.name, role: form.role, bio: form.bio, image: form.image,
      order: editing?.order ?? items.length,
      status: 'published',
      socialLinks: form.socialLinks.split('\n').filter(Boolean).map(s => {
        const [platform, ...rest] = s.split(':')
        return { platform: platform.trim(), url: rest.join(':').trim() }
      }),
    }
    if (editing) saveItems(items.map(i => i.id === editing.id ? data : i))
    else saveItems([...items, data])
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Team</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage team members</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiPlus />} onClick={openCreate}>Add Member</Button>
      </div>
      <Card>
        {items.length === 0 ? (
          <EmptyState title="No team members" description="Add your first team member" action={<Button variant="primary" size="sm" onClick={openCreate}>Add Member</Button>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map(member => (
              <div key={member.id} className="p-4 rounded-xl bg-[var(--bg-secondary)] group relative text-center">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">{member.name?.charAt(0)}</div>
                )}
                <p className="text-sm font-medium text-[var(--text-primary)]">{member.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{member.role}</p>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" icon={<FiEdit2 />} onClick={() => openEdit(member)} />
                  <Button variant="ghost" size="sm" icon={<FiTrash2 />} onClick={() => setDeleteId(member.id)} className="text-red-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Member' : 'New Member'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Input label="Role" value={form.role} onChange={v => setForm({ ...form, role: v })} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm" />
          </div>
          <Input label="Image URL" value={form.image} onChange={v => setForm({ ...form, image: v })} />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Social Links (one per line, format: platform:url)</label>
            <textarea value={form.socialLinks} onChange={e => setForm({ ...form, socialLinks: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] outline-none focus:border-blue-500 text-sm font-mono" placeholder="linkedin:https://linkedin.com/in/username&#10;twitter:https://twitter.com/username" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onConfirm={() => { if (deleteId) { saveItems(items.filter(i => i.id !== deleteId)); setDeleteId(null) } }} onCancel={() => setDeleteId(null)} title="Delete Member?" message="This cannot be undone." confirmLabel="Delete" variant="danger" />
    </div>
  )
}
