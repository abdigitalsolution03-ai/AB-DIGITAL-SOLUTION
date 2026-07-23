import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUsers, FiEdit2, FiTrash2, FiPlus, FiChevronDown, FiChevronUp, FiHome } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, StatsCard, Avatar, SearchInput, EmptyState, ConfirmDialog } from '@/components/ui'

interface Department {
  id: string
  name: string
  description: string
  hod: string
  status: 'active' | 'inactive'
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  departmentId: string
  designationId: string
  status: string
}

const initialForm = { name: '', description: '', hod: '', status: 'active' as const }

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>(() => store.getCollection<Department>('departments'))
  const [employees] = useState<Employee[]>(() => store.getCollection<any>('employees').map(mapEmp))
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null)
  const [expandedDept, setExpandedDept] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return departments.filter(d =>
      !search || d.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [departments, search])

  function getEmployeeCount(deptId: string): number {
    return employees.filter(e => e.departmentId === deptId).length
  }

  function getDeptEmployees(deptId: string): Employee[] {
    return employees.filter(e => e.departmentId === deptId)
  }

  function openAdd() {
    setForm(initialForm)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(dept: Department) {
    setForm({ name: dept.name, description: dept.description, hod: dept.hod, status: dept.status })
    setEditingId(dept.id)
    setShowModal(true)
  }

  function handleSave() {
    if (!form.name) return
    if (editingId) {
      store.update('departments', editingId, form)
      setDepartments(prev => prev.map(d => d.id === editingId ? { ...d, ...form } : d))
    } else {
      const created = store.create<any>('departments', form)
      setDepartments(prev => [...prev, { ...form, id: created.id }])
    }
    setShowModal(false)
    setEditingId(null)
    setForm(initialForm)
  }

  function handleDelete() {
    if (!deleteTarget) return
    store.delete('departments', deleteTarget.id)
    setDepartments(prev => prev.filter(d => d.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Departments</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Organize your company structure</p>
        </div>
        <Button icon={<FiPlus />} onClick={openAdd}>Add Department</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search departments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiHome size={36} />}
            title={search ? 'No departments match your search' : 'No departments yet'}
            description={search ? 'Try a different search' : 'Create your first department to get started'}
            action={!search ? { label: 'Add Department', onClick: openAdd } : undefined}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((dept, i) => {
            const empCount = getEmployeeCount(dept.id)
            const deptEmployees = getDeptEmployees(dept.id)
            const isExpanded = expandedDept === dept.id
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="premium-card"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--royal-blue)]">
                        <FiHome size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{dept.name}</h3>
                        {dept.description && (
                          <p className="text-xs text-[var(--text-tertiary)]">{dept.description}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={dept.status === 'active' ? 'success' : 'danger'} size="sm">
                      {dept.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mb-3">
                    <span className="flex items-center gap-1"><FiUsers size={12} /> {empCount} employees</span>
                    {dept.hod && <span>Head: {dept.hod}</span>}
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-[var(--border-color)]">
                    <Button size="sm" variant="ghost" icon={isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      onClick={() => setExpandedDept(isExpanded ? null : dept.id)}>
                      {isExpanded ? 'Hide' : 'View'} Employees
                    </Button>
                    <Button size="sm" variant="ghost" icon={<FiEdit2 />} onClick={() => openEdit(dept)}>Edit</Button>
                    <Button size="sm" variant="ghost" icon={<FiTrash2 />} onClick={() => setDeleteTarget(dept)} className="text-red-500">Delete</Button>
                  </div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-[var(--border-color)]"
                    >
                      <div className="p-4 space-y-2">
                        {deptEmployees.length === 0 ? (
                          <p className="text-xs text-[var(--text-tertiary)] text-center py-3">No employees in this department</p>
                        ) : deptEmployees.map((emp, j) => (
                          <motion.div
                            key={emp.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.03 }}
                            className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-secondary)]"
                          >
                            <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{emp.firstName} {emp.lastName}</p>
                            </div>
                            <Badge variant={emp.status === 'active' ? 'success' : 'warning'} size="sm">{emp.status}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Department' : 'Add Department'} size="md">
        <div className="space-y-4">
          <Input label="Department Name" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required />
          <Input label="Description" value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
          <Input label="Head of Department" value={form.hod} onChange={e => setForm(prev => ({ ...prev, hod: e.target.value }))} placeholder="Name of HOD" />
          <Select
            label="Status"
            options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
            value={form.status}
            onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'} Department</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
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
    departmentId: raw.departmentId || raw.department || '',
    designationId: raw.designationId || raw.designation || '',
    status: raw.status || 'active',
  }
}
