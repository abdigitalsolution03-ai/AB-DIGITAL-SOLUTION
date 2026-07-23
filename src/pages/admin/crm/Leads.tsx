import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiUserPlus, FiPhone, FiMail, FiStar } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { getCollection, create, update, remove } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, SearchInput, EmptyState, ConfirmDialog } from '@/components/ui'
import type { Column } from '@/components/ui'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  source: string
  status: string
  score: number
  assignedTo: string
  followUpDate: string
  notes: string
  createdAt: string
}

const emptyLead = {
  firstName: '', lastName: '', email: '', phone: '', company: '',
  jobTitle: '', source: 'website', status: 'new', score: 0,
  assignedTo: '', followUpDate: '', notes: '',
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'cold-call', label: 'Cold Call' },
  { value: 'email-campaign', label: 'Email Campaign' },
  { value: 'partner', label: 'Partner' },
  { value: 'other', label: 'Other' },
]

const statusBadge: Record<string, string> = {
  new: 'info', contacted: 'info', qualified: 'warning',
  proposal: 'warning', negotiation: 'warning', won: 'success', lost: 'danger',
}

export default function CRMLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(emptyLead)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = () => {
    setLeads(getCollection('leads'))
    setUsers(getCollection('users'))
  }

  useEffect(loadData, [])

  const filtered = leads.filter(l => {
    const matchSearch = !search || `${l.firstName} ${l.lastName} ${l.email} ${l.company}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || l.status === filterStatus
    const matchSource = !filterSource || l.source === filterSource
    return matchSearch && matchStatus && matchSource
  })

  const stats = [
    { label: 'Total', value: leads.length, color: 'royal' as const },
    { label: 'New', value: leads.filter(l => l.status === 'new').length, color: 'info' as any },
    { label: 'Contacted', value: leads.filter(l => l.status === 'contacted').length, color: 'info' as any },
    { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, color: 'warning' as any },
    { label: 'Proposal', value: leads.filter(l => l.status === 'proposal').length, color: 'warning' as any },
    { label: 'Negotiation', value: leads.filter(l => l.status === 'negotiation').length, color: 'warning' as any },
    { label: 'Won', value: leads.filter(l => l.status === 'won').length, color: 'success' as any },
    { label: 'Lost', value: leads.filter(l => l.status === 'lost').length, color: 'danger' as any },
  ]

  const openAdd = () => {
    setForm(emptyLead)
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (lead: Lead) => {
    setForm({
      firstName: lead.firstName, lastName: lead.lastName, email: lead.email,
      phone: lead.phone, company: lead.company, jobTitle: lead.jobTitle,
      source: lead.source, status: lead.status, score: lead.score,
      assignedTo: lead.assignedTo, followUpDate: lead.followUpDate?.split('T')[0] || '', notes: lead.notes,
    })
    setEditingId(lead.id)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      update('leads', editingId, form)
    } else {
      create('leads', form)
    }
    setModalOpen(false)
    loadData()
  }

  const handleDelete = () => {
    if (deleteId) {
      remove('leads', deleteId)
      setDeleteId(null)
      loadData()
    }
  }

  const getUserName = (id: string) => {
    const u = users.find((u: any) => u.id === id)
    return u ? u.name : 'Unassigned'
  }

  const columns: Column<Lead>[] = [
    { key: 'name', header: 'Name', render: (l) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-semibold text-[var(--text-primary)]">
          {l.firstName?.[0]}{l.lastName?.[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{l.firstName} {l.lastName}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{l.jobTitle}</p>
        </div>
      </div>
    )},
    { key: 'company', header: 'Company', render: (l) => <span className="text-sm text-[var(--text-secondary)]">{l.company || '-'}</span> },
    { key: 'email', header: 'Email', render: (l) => (
      <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
        <FiMail size={13} className="text-[var(--text-tertiary)]" /> {l.email}
      </span>
    )},
    { key: 'phone', header: 'Phone', render: (l) => (
      <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
        <FiPhone size={13} className="text-[var(--text-tertiary)]" /> {l.phone || '-'}
      </span>
    )},
    { key: 'source', header: 'Source', render: (l) => <Badge size="sm">{l.source}</Badge> },
    { key: 'status', header: 'Status', render: (l) => (
      <Badge variant={(statusBadge[l.status] || 'default') as any}>{l.status}</Badge>
    )},
    { key: 'score', header: 'Score', sortable: true, render: (l) => (
      <span className="flex items-center gap-1 text-sm font-semibold text-gold-500">
        <FiStar size={13} className="fill-current" /> {l.score || 0}
      </span>
    )},
    { key: 'assignedTo', header: 'Assigned To', render: (l) => (
      <span className="text-sm text-[var(--text-secondary)]">{getUserName(l.assignedTo)}</span>
    )},
    { key: 'followUpDate', header: 'Follow-up', render: (l) => (
      <span className="text-sm text-[var(--text-tertiary)]">{l.followUpDate ? new Date(l.followUpDate).toLocaleDateString() : '-'}</span>
    )},
    { key: 'actions', header: 'Actions', render: (l) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(l)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"><FiEdit2 size={14} /></button>
        <button onClick={() => setDeleteId(l.id)} className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-tertiary)] hover:text-red-500 transition-colors"><FiTrash2 size={14} /></button>
      </div>
    )},
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Leads</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage and track your sales leads</p>
        </div>
        <Button variant="primary" size="md" icon={<FiPlus />} onClick={openAdd}>Add Lead</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="premium-card p-3 text-center">
            <p className="text-xl font-bold text-[var(--text-primary)]">{s.value}</p>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Search leads..." className="flex-1" />
          <Select options={statusOptions} placeholder="All Statuses" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full sm:w-40" />
          <Select options={sourceOptions} placeholder="All Sources" value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="w-full sm:w-40" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiUsers size={36} />}
            title="No leads found"
            description={search || filterStatus || filterSource ? 'Try adjusting your filters' : 'Add your first lead to get started'}
            action={!search && !filterStatus && !filterSource ? { label: 'Add Lead', onClick: openAdd } : undefined}
          />
        ) : (
          <Table columns={columns} data={filtered} keyExtractor={(l) => l.id} pageSize={10} />
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Lead' : 'Add Lead'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} required />
            <Input label="Last Name" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} />
            <Input label="Job Title" value={form.jobTitle} onChange={(e) => setForm({...form, jobTitle: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Source" options={sourceOptions} value={form.source} onChange={(e) => setForm({...form, source: e.target.value})} />
            <Select label="Status" options={statusOptions} value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Score" type="number" min={0} max={100} value={form.score} onChange={(e) => setForm({...form, score: parseInt(e.target.value) || 0})} />
            <Select label="Assigned To" options={users.map((u: any) => ({ value: u.id, label: u.name }))} value={form.assignedTo} onChange={(e) => setForm({...form, assignedTo: e.target.value})} placeholder="Unassigned" />
          </div>
          <Input label="Follow-up Date" type="date" value={form.followUpDate} onChange={(e) => setForm({...form, followUpDate: e.target.value})} />
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-input min-h-[80px]" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{editingId ? 'Update' : 'Create'} Lead</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
