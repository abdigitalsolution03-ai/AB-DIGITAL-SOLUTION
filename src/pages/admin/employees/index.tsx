import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiCalendar, FiClock, FiCheckCircle, FiX, FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiDollarSign, FiTrendingUp, FiAward, FiBook, FiHome, FiMail, FiPhone } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, StatsCard, Avatar, SearchInput, Tabs, EmptyState, ProgressBar, ConfirmDialog, LoadingSpinner } from '@/components/ui'

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  departmentId: string
  designationId: string
  salary: number
  joiningDate: string
  address: string
  emergencyContact: string
  bankDetails: string
  status: 'active' | 'inactive' | 'terminated' | 'on_leave'
  createdAt: string
}

interface Department {
  id: string
  name: string
}

interface Designation {
  id: string
  name: string
  departmentId: string
}

const initialForm: Omit<Employee, 'id' | 'createdAt'> = {
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  departmentId: '',
  designationId: '',
  salary: 0,
  joiningDate: '',
  address: '',
  emergencyContact: '',
  bankDetails: '',
  status: 'active',
}

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'warning', label: 'Inactive' },
  terminated: { variant: 'danger', label: 'Terminated' },
  on_leave: { variant: 'info', label: 'On Leave' },
}

function getDepartmentName(deptId: string, departments: Department[]): string {
  const dept = departments.find(d => d.id === deptId)
  return dept?.name || deptId
}

function getDesignationName(desId: string, designations: Designation[]): string {
  const des = designations.find(d => d.id === desId)
  return des?.name || desId
}

function mapSeedEmployee(emp: any): Employee {
  if (emp.firstName !== undefined) return emp as Employee
  return {
    id: emp.id,
    employeeId: emp.employeeId || emp.employeeId,
    firstName: (emp.name || '').split(' ').slice(0, -1).join(' ') || emp.name?.split(' ')[0] || '',
    lastName: (emp.name || '').split(' ').slice(-1).join(' ') || '',
    email: emp.email || '',
    phone: emp.phone || '',
    departmentId: emp.departmentId || emp.department || '',
    designationId: emp.designationId || emp.designation || '',
    salary: emp.salary || 0,
    joiningDate: emp.joiningDate || emp.dateOfJoining || '',
    address: emp.address || '',
    emergencyContact: emp.emergencyContact || '',
    bankDetails: emp.bankDetails || '',
    status: emp.status || 'active',
    createdAt: emp.createdAt || '',
  }
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const raw = store.getCollection<any>('employees')
    return raw.map(mapSeedEmployee)
  })
  const [departments] = useState(() => store.getCollection<any>('departments'))
  const [designations] = useState(() => store.getCollection<any>('designations'))
  const [leaveRequests] = useState(() => store.getCollection<any>('leaveRequests'))

  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
  const [viewing, setViewing] = useState<Employee | null>(null)

  const filtered = useMemo(() => {
    return employees.filter(e => {
      const name = `${e.firstName} ${e.lastName}`.toLowerCase()
      const matchesSearch = !search || name.includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())
      const matchesDept = !deptFilter || e.departmentId === deptFilter
      return matchesSearch && matchesDept
    })
  }, [employees, search, deptFilter])

  const onLeaveToday = leaveRequests.filter((lr: any) => {
    const today = new Date().toDateString()
    return new Date(lr.startDate) <= new Date() && new Date(lr.endDate) >= new Date() && lr.status === 'approved'
  }).length

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'on_leave').length + onLeaveToday,
    terminated: employees.filter(e => e.status === 'terminated').length,
  }

  const filteredDesignations = designations.filter((d: any) => d.departmentId === form.departmentId || d.department === form.departmentId)

  function openAdd() {
    setForm(initialForm)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(emp: Employee) {
    setForm({
      employeeId: emp.employeeId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      departmentId: emp.departmentId,
      designationId: emp.designationId,
      salary: emp.salary,
      joiningDate: emp.joiningDate,
      address: emp.address,
      emergencyContact: emp.emergencyContact,
      bankDetails: emp.bankDetails,
      status: emp.status,
    })
    setEditingId(emp.id)
    setShowModal(true)
  }

  function handleSave() {
    if (!form.firstName || !form.lastName || !form.email) return
    if (editingId) {
      store.update('employees', editingId, form)
      setEmployees(prev => prev.map(e => e.id === editingId ? { ...e, ...form } : e))
    } else {
      const created = store.create<any>('employees', form)
      setEmployees(prev => [...prev, { ...form, id: created.id, createdAt: created.createdAt }])
    }
    setShowModal(false)
    setEditingId(null)
    setForm(initialForm)
  }

  function handleDelete() {
    if (!deleteTarget) return
    store.delete('employees', deleteTarget.id)
    setEmployees(prev => prev.filter(e => e.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Employees</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage your workforce</p>
        </div>
        <Button icon={<FiPlus />} onClick={openAdd}>Add Employee</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<FiUsers />} value={stats.total} label="Total Employees" color="royal" />
        <StatsCard icon={<FiCheckCircle />} value={stats.active} label="Active" color="green" />
        <StatsCard icon={<FiCalendar />} value={stats.onLeave} label="On Leave" color="gold" />
        <StatsCard icon={<FiX />} value={stats.terminated} label="Terminated" color="red" />
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClear={() => setSearch('')}
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

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiUsers size={36} />}
            title={search || deptFilter ? 'No employees match your search' : 'No employees yet'}
            description={search || deptFilter ? 'Try adjusting your filters' : 'Add your first employee to get started'}
            action={(!search && !deptFilter) ? { label: 'Add Employee', onClick: openAdd } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((emp, i) => (
              <motion.div
                key={emp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="premium-card p-5 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setViewing(emp)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={`${emp.firstName} ${emp.lastName}`} size="lg" />
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{emp.firstName} {emp.lastName}</h3>
                      <p className="text-xs text-[var(--text-tertiary)]">{getDesignationName(emp.designationId, designations)}</p>
                    </div>
                  </div>
                  <Badge variant={statusConfig[emp.status]?.variant || 'default'} size="sm">
                    {statusConfig[emp.status]?.label || emp.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <FiHome size={12} className="text-[var(--text-tertiary)]" />
                    <span>{getDepartmentName(emp.departmentId, departments)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail size={12} className="text-[var(--text-tertiary)]" />
                    <span>{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone size={12} className="text-[var(--text-tertiary)]" />
                    <span>{emp.phone || '-'}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--border-color)]">
                  <Button size="sm" variant="ghost" icon={<FiEdit2 />} onClick={e => { e.stopPropagation(); openEdit(emp) }}>Edit</Button>
                  <Button size="sm" variant="ghost" icon={<FiTrash2 />} onClick={e => { e.stopPropagation(); setDeleteTarget(emp) }} className="text-red-500">Delete</Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Employee' : 'Add Employee'} size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="First Name" value={form.firstName} onChange={e => setForm(prev => ({ ...prev, firstName: e.target.value }))} required />
          <Input label="Last Name" value={form.lastName} onChange={e => setForm(prev => ({ ...prev, lastName: e.target.value }))} required />
          <Input label="Employee ID" value={form.employeeId} onChange={e => setForm(prev => ({ ...prev, employeeId: e.target.value }))} placeholder="EMP016" />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} required />
          <Input label="Phone" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} />
          <Input label="Salary" type="number" value={form.salary || ''} onChange={e => setForm(prev => ({ ...prev, salary: Number(e.target.value) }))} />
          <Input label="Joining Date" type="date" value={form.joiningDate} onChange={e => setForm(prev => ({ ...prev, joiningDate: e.target.value }))} />
          <Input label="Emergency Contact" value={form.emergencyContact} onChange={e => setForm(prev => ({ ...prev, emergencyContact: e.target.value }))} />
          <Select
            label="Department"
            options={departments.map((d: any) => ({ value: d.id, label: d.name }))}
            value={form.departmentId}
            onChange={e => setForm(prev => ({ ...prev, departmentId: e.target.value, designationId: '' }))}
            placeholder="Select department"
          />
          <Select
            label="Designation"
            options={filteredDesignations.map((d: any) => ({ value: d.id, label: d.name || d.title }))}
            value={form.designationId}
            onChange={e => setForm(prev => ({ ...prev, designationId: e.target.value }))}
            placeholder="Select designation"
          />
          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'on_leave', label: 'On Leave' },
              { value: 'terminated', label: 'Terminated' },
            ]}
            value={form.status}
            onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}
          />
          <div className="md:col-span-2">
            <Input label="Address" value={form.address} onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <Input label="Bank Details" value={form.bankDetails} onChange={e => setForm(prev => ({ ...prev, bankDetails: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'} Employee</Button>
        </div>
      </Modal>

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Employee Details" size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={`${viewing.firstName} ${viewing.lastName}`} size="xl" />
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{viewing.firstName} {viewing.lastName}</h3>
                <p className="text-sm text-[var(--text-tertiary)]">{getDesignationName(viewing.designationId, designations)}</p>
                <Badge variant={statusConfig[viewing.status]?.variant || 'default'} size="sm">{statusConfig[viewing.status]?.label}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-[var(--text-tertiary)]">Employee ID</span><p className="font-medium">{viewing.employeeId}</p></div>
              <div><span className="text-[var(--text-tertiary)]">Department</span><p className="font-medium">{getDepartmentName(viewing.departmentId, departments)}</p></div>
              <div><span className="text-[var(--text-tertiary)]">Email</span><p className="font-medium">{viewing.email}</p></div>
              <div><span className="text-[var(--text-tertiary)]">Phone</span><p className="font-medium">{viewing.phone || '-'}</p></div>
              <div><span className="text-[var(--text-tertiary)]">Salary</span><p className="font-medium">₹{viewing.salary?.toLocaleString() || '-'}</p></div>
              <div><span className="text-[var(--text-tertiary)]">Joined</span><p className="font-medium">{viewing.joiningDate ? store.formatDate(viewing.joiningDate) : '-'}</p></div>
              <div className="col-span-2"><span className="text-[var(--text-tertiary)]">Address</span><p className="font-medium">{viewing.address || '-'}</p></div>
              <div className="col-span-2"><span className="text-[var(--text-tertiary)]">Emergency Contact</span><p className="font-medium">{viewing.emergencyContact || '-'}</p></div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
