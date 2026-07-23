import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiGlobe, FiMapPin, FiUsers, FiBriefcase } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { getCollection, create, update, remove } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, SearchInput, EmptyState, ConfirmDialog } from '@/components/ui'
import type { Column } from '@/components/ui'

interface Company {
  id: string
  name: string
  legalName: string
  website: string
  email: string
  phone: string
  industry: string
  size: string
  annualRevenue: number
  description: string
  address: string
  city: string
  state: string
  country: string
  zip: string
  linkedIn: string
  status: string
  notes: string
  createdAt: string
}

const emptyCompany = {
  name: '', legalName: '', website: '', email: '', phone: '',
  industry: 'technology', size: '1-10', annualRevenue: 0,
  description: '', address: '', city: '', state: '', country: '',
  zip: '', linkedIn: '', status: 'active', notes: '',
}

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'telecom', label: 'Telecommunications' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'nonprofit', label: 'Non-profit' },
  { value: 'other', label: 'Other' },
]

const sizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1001-5000', label: '1001-5000 employees' },
  { value: '5001+', label: '5001+ employees' },
]

export default function CRMCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<any>(emptyCompany)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = () => {
    setCompanies(getCollection('companies'))
    setContacts(getCollection('contacts'))
  }

  useEffect(loadData, [])

  const filtered = companies.filter(c => {
    const matchSearch = !search || `${c.name} ${c.industry} ${c.email}`.toLowerCase().includes(search.toLowerCase())
    const matchIndustry = !filterIndustry || c.industry === filterIndustry
    const matchStatus = !filterStatus || c.status === filterStatus
    return matchSearch && matchIndustry && matchStatus
  })

  const getContactCount = (companyId: string) => contacts.filter((c: any) => c.companyId === companyId).length

  const openAdd = () => {
    setForm(emptyCompany)
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (c: Company) => {
    setForm({
      name: c.name, legalName: c.legalName, website: c.website, email: c.email,
      phone: c.phone, industry: c.industry, size: c.size, annualRevenue: c.annualRevenue,
      description: c.description, address: c.address, city: c.city, state: c.state,
      country: c.country, zip: c.zip, linkedIn: c.linkedIn, status: c.status, notes: c.notes,
    })
    setEditingId(c.id)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      update('companies', editingId, form)
    } else {
      create('companies', form)
    }
    setModalOpen(false)
    loadData()
  }

  const handleDelete = () => {
    if (deleteId) {
      remove('companies', deleteId)
      setDeleteId(null)
      loadData()
    }
  }

  const columns: Column<Company>[] = [
    { key: 'name', header: 'Company', render: (c) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-semibold text-[var(--text-primary)]">
          <FiBriefcase size={16} />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">{c.name}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{c.legalName || ''}</p>
        </div>
      </div>
    )},
    { key: 'industry', header: 'Industry', render: (c) => <Badge size="sm">{c.industry}</Badge> },
    { key: 'size', header: 'Size', render: (c) => <span className="text-sm text-[var(--text-secondary)]">{c.size}</span> },
    { key: 'email', header: 'Email', render: (c) => (
      <span className="text-sm text-[var(--text-secondary)]">{c.email || '-'}</span>
    )},
    { key: 'phone', header: 'Phone', render: (c) => (
      <span className="text-sm text-[var(--text-secondary)]">{c.phone || '-'}</span>
    )},
    { key: 'website', header: 'Website', render: (c) => c.website ? (
      <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--royal-blue)] hover:underline flex items-center gap-1">
        <FiGlobe size={13} /> Visit
      </a>
    ) : <span className="text-sm text-[var(--text-tertiary)]">-</span>},
    { key: 'location', header: 'Location', render: (c) => (
      <span className="text-sm text-[var(--text-tertiary)] flex items-center gap-1">
        <FiMapPin size={13} /> {c.city ? `${c.city}${c.country ? `, ${c.country}` : ''}` : '-'}
      </span>
    )},
    { key: 'contacts', header: 'Contacts', render: (c) => (
      <span className="text-sm font-medium text-[var(--text-primary)]">{getContactCount(c.id)}</span>
    )},
    { key: 'status', header: 'Status', render: (c) => (
      <Badge variant={c.status === 'active' ? 'success' : c.status === 'inactive' ? 'warning' : 'default'}>{c.status}</Badge>
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
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Companies</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage your partner companies and accounts</p>
        </div>
        <Button variant="primary" size="md" icon={<FiPlus />} onClick={openAdd}>Add Company</Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch('')} placeholder="Search companies..." className="flex-1" />
          <Select options={industryOptions} placeholder="All Industries" value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className="w-full sm:w-44" />
          <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'lead', label: 'Lead' }]} placeholder="All Statuses" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full sm:w-36" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiUsers size={36} />}
            title="No companies found"
            description={search || filterIndustry || filterStatus ? 'Try adjusting your filters' : 'Add your first company to get started'}
            action={!search && !filterIndustry && !filterStatus ? { label: 'Add Company', onClick: openAdd } : undefined}
          />
        ) : (
          <Table columns={columns} data={filtered} keyExtractor={(c) => c.id} pageSize={10} />
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Company' : 'Add Company'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            <Input label="Legal Name" value={form.legalName} onChange={(e) => setForm({...form, legalName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Website" type="url" value={form.website} onChange={(e) => setForm({...form, website: e.target.value})} placeholder="https://" />
            <Input label="LinkedIn" value={form.linkedIn} onChange={(e) => setForm({...form, linkedIn: e.target.value})} placeholder="https://linkedin.com/company/" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Industry" options={industryOptions} value={form.industry} onChange={(e) => setForm({...form, industry: e.target.value})} />
            <Select label="Company Size" options={sizeOptions} value={form.size} onChange={(e) => setForm({...form, size: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Annual Revenue (₹)" type="number" min={0} value={form.annualRevenue} onChange={(e) => setForm({...form, annualRevenue: parseInt(e.target.value) || 0})} />
            <Select label="Status" options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'lead', label: 'Lead' }]} value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea className="form-input min-h-[60px]" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
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
            <Button variant="primary" type="submit">{editingId ? 'Update' : 'Create'} Company</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Company"
        message="Are you sure you want to delete this company? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
