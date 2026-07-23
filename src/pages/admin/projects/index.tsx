import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiUsers, FiCalendar,
  FiDollarSign, FiClock, FiEye, FiX, FiChevronDown
} from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { getSession, hasRole } from '@/services/auth'
import {
  Button, Card, Badge, Avatar, ProgressBar, SearchInput,
  Select, Modal, Input, ConfirmDialog, EmptyState, Tabs
} from '@/components/ui'

const { getCollection, getById, create, update, delete: remove, generateId, formatDate, formatCurrency } = store

type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent'

interface Project {
  id: string
  name: string
  description: string
  clientId: string
  managerId: string
  team: string[]
  departmentId: string
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string
  endDate: string
  deadline: string
  budget: number
  progress: number
  milestones: string[]
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

interface Employee {
  id: string
  name: string
  email: string
  department: string
}

const statusTabs = [
  { id: 'all', label: 'All' },
  { id: 'planning', label: 'Planning' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'on_hold', label: 'On Hold' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

const statusColors: Record<string, 'info' | 'warning' | 'danger' | 'success' | 'default'> = {
  planning: 'info',
  in_progress: 'warning',
  on_hold: 'default',
  completed: 'success',
  cancelled: 'danger',
}

const priorityColors: Record<string, string> = {
  low: '#3B82F6',
  medium: '#F59E0B',
  high: '#F97316',
  urgent: '#EF4444',
}

type ModalMode = 'create' | 'edit' | 'detail' | null

const emptyForm = {
  name: '',
  description: '',
  clientId: '',
  managerId: '',
  team: [] as string[],
  departmentId: '',
  status: 'planning' as ProjectStatus,
  priority: 'medium' as ProjectPriority,
  startDate: '',
  endDate: '',
  deadline: '',
  budget: 0,
  progress: 0,
}

export default function ProjectsPage() {
  const session = getSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = () => {
    setProjects(getCollection<Project>('projects'))
    setClients(getCollection<Client>('clients'))
    setEmployees(getCollection<Employee>('employees'))
  }

  useEffect(() => { loadData() }, [])

  const clientMap = useMemo(() => {
    const map = new Map<string, Client>()
    clients.forEach(c => map.set(c.id, { ...c, company: c.company || `${c.firstName} ${c.lastName}` }))
    return map
  }, [clients])

  const userMap = useMemo(() => {
    const map = new Map<string, string>()
    employees.forEach(e => map.set(e.id, e.name))
    const users = getCollection<{ id: string; name: string }>('users')
    users.forEach(u => map.set(u.id, u.name))
    return map
  }, [employees])

  const filtered = useMemo(() => {
    let list = projects
    if (activeTab !== 'all') list = list.filter(p => p.status === activeTab)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        clientMap.get(p.clientId)?.company?.toLowerCase().includes(q) ||
        userMap.get(p.managerId)?.toLowerCase().includes(q)
      )
    }
    if (statusFilter) list = list.filter(p => p.status === statusFilter)
    return list
  }, [projects, activeTab, search, statusFilter, clientMap, userMap])

  const getEmployeeName = (id: string) => userMap.get(id) || id

  const openCreate = () => {
    setForm(emptyForm)
    setEditingId(null)
    setModalMode('create')
  }

  const openEdit = (p: Project) => {
    setForm({
      name: p.name,
      description: p.description || '',
      clientId: p.clientId || '',
      managerId: p.managerId || '',
      team: p.team || [],
      departmentId: p.departmentId || '',
      status: p.status,
      priority: p.priority,
      startDate: p.startDate ? p.startDate.split('T')[0] : '',
      endDate: p.endDate ? p.endDate.split('T')[0] : '',
      deadline: p.deadline ? p.deadline.split('T')[0] : '',
      budget: p.budget || 0,
      progress: p.progress || 0,
    })
    setEditingId(p.id)
    setModalMode('edit')
  }

  const openDetail = (p: Project) => {
    setDetailProject(p)
    setModalMode('detail')
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingId) {
      update<Project>('projects', editingId, form as any)
    } else {
      create<Project>('projects', form as any)
    }
    loadData()
    setModalMode(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      remove('projects', deleteId)
      loadData()
      setDeleteId(null)
    }
  }

  const toggleTeamMember = (id: string) => {
    setForm(prev => ({
      ...prev,
      team: prev.team.includes(id)
        ? prev.team.filter(t => t !== id)
        : [...prev.team, id],
    }))
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              Manage and track all projects
            </p>
          </div>
          <Button onClick={openCreate} icon={<FiPlus />}>
            New Project
          </Button>
        </div>

        <Tabs tabs={statusTabs.map(t => ({
          ...t,
          count: t.id === 'all' ? projects.length : projects.filter(p => p.status === t.id).length,
        }))} activeTab={activeTab} onChange={setActiveTab} />

        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'planning', label: 'Planning' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'on_hold', label: 'On Hold' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-44"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiFolder size={36} />}
            title="No projects found"
            description={search || statusFilter ? 'Try adjusting your filters' : 'Create your first project to get started'}
            action={!search && !statusFilter ? { label: 'New Project', onClick: openCreate } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((project, i) => {
                const client = clientMap.get(project.clientId)
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    layout
                  >
                    <Card
                      padding="md"
                      className="h-full flex flex-col cursor-pointer"
                      hoverable
                    >
                      <div onClick={() => openDetail(project)} className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-2 flex-1">
                            {project.name}
                          </h3>
                          <span
                            className="shrink-0 ml-2 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase"
                            style={{ backgroundColor: priorityColors[project.priority] }}
                          >
                            {project.priority}
                          </span>
                        </div>

                        <Badge variant={statusColors[project.status] || 'default'} size="sm">
                          {project.status.replace('_', ' ')}
                        </Badge>

                        <div className="mt-3">
                          <ProgressBar value={project.progress || 0} size="sm" showPercentage />
                        </div>

                        {client && (
                          <p className="text-sm text-[var(--text-tertiary)] mt-3 flex items-center gap-1.5">
                            <FiUsers size={13} />
                            {client.company || `${client.firstName} ${client.lastName}`}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-tertiary)]">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={12} />
                            {project.startDate ? formatDate(project.startDate) : '-'}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiDollarSign size={12} />
                            {project.budget ? formatCurrency(project.budget) : '-'}
                          </span>
                        </div>

                        {project.managerId && (
                          <p className="text-xs text-[var(--text-tertiary)] mt-2">
                            Manager: {getEmployeeName(project.managerId)}
                          </p>
                        )}

                        {project.team && project.team.length > 0 && (
                          <div className="flex items-center mt-3">
                            <div className="flex -space-x-1.5">
                              {project.team.slice(0, 4).map(memberId => (
                                <Avatar
                                  key={memberId}
                                  name={getEmployeeName(memberId)}
                                  size="xs"
                                  className="border-2 border-[var(--bg-primary)]"
                                />
                              ))}
                              {project.team.length > 4 && (
                                <span className="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] text-[10px] font-medium text-[var(--text-tertiary)] flex items-center justify-center border-2 border-[var(--bg-primary)]">
                                  +{project.team.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-1 pt-3 mt-3 border-t border-[var(--border-primary)]">
                        <button
                          onClick={e => { e.stopPropagation(); openEdit(project) }}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--royal-500)] transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setDeleteId(project.id) }}
                          className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={() => setModalMode(null)}
        title={editingId ? 'Edit Project' : 'New Project'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Project Name"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name"
            />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Description</label>
            <textarea
              className="form-input min-h-[80px] resize-none"
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description"
            />
          </div>
          <Select
            label="Client"
            options={clients.map(c => ({
              value: c.id,
              label: c.company || `${c.firstName} ${c.lastName}`,
            }))}
            value={form.clientId}
            onChange={e => setForm(prev => ({ ...prev, clientId: e.target.value }))}
            placeholder="Select client"
          />
          <Select
            label="Manager"
            options={employees.map(e => ({ value: e.id, label: e.name }))}
            value={form.managerId}
            onChange={e => setForm(prev => ({ ...prev, managerId: e.target.value }))}
            placeholder="Select manager"
          />
          <Select
            label="Status"
            options={[
              { value: 'planning', label: 'Planning' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'on_hold', label: 'On Hold' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={form.status}
            onChange={e => setForm(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
          />
          <Select
            label="Priority"
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
            value={form.priority}
            onChange={e => setForm(prev => ({ ...prev, priority: e.target.value as ProjectPriority }))}
          />
          <Input
            label="Start Date"
            type="date"
            value={form.startDate}
            onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
          />
          <Input
            label="End Date"
            type="date"
            value={form.endDate}
            onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
          />
          <Input
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))}
          />
          <Input
            label="Budget (INR)"
            type="number"
            value={form.budget || ''}
            onChange={e => setForm(prev => ({ ...prev, budget: Number(e.target.value) }))}
          />
          <Input
            label="Progress (%)"
            type="number"
            min={0}
            max={100}
            value={form.progress}
            onChange={e => setForm(prev => ({ ...prev, progress: Math.min(100, Math.max(0, Number(e.target.value))) }))}
          />
          <div className="md:col-span-2">
            <label className="form-label">Team Members</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3 rounded-xl border border-[var(--border-primary)]">
              {employees.map(emp => (
                <label
                  key={emp.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    form.team.includes(emp.id)
                      ? 'bg-[var(--royal-50)] text-[var(--royal-700)] border border-[var(--royal-200)]'
                      : 'hover:bg-[var(--bg-tertiary)] border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.team.includes(emp.id)}
                    onChange={() => toggleTeamMember(emp.id)}
                    className="accent-[var(--royal-500)]"
                  />
                  <span className="text-sm">{emp.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setModalMode(null)}>Cancel</Button>
          <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'} Project</Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalMode === 'detail' && !!detailProject}
        onClose={() => { setModalMode(null); setDetailProject(null) }}
        title={detailProject?.name || 'Project Details'}
        size="lg"
      >
        {detailProject && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Badge variant={statusColors[detailProject.status] || 'default'}>
                {detailProject.status.replace('_', ' ')}
              </Badge>
              <span
                className="px-2.5 py-0.5 rounded text-xs font-bold text-white uppercase"
                style={{ backgroundColor: priorityColors[detailProject.priority] }}
              >
                {detailProject.priority}
              </span>
            </div>

            <p className="text-sm text-[var(--text-secondary)]">{detailProject.description || 'No description'}</p>

            <ProgressBar value={detailProject.progress || 0} showPercentage />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[var(--text-tertiary)]">Client</p>
                <p className="font-medium text-[var(--text-primary)]">
                  {clientMap.get(detailProject.clientId)?.company || '-'}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Manager</p>
                <p className="font-medium text-[var(--text-primary)]">
                  {getEmployeeName(detailProject.managerId)}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Start Date</p>
                <p className="font-medium text-[var(--text-primary)]">
                  {detailProject.startDate ? formatDate(detailProject.startDate) : '-'}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">End Date</p>
                <p className="font-medium text-[var(--text-primary)]">
                  {detailProject.endDate ? formatDate(detailProject.endDate) : '-'}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Deadline</p>
                <p className="font-medium text-[var(--text-primary)]">
                  {detailProject.deadline ? formatDate(detailProject.deadline) : '-'}
                </p>
              </div>
              <div>
                <p className="text-[var(--text-tertiary)]">Budget</p>
                <p className="font-medium text-[var(--text-primary)]">
                  {detailProject.budget ? formatCurrency(detailProject.budget) : '-'}
                </p>
              </div>
            </div>

            {detailProject.team && detailProject.team.length > 0 && (
              <div>
                <p className="text-sm text-[var(--text-tertiary)] mb-2">Team ({detailProject.team.length})</p>
                <div className="flex flex-wrap gap-2">
                  {detailProject.team.map(memberId => (
                    <div key={memberId} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-tertiary)]">
                      <Avatar name={getEmployeeName(memberId)} size="xs" />
                      <span className="text-xs font-medium text-[var(--text-primary)]">
                        {getEmployeeName(memberId)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-primary)]">
              <Button variant="outline" onClick={() => { openEdit(detailProject); setModalMode(null) }}>
                <FiEdit2 size={14} /> Edit
              </Button>
              <Button variant="ghost" onClick={() => { setModalMode(null); setDetailProject(null) }}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </PageTransition>
  )
}
