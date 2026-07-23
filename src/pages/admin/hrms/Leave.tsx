import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiCheckCircle, FiX, FiClock, FiCalendar, FiUser } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, StatsCard, Tabs, EmptyState, ConfirmDialog } from '@/components/ui'
import type { Column, Tab } from '@/components/ui'

interface Leave {
  id: string
  employeeId: string
  leaveType: string
  fromDate: string
  toDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  approvedBy: string
  comments: string
}

interface Employee {
  id: string
  firstName: string
  lastName: string
}

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
  pending: { variant: 'warning', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'danger', label: 'Rejected' },
  cancelled: { variant: 'default', label: 'Cancelled' },
}

const initialForm = { employeeId: '', leaveType: 'sick', fromDate: '', toDate: '', reason: '' }

const leaveTypes = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'personal', label: 'Personal Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'other', label: 'Other' },
]

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState<Leave[]>(() => store.getCollection<any>('leaveRequests').map(mapLeave))
  const [employees] = useState<Employee[]>(() => store.getCollection<any>('employees').map(mapEmp))
  const [activeTab, setActiveTab] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [actionTarget, setActionTarget] = useState<{ leave: Leave; action: 'approved' | 'rejected' } | null>(null)
  const [comment, setComment] = useState('')

  const filtered = useMemo(() => {
    if (activeTab === 'all') return leaves
    return leaves.filter(l => l.status === activeTab)
  }, [leaves, activeTab])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime())
  }, [filtered])

  const tabs: Tab[] = [
    { id: 'all', label: 'All', count: leaves.length },
    { id: 'pending', label: 'Pending', count: leaves.filter(l => l.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: leaves.filter(l => l.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: leaves.filter(l => l.status === 'rejected').length },
  ]

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
  }

  function fullName(e: Employee): string {
    return `${e.firstName} ${e.lastName}`
  }

  function getEmployeeName(id: string): string {
    const emp = employees.find(e => e.id === id)
    return emp ? fullName(emp) : id
  }

  function calcDays(from: string, to: string): number {
    if (!from || !to) return 1
    const diff = new Date(to).getTime() - new Date(from).getTime()
    return Math.max(1, Math.round(diff / 86400000) + 1)
  }

  function handleApplyLeave() {
    if (!form.employeeId || !form.fromDate || !form.toDate) return
    const days = calcDays(form.fromDate, form.toDate)
    const created = store.create<any>('leaveRequests', {
      ...form,
      days,
      status: 'pending',
      approvedBy: '',
      comments: '',
    })
    setLeaves(prev => [...prev, { ...form, id: created.id, days, status: 'pending', approvedBy: '', comments: '' }])
    setShowModal(false)
    setForm(initialForm)
  }

  function handleStatusAction() {
    if (!actionTarget) return
    const { leave, action } = actionTarget
    store.update('leaveRequests', leave.id, {
      status: action,
      approvedBy: 'current-user',
      comments: comment,
    })
    setLeaves(prev => prev.map(l => l.id === leave.id ? { ...l, status: action, approvedBy: 'current-user', comments: comment } : l))
    setActionTarget(null)
    setComment('')
  }

  const columns: Column<Leave>[] = [
    {
      key: 'employeeId',
      header: 'Employee',
      sortable: true,
      render: (l) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--text-primary)]">{getEmployeeName(l.employeeId)}</span>
        </div>
      ),
    },
    {
      key: 'leaveType',
      header: 'Leave Type',
      render: (l) => <Badge variant="info" size="sm">{l.leaveType}</Badge>,
    },
    {
      key: 'fromDate',
      header: 'From - To',
      render: (l) => (
        <span className="text-sm text-[var(--text-secondary)]">
          {store.formatDate(l.fromDate)} - {store.formatDate(l.toDate)}
        </span>
      ),
    },
    {
      key: 'days',
      header: 'Days',
      sortable: true,
      render: (l) => <span className="font-semibold">{l.days}d</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (l) => (
        <Badge variant={statusConfig[l.status]?.variant || 'default'} size="sm" dot>
          {statusConfig[l.status]?.label || l.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (l) => (
        <div className="flex gap-1">
          {l.status === 'pending' && (
            <>
              <Button size="sm" variant="ghost" icon={<FiCheckCircle />}
                onClick={() => setActionTarget({ leave: l, action: 'approved' })}
                className="text-emerald-500">Approve</Button>
              <Button size="sm" variant="ghost" icon={<FiX />}
                onClick={() => setActionTarget({ leave: l, action: 'rejected' })}
                className="text-red-500">Reject</Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Leave Management</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Track and manage leave requests</p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setShowModal(true)}>Apply Leave</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<FiCalendar />} value={stats.total} label="Total Requests" color="royal" />
        <StatsCard icon={<FiClock />} value={stats.pending} label="Pending" color="gold" />
        <StatsCard icon={<FiCheckCircle />} value={stats.approved} label="Approved" color="green" />
        <StatsCard icon={<FiX />} value={stats.rejected} label="Rejected" color="red" />
      </div>

      <Card>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />
        {sorted.length === 0 ? (
          <EmptyState
            icon={<FiCalendar size={36} />}
            title="No leave requests"
            description={activeTab === 'all' ? 'No leave requests have been submitted yet' : `No ${activeTab} leave requests`}
            action={activeTab === 'all' ? { label: 'Apply Leave', onClick: () => setShowModal(true) } : undefined}
          />
        ) : (
          <Table
            columns={columns}
            data={sorted}
            keyExtractor={l => l.id}
            pageSize={10}
          />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Apply Leave" size="md">
        <div className="space-y-4">
          <Select
            label="Employee"
            options={employees.map(e => ({ value: e.id, label: fullName(e) }))}
            value={form.employeeId}
            onChange={e => setForm(prev => ({ ...prev, employeeId: e.target.value }))}
            placeholder="Select employee"
          />
          <Select
            label="Leave Type"
            options={leaveTypes}
            value={form.leaveType}
            onChange={e => setForm(prev => ({ ...prev, leaveType: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="From Date" type="date" value={form.fromDate} onChange={e => setForm(prev => ({ ...prev, fromDate: e.target.value }))} />
            <Input label="To Date" type="date" value={form.toDate} onChange={e => setForm(prev => ({ ...prev, toDate: e.target.value }))} />
          </div>
          {form.fromDate && form.toDate && (
            <p className="text-sm text-[var(--text-tertiary)]">
              Total: <strong>{calcDays(form.fromDate, form.toDate)} day(s)</strong>
            </p>
          )}
          <Input label="Reason" value={form.reason} onChange={e => setForm(prev => ({ ...prev, reason: e.target.value }))} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleApplyLeave}>Submit Request</Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        title={`${actionTarget?.action === 'approved' ? 'Approve' : 'Reject'} Leave Request`}
        size="sm"
      >
        <p className="text-sm text-[var(--text-tertiary)] mb-4">
          {actionTarget?.action === 'approved' ? 'Confirm approval' : 'Confirm rejection'} for {actionTarget?.leave ? getEmployeeName(actionTarget.leave.employeeId) : ''}
        </p>
        <Input
          label="Comments"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Optional comments..."
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setActionTarget(null)}>Cancel</Button>
          <Button
            variant={actionTarget?.action === 'approved' ? 'primary' : 'danger'}
            onClick={handleStatusAction}
          >
            {actionTarget?.action === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </Modal>
    </PageTransition>
  )
}

function mapEmp(raw: any): Employee {
  if (raw.firstName) return raw
  const parts = (raw.name || '').split(' ')
  return {
    id: raw.id,
    firstName: parts.slice(0, -1).join(' ') || parts[0] || '',
    lastName: parts.slice(-1).join('') || '',
  }
}

function mapLeave(raw: any): Leave {
  return {
    id: raw.id,
    employeeId: raw.employeeId,
    leaveType: raw.type || raw.leaveType || '',
    fromDate: raw.startDate || raw.fromDate || '',
    toDate: raw.endDate || raw.toDate || '',
    days: raw.days || 1,
    reason: raw.reason || '',
    status: raw.status || 'pending',
    approvedBy: raw.approvedBy || '',
    comments: raw.comment || raw.comments || '',
  }
}
