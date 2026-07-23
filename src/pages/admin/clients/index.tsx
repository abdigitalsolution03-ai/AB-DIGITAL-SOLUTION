import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiMail, FiPhone,
  FiChevronDown, FiChevronUp, FiBriefcase, FiFolder, FiFileText,
  FiDollarSign, FiUser
} from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { getSession, hasRole } from '@/services/auth'
import {
  Button, Badge, SearchInput, Modal, Input, ConfirmDialog,
  EmptyState, Avatar, Tabs
} from '@/components/ui'

const { getCollection, getById, create, update, delete: remove, generateId, formatDate, formatCurrency } = store

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  status: string
  createdAt: string
}

interface Project {
  id: string
  name: string
  clientId: string
  status: string
  budget: number
  progress: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  total: number
  status: string
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  active: 'success',
  inactive: 'default',
  lead: 'info',
  archived: 'danger',
}

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  status: 'active',
}

type ModalMode = 'create' | 'edit' | null

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [search, setSearch] = useState('')
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadData = () => {
    setClients(getCollection<Client>('clients'))
    setProjects(getCollection<Project>('projects'))
    setInvoices(getCollection<Invoice>('invoices'))
  }

  useEffect(() => { loadData() }, [])

  const filtered = useMemo(() => {
    if (!search) return clients
    const q = search.toLowerCase()
    return clients.filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    )
  }, [clients, search])

  const clientProjectCount = useMemo(() => {
    const map = new Map<string, number>()
    projects.forEach(p => {
      map.set(p.clientId, (map.get(p.clientId) || 0) + 1)
    })
    return map
  }, [projects])

  const clientInvoiceCount = useMemo(() => {
    const map = new Map<string, number>()
    invoices.forEach(inv => {
      map.set(inv.clientId, (map.get(inv.clientId) || 0) + 1)
    })
    return map
  }, [invoices])

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setModalMode('create')
  }

  const openEdit = (c: Client) => {
    setForm({
      firstName: c.firstName || '',
      lastName: c.lastName || '',
      email: c.email || '',
      phone: c.phone || '',
      company: c.company || '',
      status: c.status || 'active',
    })
    setEditingId(c.id)
    setModalMode('edit')
  }

  const handleSave = () => {
    if (!form.firstName.trim()) return
    if (editingId) {
      update<Client>('clients', editingId, form as any)
    } else {
      create<Client>('clients', form as any)
    }
    loadData()
    setModalMode(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      remove('clients', deleteId)
      loadData()
      setDeleteId(null)
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const getClientProjects = (clientId: string) => projects.filter(p => p.clientId === clientId)
  const getClientInvoices = (clientId: string) => invoices.filter(inv => inv.clientId === clientId)

  const projectStatusColors: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'default'> = {
    planning: 'info',
    in_progress: 'warning',
    on_hold: 'default',
    completed: 'success',
    cancelled: 'danger',
  }

  const invoiceStatusColors: Record<string, 'default' | 'info' | 'success' | 'danger'> = {
    draft: 'default',
    sent: 'info',
    paid: 'success',
    overdue: 'danger',
    cancelled: 'danger',
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Clients</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              Manage your client base
            </p>
          </div>
          <Button onClick={openCreate} icon={<FiPlus />}>
            Add Client
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search by name, email, company, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
          <p className="text-sm text-[var(--text-tertiary)]">
            {filtered.length} client{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiUser size={36} />}
            title="No clients found"
            description={search ? 'Try a different search term' : 'Add your first client to get started'}
            action={!search ? { label: 'Add Client', onClick: openCreate } : undefined}
          />
        ) : (
          <div className="rounded-xl border border-[var(--border-primary)] overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              <div className="col-span-3">Client</div>
              <div className="col-span-2">Email / Phone</div>
              <div className="col-span-2">Company</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-center">Projects</div>
              <div className="col-span-1 text-center">Invoices</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <AnimatePresence>
              {filtered.map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-5 py-4 items-center border-b border-[var(--border-primary)] last:border-b-0 hover:bg-[var(--bg-secondary)]/50 transition-colors cursor-pointer ${
                      expandedId === client.id ? 'bg-[var(--bg-secondary)]' : ''
                    }`}
                    onClick={() => toggleExpand(client.id)}
                  >
                    <div className="col-span-3 flex items-center gap-3">
                      <Avatar
                        name={`${client.firstName} ${client.lastName}`}
                        size="md"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {client.firstName} {client.lastName}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)] md:hidden mt-1">
                          {client.email} {client.phone && `| ${client.phone}`}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <FiMail size={12} className="text-[var(--text-tertiary)]" />
                          {client.email}
                        </span>
                        {client.phone && (
                          <span className="flex items-center gap-1 mt-0.5 text-xs text-[var(--text-tertiary)]">
                            <FiPhone size={11} />
                            {client.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center text-sm text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <FiBriefcase size={13} className="text-[var(--text-tertiary)]" />
                        {client.company || '-'}
                      </span>
                    </div>
                    <div className="hidden md:flex col-span-1 items-center">
                      <Badge variant={statusColors[client.status] || 'default'} size="sm">
                        {client.status || 'active'}
                      </Badge>
                    </div>
                    <div className="hidden md:flex col-span-1 items-center justify-center">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {clientProjectCount.get(client.id) || 0}
                      </span>
                    </div>
                    <div className="hidden md:flex col-span-1 items-center justify-center">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {clientInvoiceCount.get(client.id) || 0}
                      </span>
                    </div>
                    <div className="hidden md:flex col-span-2 items-center justify-end gap-1">
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(client) }}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--royal-500)] transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteId(client.id) }}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                      <span className="text-[var(--text-tertiary)] ml-1">
                        {expandedId === client.id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </span>
                    </div>

                    <div className="flex md:hidden items-center justify-between mt-2 pt-2 border-t border-[var(--border-primary)]">
                      <Badge variant={statusColors[client.status] || 'default'} size="sm">
                        {client.status || 'active'}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                        <span>{clientProjectCount.get(client.id) || 0} projects</span>
                        <span>{clientInvoiceCount.get(client.id) || 0} invoices</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); openEdit(client) }}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setDeleteId(client.id) }}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === client.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 py-4 bg-[var(--bg-tertiary)]/30 border-b border-[var(--border-primary)] space-y-5">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <FiFolder size={14} className="text-[var(--text-tertiary)]" />
                                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                  Projects ({getClientProjects(client.id).length})
                                </h4>
                              </div>
                              {getClientProjects(client.id).length === 0 ? (
                                <p className="text-xs text-[var(--text-tertiary)] pl-5">No linked projects</p>
                              ) : (
                                <div className="space-y-2">
                                  {getClientProjects(client.id).map(proj => (
                                    <div key={proj.id} className="flex items-center justify-between pl-5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-[var(--text-primary)]">{proj.name}</span>
                                        <Badge variant={projectStatusColors[proj.status] || 'default'} size="sm">
                                          {proj.status.replace('_', ' ')}
                                        </Badge>
                                      </div>
                                      <span className="text-xs text-[var(--text-tertiary)]">
                                        {proj.budget ? formatCurrency(proj.budget) : '-'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <FiFileText size={14} className="text-[var(--text-tertiary)]" />
                                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                                  Invoices ({getClientInvoices(client.id).length})
                                </h4>
                              </div>
                              {getClientInvoices(client.id).length === 0 ? (
                                <p className="text-xs text-[var(--text-tertiary)] pl-5">No invoices</p>
                              ) : (
                                <div className="space-y-2">
                                  {getClientInvoices(client.id).map(inv => (
                                    <div key={inv.id} className="flex items-center justify-between pl-5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-[var(--text-primary)]">
                                          {inv.invoiceNumber || inv.id}
                                        </span>
                                        <Badge variant={invoiceStatusColors[inv.status] || 'default'} size="sm">
                                          {inv.status}
                                        </Badge>
                                      </div>
                                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                                        {inv.total ? formatCurrency(inv.total) : '-'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 pt-2 text-xs text-[var(--text-tertiary)]">
                            <span>Created: {client.createdAt ? formatDate(client.createdAt) : '-'}</span>
                            <span>ID: {client.id}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={() => setModalMode(null)}
        title={editingId ? 'Edit Client' : 'Add Client'}
        size="md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={form.firstName}
            onChange={e => setForm(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="First name"
          />
          <Input
            label="Last Name"
            value={form.lastName}
            onChange={e => setForm(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Last name"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            placeholder="email@example.com"
            icon={<FiMail size={14} />}
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            icon={<FiPhone size={14} />}
          />
          <Input
            label="Company"
            value={form.company}
            onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
            placeholder="Company name"
          />
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={form.status}
              onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lead">Lead</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setModalMode(null)}>Cancel</Button>
          <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'} Client</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
