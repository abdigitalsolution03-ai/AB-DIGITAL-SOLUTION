import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiDollarSign, FiFileText,
  FiSend, FiCheckCircle, FiX, FiClock, FiDownload, FiEye
} from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { getSession, hasRole } from '@/services/auth'
import {
  Button, Card, Badge, StatsCard, SearchInput, Select, Modal,
  Input, ConfirmDialog, EmptyState, Table, Tabs
} from '@/components/ui'
import type { Column } from '@/components/ui'

const { getCollection, getById, create, update, delete: remove, generateId, formatDate, formatCurrency } = store

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  projectId: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate: string
  notes: string
  createdAt: string
}

interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  status: string
}

interface Project {
  id: string
  name: string
  clientId: string
}

const statusTabs = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'paid', label: 'Paid' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'cancelled', label: 'Cancelled' },
]

const statusColors: Record<string, 'default' | 'info' | 'success' | 'danger'> = {
  draft: 'default',
  sent: 'info',
  paid: 'success',
  overdue: 'danger',
  cancelled: 'danger',
}

type ModalMode = 'create' | 'edit' | null

const emptyForm = {
  clientId: '',
  projectId: '',
  items: [{ description: '', quantity: 1, rate: 0, amount: 0 }] as InvoiceItem[],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  currency: 'INR',
  status: 'draft' as Invoice['status'],
  dueDate: '',
  notes: '',
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = () => {
    setInvoices(getCollection<Invoice>('invoices'))
    setClients(getCollection<Client>('clients'))
    setProjects(getCollection<Project>('projects'))
  }

  useEffect(() => { loadData() }, [])

  const clientMap = useMemo(() => {
    const map = new Map<string, Client>()
    clients.forEach(c => map.set(c.id, c))
    return map
  }, [clients])

  const clientProjectMap = useMemo(() => {
    const map = new Map<string, Project[]>()
    projects.forEach(p => {
      const list = map.get(p.clientId) || []
      list.push(p)
      map.set(p.clientId, list)
    })
    return map
  }, [projects])

  const getClientName = (clientId: string) => {
    const c = clientMap.get(clientId)
    return c ? (c.company || `${c.firstName} ${c.lastName}`) : clientId
  }

  const filtered = useMemo(() => {
    let list = invoices
    if (activeTab !== 'all') list = list.filter(inv => inv.status === activeTab)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(inv =>
        (inv.invoiceNumber || '').toLowerCase().includes(q) ||
        getClientName(inv.clientId).toLowerCase().includes(q)
      )
    }
    return list
  }, [invoices, activeTab, search, clientMap])

  const stats = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0),
    overdue: invoices.filter(i => i.status === 'overdue').length,
    draft: invoices.filter(i => i.status === 'draft').length,
  }), [invoices])

  const calcItemAmount = (items: InvoiceItem[]) =>
    items.reduce((s, item) => s + (item.quantity || 0) * (item.rate || 0), 0)

  const recalcTotals = (items: InvoiceItem[], tax: number, discount: number) => {
    const subtotal = calcItemAmount(items)
    const taxAmount = subtotal * (tax / 100)
    const total = subtotal + taxAmount - discount
    return { subtotal, total: Math.max(0, total) }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setForm(prev => {
      const items = prev.items.map((item, i) => {
        if (i !== index) return item
        const updated = { ...item, [field]: field === 'description' ? value as string : Number(value) }
        if (field === 'quantity' || field === 'rate') updated.amount = (updated.quantity || 0) * (updated.rate || 0)
        return updated
      })
      const { subtotal, total } = recalcTotals(items, prev.tax, prev.discount)
      return { ...prev, items, subtotal, total }
    })
  }

  const addItem = () => {
    setForm(prev => {
      const items = [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
      const { subtotal, total } = recalcTotals(items, prev.tax, prev.discount)
      return { ...prev, items, subtotal, total }
    })
  }

  const removeItem = (index: number) => {
    setForm(prev => {
      if (prev.items.length <= 1) return prev
      const items = prev.items.filter((_, i) => i !== index)
      const { subtotal, total } = recalcTotals(items, prev.tax, prev.discount)
      return { ...prev, items, subtotal, total }
    })
  }

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setModalMode('create')
  }

  const openEdit = (inv: Invoice) => {
    setForm({
      clientId: inv.clientId || '',
      projectId: inv.projectId || '',
      items: inv.items?.length ? inv.items : [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      subtotal: inv.subtotal || 0,
      tax: inv.tax || 0,
      discount: inv.discount || 0,
      total: inv.total || 0,
      currency: inv.currency || 'INR',
      status: inv.status,
      dueDate: inv.dueDate ? inv.dueDate.split('T')[0] : '',
      notes: inv.notes || '',
    })
    setEditingId(inv.id)
    setModalMode('edit')
  }

  const handleSave = () => {
    if (!form.clientId) return
    const data = {
      ...form,
      invoiceNumber: editingId
        ? undefined
        : `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
    }
    const { subtotal, total } = recalcTotals(form.items, form.tax, form.discount)
    const payload = { ...data, subtotal, total }
    if (editingId) {
      update<Invoice>('invoices', editingId, payload as any)
    } else {
      create<Invoice>('invoices', payload as any)
    }
    loadData()
    setModalMode(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      remove('invoices', deleteId)
      loadData()
      setDeleteId(null)
    }
  }

  const handleStatusChange = (id: string, status: Invoice['status']) => {
    const data: any = { status }
    if (status === 'paid') data.paidDate = new Date().toISOString()
    update<Invoice>('invoices', id, data)
    loadData()
  }

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: inv => (
        <span className="font-medium text-[var(--text-primary)]">
          {inv.invoiceNumber || '-'}
        </span>
      ),
    },
    {
      key: 'clientId',
      header: 'Client',
      render: inv => (
        <span className="text-[var(--text-secondary)]">
          {getClientName(inv.clientId)}
        </span>
      ),
    },
    {
      key: 'projectId',
      header: 'Project',
      render: inv => {
        const p = projects.find(pr => pr.id === inv.projectId)
        return <span className="text-[var(--text-secondary)]">{p?.name || '-'}</span>
      },
    },
    {
      key: 'total',
      header: 'Amount',
      render: inv => (
        <span className="font-semibold text-[var(--text-primary)]">
          {formatCurrency(inv.total || 0)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Issue Date',
      render: inv => (
        <span className="text-sm text-[var(--text-tertiary)]">
          {inv.createdAt ? formatDate(inv.createdAt) : '-'}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: inv => (
        <span className="text-sm text-[var(--text-secondary)]">
          {inv.dueDate ? formatDate(inv.dueDate) : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: inv => (
        <Badge variant={statusColors[inv.status] || 'default'} size="sm">
          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: inv => (
        <div className="flex items-center gap-1">
          {inv.status === 'draft' && (
            <button
              onClick={() => handleStatusChange(inv.id, 'sent')}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--royal-500)] transition-colors"
              title="Send Invoice"
            >
              <FiSend size={14} />
            </button>
          )}
          {(inv.status === 'sent' || inv.status === 'overdue') && (
            <button
              onClick={() => handleStatusChange(inv.id, 'paid')}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-emerald-500 transition-colors"
              title="Mark as Paid"
            >
              <FiCheckCircle size={14} />
            </button>
          )}
          <button
            onClick={() => openEdit(inv)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--royal-500)] transition-colors"
            title="Edit"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(inv.id)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Invoices</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              Manage and track invoices
            </p>
          </div>
          <Button onClick={openCreate} icon={<FiPlus />}>
            New Invoice
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={<FiFileText size={20} />}
            value={stats.total}
            label="Total Invoices"
            color="royal"
          />
          <StatsCard
            icon={<FiDollarSign size={20} />}
            value={formatCurrency(stats.paid)}
            label="Total Paid"
            color="green"
          />
          <StatsCard
            icon={<FiClock size={20} />}
            value={stats.overdue}
            label="Overdue"
            color="red"
          />
          <StatsCard
            icon={<FiFileText size={20} />}
            value={stats.draft}
            label="Drafts"
            color="purple"
          />
        </div>

        <Tabs
          tabs={statusTabs.map(t => ({
            ...t,
            count: t.id === 'all' ? invoices.length : invoices.filter(i => i.status === t.id).length,
          }))}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search by invoice # or client..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filtered}
          keyExtractor={inv => inv.id}
          pageSize={10}
          emptyMessage="No invoices found"
        />
      </div>

      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={() => setModalMode(null)}
        title={editingId ? 'Edit Invoice' : 'New Invoice'}
        size="xl"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Client"
              options={clients.map(c => ({
                value: c.id,
                label: c.company || `${c.firstName} ${c.lastName}`,
              }))}
              value={form.clientId}
              onChange={e => {
                setForm(prev => ({ ...prev, clientId: e.target.value, projectId: '' }))
              }}
              placeholder="Select client"
            />
            <Select
              label="Project"
              options={(clientProjectMap.get(form.clientId) || []).map(p => ({
                value: p.id,
                label: p.name,
              }))}
              value={form.projectId}
              onChange={e => setForm(prev => ({ ...prev, projectId: e.target.value }))}
              placeholder="Select project"
            />
            <Select
              label="Status"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'sent', label: 'Sent' },
                { value: 'paid', label: 'Paid' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={form.status}
              onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Invoice['status'] }))}
            />
            <Input
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="form-label !mb-0">Line Items</label>
              <Button size="sm" variant="outline" onClick={addItem} icon={<FiPlus />}>
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {form.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 p-3 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]"
                  >
                    <div className="flex-1">
                      <input
                        className="form-input text-sm"
                        placeholder="Description"
                        value={item.description}
                        onChange={e => updateItem(idx, 'description', e.target.value)}
                      />
                    </div>
                    <div className="w-20">
                      <input
                        className="form-input text-sm text-center"
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={item.quantity || ''}
                        onChange={e => updateItem(idx, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="w-24">
                      <input
                        className="form-input text-sm text-right"
                        type="number"
                        min={0}
                        placeholder="Rate"
                        value={item.rate || ''}
                        onChange={e => updateItem(idx, 'rate', e.target.value)}
                      />
                    </div>
                    <div className="w-24 flex items-center justify-end text-sm font-semibold text-[var(--text-primary)] pt-1">
                      {formatCurrency(item.amount || 0)}
                    </div>
                    {form.items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-[var(--text-tertiary)]">
                <span>Subtotal</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {formatCurrency(form.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--text-tertiary)] shrink-0">Tax (%)</span>
                <input
                  className="form-input w-20 text-sm text-right"
                  type="number"
                  min={0}
                  max={100}
                  value={form.tax || ''}
                  onChange={e => {
                    const tax = Number(e.target.value)
                    setForm(prev => {
                      const { subtotal, total } = recalcTotals(prev.items, tax, prev.discount)
                      return { ...prev, tax, subtotal, total }
                    })
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--text-tertiary)] shrink-0">Discount</span>
                <input
                  className="form-input w-24 text-sm text-right"
                  type="number"
                  min={0}
                  value={form.discount || ''}
                  onChange={e => {
                    const discount = Number(e.target.value)
                    setForm(prev => {
                      const { subtotal, total } = recalcTotals(prev.items, prev.tax, discount)
                      return { ...prev, discount, subtotal, total }
                    })
                  }}
                />
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--border-primary)]">
                <span className="font-semibold text-[var(--text-primary)]">Total</span>
                <span className="font-bold text-lg text-[var(--text-primary)]">
                  {formatCurrency(form.total)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label">Notes</label>
            <textarea
              className="form-input min-h-[60px] resize-none"
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setModalMode(null)}>Cancel</Button>
          <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'} Invoice</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
