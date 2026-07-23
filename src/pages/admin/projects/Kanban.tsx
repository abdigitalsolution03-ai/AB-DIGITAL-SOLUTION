import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiClock, FiCalendar, FiUser } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Button, Badge, Avatar, Modal, Input, Select, EmptyState } from '@/components/ui'

const { getCollection, getById, update, create, generateId, formatDate } = store

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

interface Task {
  id: string
  title: string
  description: string
  projectId: string
  milestoneId: string
  assignedTo: string
  assignedBy: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  estimatedHours: number
  actualHours: number
  comments: string[]
  attachments: string[]
  order: number
  createdAt: string
}

interface Project {
  id: string
  name: string
}

interface Employee {
  id: string
  name: string
}

const columns: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
]

const priorityColors: Record<string, string> = {
  low: '#3B82F6',
  medium: '#F59E0B',
  high: '#F97316',
  urgent: '#EF4444',
}

const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [dragTaskId, setDragTaskId] = useState<string | null>(null)
  const [dragSourceCol, setDragSourceCol] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'medium' as TaskPriority,
    status: 'todo' as TaskStatus,
    dueDate: '',
    estimatedHours: 0,
  })

  const loadData = () => {
    setTasks(getCollection<Task>('tasks'))
    setProjects(getCollection<Project>('projects'))
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

  const projectMap = useMemo(() => {
    const map = new Map<string, string>()
    projects.forEach(p => map.set(p.id, p.name))
    return map
  }, [projects])

  const filteredTasks = useMemo(() => {
    let list = tasks
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        userMap.get(t.assignedTo)?.toLowerCase().includes(q)
      )
    }
    if (projectFilter) list = list.filter(t => t.projectId === projectFilter)
    return list
  }, [tasks, search, projectFilter, userMap])

  const columnTasks = useMemo(() => {
    const grouped: Record<string, Task[]> = { todo: [], in_progress: [], review: [], done: [] }
    columns.forEach(c => { grouped[c.id] = [] })
    filteredTasks.forEach(t => {
      if (grouped[t.status]) grouped[t.status].push(t)
    })
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => (a.order || 0) - (b.order || 0))
    })
    return grouped
  }, [filteredTasks])

  const handleDragStart = useCallback((taskId: string, colId: string) => {
    setDragTaskId(taskId)
    setDragSourceCol(colId)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback((targetColId: TaskStatus) => {
    if (!dragTaskId || !dragSourceCol) return
    if (dragSourceCol === targetColId) {
      setDragTaskId(null)
      setDragSourceCol(null)
      return
    }
    update<Task>('tasks', dragTaskId, { status: targetColId } as any)
    setTasks(prev => prev.map(t =>
      t.id === dragTaskId ? { ...t, status: targetColId } : t
    ))
    setDragTaskId(null)
    setDragSourceCol(null)
  }, [dragTaskId, dragSourceCol])

  const handleCreateTask = () => {
    if (!newTaskForm.title.trim()) return
    const colTasks = columnTasks[newTaskForm.status] || []
    create<Task>('tasks', {
      ...newTaskForm,
      order: colTasks.length,
      milestoneId: '',
      assignedBy: '',
      actualHours: 0,
      comments: [],
      attachments: [],
    } as any)
    loadData()
    setShowCreateModal(false)
    setNewTaskForm({
      title: '',
      description: '',
      projectId: '',
      assignedTo: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      estimatedHours: 0,
    })
  }

  const getEmployeeName = (id: string) => userMap.get(id) || id

  return (
    <PageTransition>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Kanban Board</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
              Drag and drop tasks to update status
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} icon={<FiPlus />}>
            Add Task
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input pl-10"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select
            className="form-input w-48"
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[70vh]" style={{ scrollbarWidth: 'thin' }}>
          {columns.map(col => {
            const tasksInCol = columnTasks[col.id] || []
            return (
              <div
                key={col.id}
                className="flex-shrink-0 w-72 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] flex flex-col"
                onDragOver={handleDragOver}
                onDrop={e => {
                  e.preventDefault()
                  handleDrop(col.id)
                }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-primary)]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{col.label}</h3>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] font-medium">
                      {tasksInCol.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 p-3 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                  <AnimatePresence>
                    {tasksInCol.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-[var(--text-tertiary)]">
                        <p className="text-xs">No tasks</p>
                      </div>
                    ) : (
                      tasksInCol.map((task, idx) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: idx * 0.02 }}
                          draggable
                          onDragStart={() => handleDragStart(task.id, col.id)}
                          className={`bg-[var(--bg-primary)] rounded-xl p-3.5 border border-[var(--border-primary)] shadow-sm cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
                            dragTaskId === task.id ? 'opacity-50 scale-95' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 flex-1">
                              {task.title}
                            </h4>
                            <span
                              className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase"
                              style={{ backgroundColor: priorityColors[task.priority] }}
                            >
                              {priorityLabels[task.priority]}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-xs text-[var(--text-tertiary)] mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-[var(--text-tertiary)]">
                            {task.assignedTo && (
                              <span className="flex items-center gap-1 bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
                                <Avatar name={getEmployeeName(task.assignedTo)} size="xs" />
                                {getEmployeeName(task.assignedTo)}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="flex items-center gap-1">
                                <FiCalendar size={11} />
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                            {task.estimatedHours > 0 && (
                              <span className="flex items-center gap-1">
                                <FiClock size={11} />
                                {task.estimatedHours}h
                              </span>
                            )}
                          </div>

                          {task.projectId && projectMap.has(task.projectId) && (
                            <div className="mt-2 pt-2 border-t border-[var(--border-primary)]">
                              <span className="text-[10px] text-[var(--text-tertiary)]">
                                {projectMap.get(task.projectId)}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Task"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newTaskForm.title}
            onChange={e => setNewTaskForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Task title"
          />
          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-input min-h-[80px] resize-none"
              value={newTaskForm.description}
              onChange={e => setNewTaskForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Task description"
            />
          </div>
          <Select
            label="Project"
            options={projects.map(p => ({ value: p.id, label: p.name }))}
            value={newTaskForm.projectId}
            onChange={e => setNewTaskForm(prev => ({ ...prev, projectId: e.target.value }))}
            placeholder="Select project"
          />
          <Select
            label="Assign To"
            options={employees.map(e => ({ value: e.id, label: e.name }))}
            value={newTaskForm.assignedTo}
            onChange={e => setNewTaskForm(prev => ({ ...prev, assignedTo: e.target.value }))}
            placeholder="Select assignee"
          />
          <Select
            label="Priority"
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
            value={newTaskForm.priority}
            onChange={e => setNewTaskForm(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
          />
          <Select
            label="Status"
            options={columns.map(c => ({ value: c.id, label: c.label }))}
            value={newTaskForm.status}
            onChange={e => setNewTaskForm(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
          />
          <Input
            label="Due Date"
            type="date"
            value={newTaskForm.dueDate}
            onChange={e => setNewTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
          />
          <Input
            label="Estimated Hours"
            type="number"
            min={0}
            value={newTaskForm.estimatedHours || ''}
            onChange={e => setNewTaskForm(prev => ({ ...prev, estimatedHours: Number(e.target.value) }))}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button onClick={handleCreateTask}>Create Task</Button>
        </div>
      </Modal>
    </PageTransition>
  )
}
