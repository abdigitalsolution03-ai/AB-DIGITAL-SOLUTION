import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiCalendar, FiUser, FiBriefcase } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { getCollection, create, update, remove, formatCurrency } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, SearchInput, EmptyState, ConfirmDialog, ProgressBar } from '@/components/ui'
import type { Column } from '@/components/ui'

interface Deal {
  id: string
  name: string
  company: string
  companyId: string
  contact: string
  contactId: string
  amount: number
  stage: string
  probability: number
  expectedCloseDate: string
  owner: string
  leadSource: string
  type: string
  notes: string
  createdAt: string
}

const emptyDeal = {
  name: '', company: '', companyId: '', contact: '', contactId: '',
  amount: 0, stage: 'prospecting', probability: 10,
  expectedCloseDate: '', owner: '', leadSource: 'website',
  type: 'new-business', notes: '',
}

const stageOptions = [
  { value: 'prospecting', label: 'Prospecting' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'needs-analysis', label: 'Needs Analysis' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed-won', label: 'Closed Won' },
  { value: 'closed-lost', label: 'Closed Lost' },
]

const stageBadgeVariant: Record<string, string> = {
  prospecting: 'info', qualification: 'info', 'needs-analysis': 'warning',
  proposal: 'warning', negotiation: 'warning', 'closed-won': 'success',
  'closed-lost': 'danger',
}

const stageProbabilities: Record<string, number> = {
  prospecting: 10, qualification: 20, 'needs-analysis': 40,
  proposal: 60, negotiation: 80, 'closed-won': 100, 'closed-lost': 0,
}

const typeOptions = [
  { value: 'new-business', label: 'New Business' },
  { value: 'existing-business', label: 'Existing Business' },
  { value: 'upsell', label: 'Upsell' },
  { value: 'renewal', label: 'Renewal' },
]

export default function CRMDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState('')
  const [filterOwner, setFilterOwner] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(emptyDeal)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = () => {
    setDeals(getCollection('deals'))
    setCompanies(getCollection('companies'))
    setContacts(getCollection('contacts'))
    setUsers(getCollection('users'))
  }

  useEffect(loadData, [])

  const filtered = deals.filter(d => {
    const matchSearch = !search || `${d.name} ${d.company}`.toLowerCase().includes(search.toLowerCase())
    const matchStage = !filterStage || d.stage === filterStage
    const matchOwner = !filterOwner || d.owner === filterOwner
    return matchSearch && matchStage && matchOwner
  })

  const totalValue = deals.reduce((sum, d) => sum + (d.stage !== 'closed-lost' ? d.amount : 0), 0)
  const wonValue = deals.filter(d => d.stage === 'closed-won').reduce((sum, d) => sum + d.amount, 0)

  const openAdd = () => {
    setForm(emptyDeal)
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (d: Deal) => {
    setForm({
      name: d.name, company: d.company, companyId: d.companyId,
      contact: d.contact, contactId: d.contactId, amount: d.amount,
      stage: d.stage, probability: d.probability,
      expectedCloseDate: d.expectedCloseDate?.split('T')[0] || '',
      owner: d.owner, leadSource: d.leadSource, type: d.type, notes: d.notes,
    })
    setEditingId(d.id)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...form,
      probability: stageProbabilities[form.stage] ?? form.probability,
    }
    if (editingId) {
      update('deals', editingId, data)
    } else {
      create('deals', data)
    }
    setModalOpen(false)
    loadData()
  }

  const handleDelete = () => {
    if (deleteId) {
      remove('deals', deleteId)
      setDeleteId(null)
      loadData()
    }
  }

  const columns: Column<Deal>[] = [
    { key: 'name', header: 'Deal Name', render: (d) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-semibold text-gold-500">
          <FiDollarSign size={16} />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{d.name}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{d.company || '-'}</p>
        </div>
      </div>
    )},
    { key: 'amount', header: 'Amount', sortable: true, render: (d) => (
      <span className="text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(d.amount)}</span>
    )},
    { key: 'stage', header: 'Stage', render: (d) => (
      <Badge variant={(stageBadgeVariant[d.stage] || 'default') as any}>{d.stage}</Badge>
    )},
    { key: 'probability', header: 'Probability', render: (d) => (
      <div className="w-24">
        <ProgressBar value={d.probability} size="sm" color={d.probability >= 60 ? 'green' : d.probability >= 30 ? 'gold' : 'royal'} />
      </div>
    )},
    { key: 'expectedCloseDate', header: 'Expected Close', render: (d) => (
      <span className="text-sm text-[var(--text-tertiary)] flex items-center gap-1">
        <FiCalendar size={13} /> {d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString() : '-'}
      </span>
    )},
    { key: 'owner', header: 'Owner', render: (d) => {
      const u = users.find((u: any) => u.id === d.owner)
      return <span className="text-sm text-[var(--text-secondary)]">{u?.name || 'Unassigned'}</span>
    }},
    { key: 'type', header: 'Type', render: (d) => <Badge size="sm">{d.type}</Badge> },
    { key: 'actions', header: 'Actions', render: (d) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(d)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"><FiEdit2 size={14} /></button>
        <button onClick={() => setDeleteId(d.id)} className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-tertiary)] hover:text-red-500 transition-colors"><FiTrash2 size={14} /></button>
      </div>
    )},
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Deals</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Track your sales pipeline and deals</p>
        </div>
        <Button variant="primary" size="md" icon={<FiPlus />} onClick={openAdd}>Add Deal</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="premium-card p-4">
          <p className="text-xs text-[var(--text-tertiary)] mb-1">Total Pipeline Value</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">{deals.length} deals</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="premium-card p-4">
          <p className="text-xs text-[var(--text-tertiary)] mb-1">Won Revenue</p>
          <p className="text-2xl font-bold text-green-500">{formatCurrency(wonValue)}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">{deals.filter(d => d.stage === 'closed-won').length} closed won</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-4">
          <p className="text-xs text-[var(--text-tertiary)] mb-1">Avg Deal Size</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {deals.filter(d => d.stage !== 'closed-lost').length > 0
              ? formatCurrency(Math.round(totalValue / deals.filter(d => d.stage !== 'closed-lost').length))
              : formatCurrency(0)}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">per active deal</p>
        </motion.div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Search deals..." className="flex-1" />
          <Select options={stageOptions} placeholder="All Stages" value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className="w-full sm:w-44" />
          <Select options={users.map((u: any) => ({ value: u.id, label: u.name }))} placeholder="All Owners" value={filterOwner} onChange={(e) => setFilterOwner(e.target.value)} className="w-full sm:w-40" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiDollarSign size={36} />}
            title="No deals found"
            description={search || filterStage || filterOwner ? 'Try adjusting your filters' : 'Add your first deal to get started'}
            action={!search && !filterStage && !filterOwner ? { label: 'Add Deal', onClick: openAdd } : undefined}
          />
        ) : (
          <Table columns={columns} data={filtered} keyExtractor={(d) => d.id} pageSize={10} />
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Deal' : 'Add Deal'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Deal Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Company" options={companies.map((c: any) => ({ value: c.id, label: c.name }))} value={form.companyId} onChange={(e) => {
              const comp = companies.find((c: any) => c.id === e.target.value)
              setForm({...form, companyId: e.target.value, company: comp?.name || ''})
            }} placeholder="Select Company" />
            <Select label="Contact" options={contacts.map((c: any) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))} value={form.contactId} onChange={(e) => {
              const con = contacts.find((c: any) => c.id === e.target.value)
              setForm({...form, contactId: e.target.value, contact: con ? `${con.firstName} ${con.lastName}` : ''})
            }} placeholder="Select Contact" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount (₹)" type="number" min={0} value={form.amount} onChange={(e) => setForm({...form, amount: parseInt(e.target.value) || 0})} required />
            <Select label="Stage" options={stageOptions} value={form.stage} onChange={(e) => setForm({...form, stage: e.target.value, probability: stageProbabilities[e.target.value] || 0})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Probability (%)" type="number" min={0} max={100} value={form.probability} onChange={(e) => setForm({...form, probability: parseInt(e.target.value) || 0})} />
            <Input label="Expected Close Date" type="date" value={form.expectedCloseDate} onChange={(e) => setForm({...form, expectedCloseDate: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Owner" options={users.map((u: any) => ({ value: u.id, label: u.name }))} value={form.owner} onChange={(e) => setForm({...form, owner: e.target.value})} placeholder="Unassigned" />
            <Select label="Type" options={typeOptions} value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} />
          </div>
          <Select label="Lead Source" options={[
            { value: 'website', label: 'Website' }, { value: 'referral', label: 'Referral' },
            { value: 'social-media', label: 'Social Media' }, { value: 'cold-call', label: 'Cold Call' },
            { value: 'email-campaign', label: 'Email Campaign' }, { value: 'partner', label: 'Partner' },
            { value: 'other', label: 'Other' },
          ]} value={form.leadSource} onChange={(e) => setForm({...form, leadSource: e.target.value})} />
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-input min-h-[80px]" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{editingId ? 'Update' : 'Create'} Deal</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
