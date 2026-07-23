import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiFileText } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, EmptyState, ConfirmDialog } from '@/components/ui'

interface Policy {
  id: string
  title: string
  content: string
  category: string
  status: 'active' | 'draft' | 'archived'
}

const initialForm: Policy = { title: '', content: '', category: 'HR', status: 'active' }

const categories = [
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
  { value: 'IT', label: 'IT' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Compliance', label: 'Compliance' },
  { value: 'General', label: 'General' },
]

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>(() => store.getCollection<any>('policies').map(mapPol))
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [deleteTarget, setDeleteTarget] = useState<Policy | null>(null)

  const filtered = useMemo(() => {
    return policies.filter(p => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase())
      const matchCat = !catFilter || p.category === catFilter
      return matchSearch && matchCat
    })
  }, [policies, search, catFilter])

  function openAdd() {
    setForm(initialForm)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(policy: Policy) {
    setForm({ title: policy.title, content: policy.content, category: policy.category, status: policy.status })
    setEditingId(policy.id)
    setShowModal(true)
  }

  function handleSave() {
    if (!form.title || !form.content) return
    if (editingId) {
      store.update('policies', editingId, form)
      setPolicies(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p))
    } else {
      const created = store.create<any>('policies', form)
      setPolicies(prev => [...prev, { ...form, id: created.id }])
    }
    setShowModal(false)
    setForm(initialForm)
  }

  function handleDelete() {
    if (!deleteTarget) return
    store.delete('policies', deleteTarget.id)
    setPolicies(prev => prev.filter(p => p.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Company Policies</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage organizational policies and guidelines</p>
        </div>
        <Button icon={<FiPlus />} onClick={openAdd}>Add Policy</Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search policies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<FiFileText />}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[
                { value: '', label: 'All Categories' },
                ...categories,
              ]}
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiFileText size={36} />}
            title={search || catFilter ? 'No policies match your filters' : 'No policies yet'}
            description={search || catFilter ? 'Try adjusting your filters' : 'Create your first policy'}
            action={(!search && !catFilter) ? { label: 'Add Policy', onClick: openAdd } : undefined}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((policy, i) => {
              const isExpanded = expandedId === policy.id
              return (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="premium-card overflow-hidden"
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : policy.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--royal-blue)]">
                          <FiFileText size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{policy.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="info" size="sm">{policy.category}</Badge>
                            <Badge
                              variant={policy.status === 'active' ? 'success' : policy.status === 'draft' ? 'warning' : 'default'}
                              size="sm"
                            >
                              {policy.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <Button size="sm" variant="ghost" icon={<FiEdit2 />}
                          onClick={e => { e.stopPropagation(); openEdit(policy) }} />
                        <Button size="sm" variant="ghost" icon={<FiTrash2 />}
                          onClick={e => { e.stopPropagation(); setDeleteTarget(policy) }} className="text-red-500" />
                        <button className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                          {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                        </button>
                      </div>
                    </div>
                    {!isExpanded && (
                      <p className="text-sm text-[var(--text-tertiary)] mt-3 line-clamp-2">{policy.content}</p>
                    )}
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[var(--border-color)]"
                      >
                        <div className="p-5">
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{policy.content}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Policy' : 'Add Policy'} size="lg">
        <div className="space-y-4">
          <Input label="Policy Title" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categories}
              value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
            />
            <Select
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' },
              ]}
              value={form.status}
              onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}
            />
          </div>
          <div>
            <label className="form-label">Policy Content</label>
            <textarea
              className="form-input min-h-[200px] resize-y"
              value={form.content}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write the full policy content here..."
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'} Policy</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Policy"
        message={`Are you sure you want to delete ${deleteTarget?.title}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}

function mapPol(raw: any): Policy {
  return {
    id: raw.id,
    title: raw.title || '',
    content: raw.content || raw.description || '',
    category: raw.category || 'General',
    status: raw.status || 'active',
  }
}
