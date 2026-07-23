import { useState, useMemo } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiBriefcase } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, EmptyState, ConfirmDialog } from '@/components/ui'
import type { Column } from '@/components/ui'

interface Designation {
  id: string
  name: string
  departmentId: string
  description: string
  salaryRange: string
}

interface Department {
  id: string
  name: string
}

const initialForm = { name: '', departmentId: '', description: '', salaryRange: '' }

export default function Designations() {
  const [designations, setDesignations] = useState<Designation[]>(() => store.getCollection<any>('designations').map(mapDes))
  const [departments] = useState<Department[]>(() => store.getCollection<any>('departments'))
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [deleteTarget, setDeleteTarget] = useState<Designation | null>(null)

  const filtered = useMemo(() => {
    return designations.filter(d => {
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase())
      const matchDept = !deptFilter || d.departmentId === deptFilter
      return matchSearch && matchDept
    })
  }, [designations, search, deptFilter])

  function getDeptName(id: string): string {
    return departments.find(d => d.id === id)?.name || id
  }

  function openAdd() {
    setForm(initialForm)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(des: Designation) {
    setForm({ name: des.name, departmentId: des.departmentId, description: des.description, salaryRange: des.salaryRange })
    setEditingId(des.id)
    setShowModal(true)
  }

  function handleSave() {
    if (!form.name || !form.departmentId) return
    if (editingId) {
      store.update('designations', editingId, form)
      setDesignations(prev => prev.map(d => d.id === editingId ? { ...d, ...form } : d))
    } else {
      const created = store.create<any>('designations', form)
      setDesignations(prev => [...prev, { ...form, id: created.id }])
    }
    setShowModal(false)
    setForm(initialForm)
  }

  function handleDelete() {
    if (!deleteTarget) return
    store.delete('designations', deleteTarget.id)
    setDesignations(prev => prev.filter(d => d.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const columns: Column<Designation>[] = [
    {
      key: 'name',
      header: 'Designation',
      sortable: true,
      render: (d) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--royal-blue)]">
            <FiBriefcase size={14} />
          </div>
          <div>
            <p className="font-medium text-[var(--text-primary)]">{d.name}</p>
            {d.description && <p className="text-xs text-[var(--text-tertiary)]">{d.description}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'departmentId',
      header: 'Department',
      sortable: true,
      render: (d) => <Badge variant="info" size="sm">{getDeptName(d.departmentId)}</Badge>,
    },
    {
      key: 'salaryRange',
      header: 'Salary Range',
      sortable: true,
      render: (d) => <span className="text-sm font-medium text-[var(--text-primary)]">{d.salaryRange || '-'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (d) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" icon={<FiEdit2 />} onClick={() => openEdit(d)}>Edit</Button>
          <Button size="sm" variant="ghost" icon={<FiTrash2 />} onClick={() => setDeleteTarget(d)} className="text-red-500">Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Designations</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Define job titles and roles</p>
        </div>
        <Button icon={<FiPlus />} onClick={openAdd}>Add Designation</Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search designations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<FiBriefcase />}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[
                { value: '', label: 'All Departments' },
                ...departments.map((d: any) => ({ value: d.id, label: d.name })),
              ]}
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={filtered}
          keyExtractor={d => d.id}
          emptyMessage="No designations found"
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Designation' : 'Add Designation'} size="md">
        <div className="space-y-4">
          <Input label="Designation Name" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required />
          <Select
            label="Department"
            options={departments.map((d: any) => ({ value: d.id, label: d.name }))}
            value={form.departmentId}
            onChange={e => setForm(prev => ({ ...prev, departmentId: e.target.value }))}
            placeholder="Select department"
          />
          <Input label="Salary Range" value={form.salaryRange} onChange={e => setForm(prev => ({ ...prev, salaryRange: e.target.value }))} placeholder="e.g. ₹5L - ₹10L" />
          <Input label="Description" value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'} Designation</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Designation"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}

function mapDes(raw: any): Designation {
  if (raw.name && raw.departmentId !== undefined) return raw as Designation
  return {
    id: raw.id,
    name: raw.title || raw.name || '',
    departmentId: raw.departmentId || raw.department || '',
    description: raw.description || '',
    salaryRange: raw.salaryRange || (raw.minSalary ? `₹${(raw.minSalary / 100000).toFixed(1)}L - ₹${(raw.maxSalary / 100000).toFixed(1)}L` : ''),
  }
}
