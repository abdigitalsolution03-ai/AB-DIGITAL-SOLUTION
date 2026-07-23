import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FiPlus, FiSearch, FiDollarSign, FiCheckCircle, FiXCircle,
  FiClock, FiCreditCard, FiTrash2
} from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { getSession, hasRole } from '@/services/auth'
import {
  Button, Card, Badge, StatsCard, SearchInput, Select, Modal,
  Input, ConfirmDialog, EmptyState, Table
} from '@/components/ui'
import type { Column } from '@/components/ui'

const { getCollection, getById, create, update, delete: remove, generateId, formatDate, formatCurrency } = store

interface Payment {
  id: string
  invoiceId: string
  clientId: string
  amount: number
  method: 'cash' | 'check' | 'bank_transfer' | 'card' | 'online'
  transactionId: string
  status: 'completed' | 'pending' | 'failed'
  receivedBy: string
  createdAt: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  total: number
  status: string
}

interface Client {
  id: string
  firstName: string
  lastName: string
  company: string
}

interface Employee {
  id: string
  name: string
}

const methodLabels: Record<string, string> = {
  cash: 'Cash',
  check: 'Check',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
  online: 'Online',
}

const statusColors: Record<string, 'success' | 'warning' | 'danger'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
}

const emptyForm = {
  invoiceId: '',
  clientId: '',
  amount: 0,
  method: 'bank_transfer' as Payment['method'],
  transactionId: '',
  status: 'completed' as Payment['status'],
  receivedBy: '',
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = () => {
    setPayments(getCollection<Payment>('payments'))
    setInvoices(getCollection<Invoice>('invoices'))
    setClients(getCollection<Client>('clients'))
    setEmployees(getCollection<Employee>('employees'))
  }

  useEffect(() => { loadData() }, [])

  const userMap = useMemo(() => {
    const map = new Map<string, string>()
    employees.forEach(e => map.set(e.id, e.name))
    const users = getCollection<{ id: string; name: string }>('users')
    users.forEach(u => map.set(u.id, u.name))
    return map
  }, [employees])

  const clientMap = useMemo(() => {
    const map = new Map<string, Client>()
    clients.forEach(c => map.set(c.id, c))
    return map
  }, [clients])

  const invoiceMap = useMemo(() => {
    const map = new Map<string, Invoice>()
    invoices.forEach(i => map.set(i.id, i))
    return map
  }, [invoices])

  const unpaidInvoices = useMemo(() =>
    invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled'),
    [invoices]
  )

  const getClientName = (clientId: string) => {
    const c = clientMap.get(clientId)
    return c ? (c.company || `${c.firstName} ${c.lastName}`) : clientId
  }

  const filtered = useMemo(() => {
    let list = payments
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        (p.transactionId || '').toLowerCase().includes(q) ||
        (invoiceMap.get(p.invoiceId)?.invoiceNumber || '').toLowerCase().includes(q) ||
        getClientName(p.clientId).toLowerCase().includes(q)
      )
    }
    if (dateFrom) {
      list = list.filter(p => new Date(p.createdAt) >= new Date(dateFrom))
    }
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      list = list.filter(p => new Date(p.createdAt) <= to)
    }
    return list
  }, [payments, search, dateFrom, dateTo, invoiceMap, clientMap])

  const stats = useMemo(() => ({
    total: payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0),
    pending: payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0),
    failed: payments.filter(p => p.status === 'failed').length,
  }), [payments])

  const handleCreate = () => {
    if (!form.invoiceId || !form.amount) return
    const inv = invoiceMap.get(form.invoiceId)
    create<Payment>('payments', {
      ...form,
      clientId: inv?.clientId || form.clientId,
    } as any)
    if (form.status === 'completed' && inv) {
      update<Invoice>('invoices', inv.id, { status: 'paid', paidDate: new Date().toISOString() } as any)
    }
    loadData()
    setShowCreateModal(false)
    setForm(emptyForm)
  }

  const handleDelete = () => {
    if (deleteId) {
      remove('payments', deleteId)
      loadData()
      setDeleteId(null)
    }
  }

  const columns: Column<Payment>[] = [
    {
      key: 'transactionId',
      header: 'Transaction ID',
      render: p => (
        <span className="font-mono text-sm font-medium text-[var(--text-primary)]">
          {p.transactionId || '-'}
        </span>
      ),
    },
    {
      key: 'invoiceId',
      header: 'Invoice #',
      render: p => (
        <span className="text-[var(--text-secondary)]">
          {invoiceMap.get(p.invoiceId)?.invoiceNumber || '-'}
        </span>
      ),
    },
    {
      key: 'clientId',
      header: 'Client',
      render: p => (
        <span className="text-[var(--text-secondary)]">
          {getClientName(p.clientId)}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: p => (
        <span className="font-semibold text-[var(--text-primary)]">
          {formatCurrency(p.amount || 0)}
        </span>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      render: p => (
        <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          {p.method === 'bank_transfer' ? <FiCreditCard size={14} /> :
           p.method === 'card' ? <FiCreditCard size={14} /> :
           p.method === 'cash' ? <FiDollarSign size={14} /> :
           <FiClock size={14} />}
          {methodLabels[p.method] || p.method}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: p => (
        <Badge variant={statusColors[p.status] || 'default'} size="sm">
          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: p => (
        <span className="text-sm text-[var(--text-tertiary)]">
          {p.createdAt ? formatDate(p.createdAt) : '-'}
        </span>
      ),
    },
    {
      key: 'receivedBy',
      header: 'Received By',
      render: p => (
        <span className="text-sm text-[var(--text-secondary)]">
          {p.receivedBy ? (userMap.get(p.receivedBy) || p.receivedBy) : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: p => (
        <button
          onClick={() => setDeleteId(p.id)}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
          title="Delete"
        >
          <FiTrash2 size={14} />
        </button>
      ),
    },
  ]

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Payments</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              Track all incoming payments
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} icon={<FiPlus />}>
            New Payment
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            icon={<FiCheckCircle size={20} />}
            value={formatCurrency(stats.total)}
            label="Total Received"
            color="green"
          />
          <StatsCard
            icon={<FiClock size={20} />}
            value={formatCurrency(stats.pending)}
            label="Pending"
            color="gold"
          />
          <StatsCard
            icon={<FiXCircle size={20} />}
            value={stats.failed}
            label="Failed"
            color="red"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search by transaction, invoice, or client..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[var(--text-tertiary)]">From</label>
            <input
              type="date"
              className="form-input w-36 text-sm"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
            />
            <label className="text-xs text-[var(--text-tertiary)]">To</label>
            <input
              type="date"
              className="form-input w-36 text-sm"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(''); setDateTo('') }}
                className="text-xs text-[var(--royal-500)] hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <Table
          columns={columns}
          data={filtered}
          keyExtractor={p => p.id}
          pageSize={10}
          emptyMessage="No payments recorded"
        />
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setForm(emptyForm) }}
        title="Record Payment"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Invoice"
            options={unpaidInvoices.map(inv => ({
              value: inv.id,
              label: `${inv.invoiceNumber || inv.id} - ${formatCurrency(inv.total || 0)}`,
            }))}
            value={form.invoiceId}
            onChange={e => {
              const inv = invoiceMap.get(e.target.value)
              setForm(prev => ({
                ...prev,
                invoiceId: e.target.value,
                clientId: inv?.clientId || '',
                amount: inv?.total || 0,
              }))
            }}
            placeholder="Select unpaid invoice"
          />
          <Input
            label="Amount"
            type="number"
            min={0}
            value={form.amount || ''}
            onChange={e => setForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
          />
          <Select
            label="Payment Method"
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'check', label: 'Check' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'card', label: 'Card' },
              { value: 'online', label: 'Online' },
            ]}
            value={form.method}
            onChange={e => setForm(prev => ({ ...prev, method: e.target.value as Payment['method'] }))}
          />
          <Input
            label="Transaction ID"
            value={form.transactionId}
            onChange={e => setForm(prev => ({ ...prev, transactionId: e.target.value }))}
            placeholder="Optional transaction reference"
          />
          <Select
            label="Status"
            options={[
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
            ]}
            value={form.status}
            onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Payment['status'] }))}
          />
          <Select
            label="Received By"
            options={employees.map(e => ({ value: e.id, label: e.name }))}
            value={form.receivedBy}
            onChange={e => setForm(prev => ({ ...prev, receivedBy: e.target.value }))}
            placeholder="Who received this payment?"
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => { setShowCreateModal(false); setForm(emptyForm) }}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Record Payment</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Payment"
        message="Are you sure you want to delete this payment record?"
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
