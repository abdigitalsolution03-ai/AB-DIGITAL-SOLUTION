import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiPhone, FiMail, FiUser, FiUsers } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { getCollection, create, update, remove } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, SearchInput, EmptyState, ConfirmDialog } from '@/components/ui'
import type { Column } from '@/components/ui'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  mobile: string
  company: string
  companyId: string
  jobTitle: string
  department: string
  source: string
  type: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  notes: string
  createdAt: string
}

const emptyContact = {
  firstName: '', lastName: '', email: '', phone: '', mobile: '',
  company: '', companyId: '', jobTitle: '', department: '',
  source: 'referral', type: 'individual', address: '', city: '',
  state: '', zip: '', country: '', notes: '',
}

const typeOptions = [
  { value: 'individual', label: 'Individual' },
  { value: 'decision-maker', label: 'Decision Maker' },
  { value: 'influencer', label: 'Influencer' },
  { value: 'partner', label: 'Partner' },
  { value: 'vendor', label: 'Vendor' },
]

const sourceOptions = [
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'event', label: 'Event' },
  { value: 'cold-call', label: 'Cold Call' },
  { value: 'email-campaign', label: 'Email Campaign' },
  { value: 'other', label: 'Other' },
]

export default function CRMContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterCompany, setFilterCompany] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(emptyContact)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = () => {
    setContacts(getCollection('contacts'))
    setCompanies(getCollection('companies'))
  }

  useEffect(loadData, [])

  const filtered = contacts.filter(c => {
    const matchSearch = !search || `${c.firstName} ${c.lastName} ${c.email} ${c.company}`.toLowerCase().includes(search.toLowerCase())
    const matchType = !filterType || c.type === filterType
    const matchCompany = !filterCompany || c.companyId === filterCompany
    return matchSearch && matchType && matchCompany
  })

  const openAdd = () => {
    setForm(emptyContact)
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (c: Contact) => {
    setForm({
      firstName: c.firstName, lastName: c.lastName, email: c.email,
      phone: c.phone, mobile: c.mobile, company: c.company, companyId: c.companyId,
      jobTitle: c.jobTitle, department: c.department, source: c.source,
      type: c.type, address: c.address, city: c.city, state: c.state,
      zip: c.zip, country: c.country, notes: c.notes,
    })
    setEditingId(c.id)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      update('contacts', editingId, form)
    } else {
      create('contacts', form)
    }
    setModalOpen(false)
    loadData()
  }

  const handleDelete = () => {
    if (deleteId) {
      remove('contacts', deleteId)
      setDeleteId(null)
      loadData()
    }
  }

  const getCompanyName = (id: string) => {
    const c = companies.find((c: any) => c.id === id)
    return c ? c.name : null
  }

  const columns: Column<Contact>[] = [
    { key: 'name', header: 'Name', render: (c) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-semibold text-[var(--text-primary)]">
          {c.firstName?.[0]}{c.lastName?.[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{c.firstName} {c.lastName}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{c.jobTitle || '-'}</p>
        </div>
      </div>
    )},
    { key: 'email', header: 'Email', render: (c) => (
      <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
        <FiMail size={13} className="text-[var(--text-tertiary)]" /> {c.email}
      </span>
    )},
    { key: 'phone', header: 'Phone', render: (c) => (
      <span className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
        <FiPhone size={13} className="text-[var(--text-tertiary)]" /> {c.phone || c.mobile || '-'}
      </span>
    )},
    { key: 'company', header: 'Company', render: (c) => {
      const cn = getCompanyName(c.companyId)
      return cn ? (
        <Badge variant="info" size="sm">{cn}</Badge>
      ) : c.company ? (
        <span className="text-sm text-[var(--text-secondary)]">{c.company}</span>
      ) : <span className="text-sm text-[var(--text-tertiary)]">-</span>
    }},
    { key: 'type', header: 'Type', render: (c) => <Badge size="sm">{c.type}</Badge> },
    { key: 'source', header: 'Source', render: (c) => <span className="text-xs text-[var(--text-tertiary)]">{c.source}</span> },
    { key: 'location', header: 'Location', render: (c) => (
      <span className="text-sm text-[var(--text-tertiary)]">{c.city ? `${c.city}${c.country ? `, ${c.country}` : ''}` : '-'}</span>
    )},
    { key: 'actions', header: 'Actions', render: (c) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"><FiEdit2 size={14} /></button>
        <button onClick={() => setDeleteId(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-tertiary)] hover:text-red-500 transition-colors"><FiTrash2 size={14} /></button>
      </div>
    )},
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Contacts</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage your business contacts</p>
        </div>
        <Button variant="primary" size="md" icon={<FiPlus />} onClick={openAdd}>Add Contact</Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Search contacts..." className="flex-1" />
          <Select options={typeOptions} placeholder="All Types" value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full sm:w-40" />
          <Select options={companies.map((c: any) => ({ value: c.id, label: c.name }))} placeholder="All Companies" value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="w-full sm:w-40" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiUsers size={36} />}
            title="No contacts found"
            description={search || filterType || filterCompany ? 'Try adjusting your filters' : 'Add your first contact to get started'}
            action={!search && !filterType && !filterCompany ? { label: 'Add Contact', onClick: openAdd } : undefined}
          />
        ) : (
          <Table columns={columns} data={filtered} keyExtractor={(c) => c.id} pageSize={10} />
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Contact' : 'Add Contact'} size="xl">
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
            <Input label="Mobile" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} />
            <Input label="Job Title" value={form.jobTitle} onChange={(e) => setForm({...form, jobTitle: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Company" options={companies.map((c: any) => ({ value: c.id, label: c.name }))} value={form.companyId} onChange={(e) => {
              const comp = companies.find((c: any) => c.id === e.target.value)
              setForm({...form, companyId: e.target.value, company: comp?.name || ''})
            }} placeholder="Select Company" />
            <Input label="Department" value={form.department} onChange={(e) => setForm({...form, department: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" options={typeOptions} value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} />
            <Select label="Source" options={sourceOptions} value={form.source} onChange={(e) => setForm({...form, source: e.target.value})} />
          </div>
          <Input label="Address" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
            <Input label="State" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="ZIP Code" value={form.zip} onChange={(e) => setForm({...form, zip: e.target.value})} />
            <Input label="Country" value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} />
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-input min-h-[80px]" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{editingId ? 'Update' : 'Create'} Contact</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
