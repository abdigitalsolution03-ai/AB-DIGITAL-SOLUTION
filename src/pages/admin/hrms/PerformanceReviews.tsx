import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiStar, FiEdit2, FiTrash2 } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, StatsCard, ProgressBar, EmptyState, ConfirmDialog } from '@/components/ui'
import type { Column } from '@/components/ui'

interface PerformanceReview {
  id: string
  employeeId: string
  reviewerId: string
  reviewPeriod: string
  rating: number
  goals: string
  achievements: string
  overallRating: number
  status: 'pending' | 'completed' | 'in_progress'
}

interface Employee {
  id: string
  firstName: string
  lastName: string
}

const initialForm = {
  employeeId: '',
  reviewerId: '',
  reviewPeriod: '',
  rating: 3,
  goals: '',
  achievements: '',
  overallRating: 3,
  status: 'pending' as const,
}

const reviewPeriods = [
  { value: 'Q1 2025', label: 'Q1 2025' },
  { value: 'Q2 2025', label: 'Q2 2025' },
  { value: 'Q3 2025', label: 'Q3 2025' },
  { value: 'Q4 2025', label: 'Q4 2025' },
  { value: 'Q1 2026', label: 'Q1 2026' },
  { value: 'Q2 2026', label: 'Q2 2026' },
  { value: 'Annual 2025', label: 'Annual 2025' },
]

export default function PerformanceReviews() {
  const [reviews, setReviews] = useState<PerformanceReview[]>(() => store.getCollection<any>('performanceReviews').map(mapPerf))
  const [employees] = useState<Employee[]>(() => store.getCollection<any>('employees').map(mapEmp))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [deleteTarget, setDeleteTarget] = useState<PerformanceReview | null>(null)

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      const name = getEmployeeName(r.employeeId).toLowerCase()
      const matchSearch = !search || name.includes(search.toLowerCase())
      const matchStatus = !statusFilter || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [reviews, search, statusFilter])

  function fullName(e: Employee): string {
    return `${e.firstName} ${e.lastName}`
  }

  function getEmployeeName(id: string): string {
    const emp = employees.find(e => e.id === id)
    return emp ? fullName(emp) : id
  }

  function openAdd() {
    setForm(initialForm)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(review: PerformanceReview) {
    setForm({
      employeeId: review.employeeId,
      reviewerId: review.reviewerId,
      reviewPeriod: review.reviewPeriod,
      rating: review.rating,
      goals: review.goals,
      achievements: review.achievements,
      overallRating: review.overallRating,
      status: review.status,
    })
    setEditingId(review.id)
    setShowModal(true)
  }

  function handleSave() {
    if (!form.employeeId || !form.reviewerId || !form.reviewPeriod) return
    if (editingId) {
      store.update('performanceReviews', editingId, form)
      setReviews(prev => prev.map(r => r.id === editingId ? { ...r, ...form } : r))
    } else {
      const created = store.create<any>('performanceReviews', form)
      setReviews(prev => [...prev, { ...form, id: created.id }])
    }
    setShowModal(false)
    setForm(initialForm)
  }

  function handleDelete() {
    if (!deleteTarget) return
    store.delete('performanceReviews', deleteTarget.id)
    setReviews(prev => prev.filter(r => r.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <FiStar
            key={star}
            size={14}
            className={star <= Math.round(rating) ? 'fill-gold-400 text-gold-400' : 'text-[var(--text-tertiary)]'}
          />
        ))}
        <span className="text-xs text-[var(--text-secondary)] ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const stats = {
    total: reviews.length,
    completed: reviews.filter(r => r.status === 'completed').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    inProgress: reviews.filter(r => r.status === 'in_progress').length,
    avgRating: reviews.length > 0 ? reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length : 0,
  }

  const columns: Column<PerformanceReview>[] = [
    {
      key: 'employeeId',
      header: 'Employee',
      sortable: true,
      render: (r) => (
        <span className="font-medium text-[var(--text-primary)]">{getEmployeeName(r.employeeId)}</span>
      ),
    },
    {
      key: 'reviewerId',
      header: 'Reviewer',
      render: (r) => (
        <span className="text-[var(--text-secondary)]">{getEmployeeName(r.reviewerId)}</span>
      ),
    },
    {
      key: 'reviewPeriod',
      header: 'Period',
      sortable: true,
      render: (r) => <Badge variant="info" size="sm">{r.reviewPeriod}</Badge>,
    },
    {
      key: 'overallRating',
      header: 'Rating',
      sortable: true,
      render: (r) => renderStars(r.overallRating),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (r) => (
        <Badge
          variant={r.status === 'completed' ? 'success' : r.status === 'in_progress' ? 'warning' : 'default'}
          size="sm"
          dot
        >
          {r.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" icon={<FiEdit2 />} onClick={() => openEdit(r)} />
          <Button size="sm" variant="ghost" icon={<FiTrash2 />} onClick={() => setDeleteTarget(r)} className="text-red-500" />
        </div>
      ),
    },
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Performance Reviews</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Review and evaluate employee performance</p>
        </div>
        <Button icon={<FiPlus />} onClick={openAdd}>Add Review</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard icon={<FiStar />} value={stats.total} label="Total Reviews" color="royal" />
        <StatsCard icon={<FiStar />} value={stats.completed} label="Completed" color="green" />
        <StatsCard icon={<FiStar />} value={stats.pending} label="Pending" color="gold" />
        <StatsCard icon={<FiStar />} value={stats.inProgress} label="In Progress" color="purple" />
        <StatsCard icon={<FiStar />} value={stats.avgRating.toFixed(1)} label="Avg Rating" color="gold" />
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by employee name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<FiStar />}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              options={[
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiStar size={36} />}
            title="No reviews found"
            description={search || statusFilter ? 'Try adjusting your filters' : 'Create your first performance review'}
            action={(!search && !statusFilter) ? { label: 'Add Review', onClick: openAdd } : undefined}
          />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={r => r.id}
            pageSize={10}
          />
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Review' : 'Add Review'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Employee"
              options={employees.map(e => ({ value: e.id, label: fullName(e) }))}
              value={form.employeeId}
              onChange={e => setForm(prev => ({ ...prev, employeeId: e.target.value }))}
              placeholder="Select employee"
            />
            <Select
              label="Reviewer"
              options={employees.map(e => ({ value: e.id, label: fullName(e) }))}
              value={form.reviewerId}
              onChange={e => setForm(prev => ({ ...prev, reviewerId: e.target.value }))}
              placeholder="Select reviewer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Review Period"
              options={reviewPeriods}
              value={form.reviewPeriod}
              onChange={e => setForm(prev => ({ ...prev, reviewPeriod: e.target.value }))}
              placeholder="Select period"
            />
            <Select
              label="Status"
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              value={form.status}
              onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}
            />
          </div>
          <div>
            <label className="form-label">Overall Rating: {form.overallRating.toFixed(1)}</label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={form.overallRating}
              onChange={e => setForm(prev => ({ ...prev, overallRating: parseFloat(e.target.value) }))}
              className="w-full accent-[var(--royal-blue)]"
            />
            <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
              <span>1 - Poor</span>
              <span>3 - Average</span>
              <span>5 - Excellent</span>
            </div>
          </div>
          {form.overallRating > 0 && (
            <div className="flex items-center gap-2">
              {renderStars(form.overallRating)}
            </div>
          )}
          <ProgressBar value={form.overallRating} max={5} label="Rating" color="gold" size="sm" />
          <div>
            <label className="form-label">Goals</label>
            <textarea
              className="form-input min-h-[80px] resize-y"
              value={form.goals}
              onChange={e => setForm(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="Describe goals for this review period..."
            />
          </div>
          <div>
            <label className="form-label">Achievements</label>
            <textarea
              className="form-input min-h-[80px] resize-y"
              value={form.achievements}
              onChange={e => setForm(prev => ({ ...prev, achievements: e.target.value }))}
              placeholder="Describe achievements..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'} Review</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        message={`Are you sure you want to delete this review?`}
        confirmLabel="Delete"
        variant="danger"
      />
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

function mapPerf(raw: any): PerformanceReview {
  const rating = raw.overallRating || raw.rating || raw.ratings?.overallRating || 0
  return {
    id: raw.id,
    employeeId: raw.employeeId,
    reviewerId: raw.reviewerId || '',
    reviewPeriod: raw.period || raw.reviewPeriod || '',
    rating: typeof raw.rating === 'number' ? raw.rating : rating,
    goals: raw.goals || raw.strengths || '',
    achievements: raw.achievements || raw.improvements || '',
    overallRating: rating,
    status: raw.status || 'pending',
  }
}
