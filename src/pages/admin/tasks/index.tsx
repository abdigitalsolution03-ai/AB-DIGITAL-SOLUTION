import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiSearch, FiX, FiClock, FiCalendar, FiUser, FiTag, FiTrash2 } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, SearchInput, Avatar, StatsCard, EmptyState, ConfirmDialog } from '@/components/ui'

const TABS = ['All', 'My Tasks', 'To Do', 'In Progress', 'Review', 'Done']

const STATUS_COLORS: Record<string, 'info' | 'warning' | 'success' | 'default' | 'danger'> = {
  todo: 'info',
  in_progress: 'warning',
  review: 'warning',
  completed: 'success',
  done: 'success',
}

const PRIORITY_VARIANTS: Record<string, 'info' | 'warning' | 'danger' | 'default'> = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
  urgent: 'danger',
}

const stagger = {
  initial: { opacity: 0, y: 8 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.03, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const emptyForm = { title: '', description: '', projectId: '', assignedTo: '', priority: 'medium', status: 'todo', dueDate: '', estimatedHours: 0, tags: '' }

export default function TasksPage() {
  const [tasks, setTasks] = useState(() => store.getCollection<any>('tasks'))
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState('')
  const [filterProject, setFilterProject] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterAssignee, setFilterAssignee] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<any | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [quickView, setQuickView] = useState<any | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [comment, setComment] = useState('')

  const projects = store.getCollection<any>('projects')
  const employees = store.getCollection<any>('employees')
  const users = store.getCollection<any>('users')
  const allPeople = [...users, ...employees]
  const session = JSON.parse(localStorage.getItem('ab_crm_session') || '{}')

  const refresh = () => setTasks([...store.getCollection<any>('tasks')])

  const stats = useMemo(() => {
    const now = new Date()
    return {
      total: tasks.length,
      todo: tasks.filter((t: any) => t.status === 'todo').length,
      inProgress: tasks.filter((t: any) => t.status === 'in_progress').length,
      review: tasks.filter((t: any) => t.status === 'review').length,
      done: tasks.filter((t: any) => t.status === 'completed' || t.status === 'done').length,
      overdue: tasks.filter((t: any) => t.status !== 'completed' && t.status !== 'done' && t.dueDate && new Date(t.dueDate) < now).length,
    }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    let items = [...tasks]
    if (activeTab === 1) items = items.filter((t: any) => t.assignedTo === session?.userId)
    if (activeTab === 2) items = items.filter((t: any) => t.status === 'todo')
    if (activeTab === 3) items = items.filter((t: any) => t.status === 'in_progress')
    if (activeTab === 4) items = items.filter((t: any) => t.status === 'review')
    if (activeTab === 5) items = items.filter((t: any) => t.status === 'completed' || t.status === 'done')
    if (search) items = items.filter((t: any) => t.title?.toLowerCase().includes(search.toLowerCase()))
    if (filterProject) items = items.filter((t: any) => t.projectId === filterProject)
    if (filterPriority) items = items.filter((t: any) => t.priority === filterPriority)
    if (filterAssignee) items = items.filter((t: any) => t.assignedTo === filterAssignee)
    return items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [tasks, activeTab, search, filterProject, filterPriority, filterAssignee, session])

  const openAdd = () => {
    setForm(emptyForm)
    setEditingTask(null)
    setShowModal(true)
  }

  const openEdit = (task: any) => {
    setForm({
      title: task.title,
      description: task.description || '',
      projectId: task.projectId || '',
      assignedTo: task.assignedTo || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      estimatedHours: task.estimatedHours || 0,
      tags: (task.tags || []).join(', '),
    })
    setEditingTask(task)
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.title) return
    const person = allPeople.find((p: any) => p.id === form.assignedTo)
    const data = {
      title: form.title,
      description: form.description,
      projectId: form.projectId,
      projectName: projects.find((p: any) => p.id === form.projectId)?.name || '',
      assignedTo: form.assignedTo,
      assignedName: person?.name || '',
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
      estimatedHours: form.estimatedHours,
      actualHours: editingTask?.actualHours || 0,
      tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()) : [],
      comments: editingTask?.comments || [],
      activity: [...(editingTask?.activity || []), { type: editingTask ? 'updated' : 'created', by: session?.name || 'System', at: new Date().toISOString() }],
    }
    if (editingTask) {
      store.update('tasks', editingTask.id, data)
    } else {
      store.create('tasks', data)
    }
    setShowModal(false)
    setForm(emptyForm)
    setEditingTask(null)
    refresh()
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const task = tasks.find((t: any) => t.id === taskId)
    const activity = [...(task?.activity || []), { type: 'status_change', by: session?.name || 'System', at: new Date().toISOString(), from: task?.status, to: newStatus }]
    store.update('tasks', taskId, { status: newStatus, activity, completedAt: newStatus === 'completed' ? new Date().toISOString() : task?.completedAt })
    refresh()
  }

  const handleDelete = () => {
    if (!deleteConfirm) return
    store.delete('tasks', deleteConfirm)
    setDeleteConfirm(null)
    if (quickView?.id === deleteConfirm) setQuickView(null)
    refresh()
  }

  const addComment = () => {
    if (!comment || !quickView) return
    const comments = [...(quickView.comments || []), { text: comment, by: session?.name || 'User', at: new Date().toISOString() }]
    store.update('tasks', quickView.id, { comments })
    setComment('')
    setQuickView({ ...quickView, comments })
    refresh()
  }

  const getPersonName = (id: string) => {
    if (!id) return 'Unassigned'
    const p = allPeople.find((p: any) => p.id === id)
    return p?.name || id
  }

  const isOverdue = (task: any) => task.dueDate && task.status !== 'completed' && task.status !== 'done' && new Date(task.dueDate) < new Date()

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">All Tasks</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage and track team tasks</p>
        </div>
        <Button icon={<FiPlus />} onClick={openAdd}>Add Task</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatsCard value={stats.total} label="Total" color="royal" />
        <StatsCard value={stats.todo} label="To Do" color="info" />
        <StatsCard value={stats.inProgress} label="In Progress" color="gold" />
        <StatsCard value={stats.review} label="Review" color="warning" />
        <StatsCard value={stats.done} label="Done" color="green" />
        <StatsCard value={stats.overdue} label="Overdue" color="red" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === i ? 'bg-[var(--royal-blue)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <select value={filterProject} onChange={e => setFilterProject(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs outline-none">
              <option value="">All Projects</option>
              {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs outline-none">
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs outline-none">
              <option value="">All Assignees</option>
              {allPeople.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." className="w-36" />
          </div>
        </div>

        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <EmptyState title="No tasks found" description="Create a new task to get started" />
          ) : filteredTasks.map((task: any, i: number) => (
            <motion.div key={task.id} custom={i} variants={stagger} initial="initial" animate="animate"
              className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors group">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                task.priority === 'urgent' ? 'bg-red-500' :
                task.priority === 'high' ? 'bg-orange-500' :
                task.priority === 'medium' ? 'bg-gold-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">{task.title}</span>
                  {isOverdue(task) && <Badge variant="danger" size="sm">Overdue</Badge>}
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)] mt-0.5">
                  <span>{task.projectName || 'No Project'}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><FiUser size={11} /> {task.assignedName || 'Unassigned'}</span>
                  {task.dueDate && (
                    <>
                      <span>·</span>
                      <span className={`flex items-center gap-1 ${isOverdue(task) ? 'text-red-500' : ''}`}>
                        <FiCalendar size={11} /> {store.formatDate(task.dueDate)}
                      </span>
                    </>
                  )}
                  <span>·</span>
                  <span className="flex items-center gap-1"><FiClock size={11} /> {task.actualHours || 0}/{task.estimatedHours || 0}h</span>
                </div>
              </div>
              <Badge variant={PRIORITY_VARIANTS[task.priority] || 'default'} size="sm">{task.priority}</Badge>
              <select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)}
                className="px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs outline-none">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Done</option>
              </select>
              <button onClick={() => setQuickView(task)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-all">
                <FiTag size={14} />
              </button>
              <button onClick={() => openEdit(task)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-all">
                <FiCalendar size={14} />
              </button>
              <button onClick={() => setDeleteConfirm(task.id)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-all hover:text-red-500">
                <FiTrash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </Card>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl premium-card" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{editingTask ? 'Edit Task' : 'Add Task'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"><FiX size={20} /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" placeholder="Task title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none min-h-[80px]" placeholder="Task description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Project</label>
                    <select value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="">No Project</option>
                      {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Assigned To</label>
                    <select value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="">Unassigned</option>
                      {allPeople.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Priority</label>
                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Done</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Due Date</label>
                    <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Estimated Hours</label>
                    <input type="number" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Tags</label>
                  <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" placeholder="tag1, tag2, tag3" />
                </div>
                <Button className="w-full" onClick={handleSubmit} disabled={!form.title}>
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
            onClick={() => setQuickView(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg premium-card max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between p-6 border-b border-[var(--border-color)]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">{quickView.title}</h2>
                    <Badge variant={PRIORITY_VARIANTS[quickView.priority] || 'default'} size="sm">{quickView.priority}</Badge>
                  </div>
                  <p className="text-sm text-[var(--text-tertiary)] mt-1">{quickView.projectName || 'No Project'}</p>
                </div>
                <button onClick={() => setQuickView(null)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"><FiX size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Description</p>
                  <p className="text-sm text-[var(--text-secondary)]">{quickView.description || 'No description'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
                    <p className="text-[var(--text-tertiary)] text-xs">Assignee</p>
                    <p className="text-[var(--text-primary)] font-medium">{quickView.assignedName || 'Unassigned'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
                    <p className="text-[var(--text-tertiary)] text-xs">Due Date</p>
                    <p className="text-[var(--text-primary)] font-medium">{quickView.dueDate ? store.formatDate(quickView.dueDate) : 'No date'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
                    <p className="text-[var(--text-tertiary)] text-xs">Hours</p>
                    <p className="text-[var(--text-primary)] font-medium">{quickView.actualHours || 0}/{quickView.estimatedHours || 0}h</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
                    <p className="text-[var(--text-tertiary)] text-xs">Status</p>
                    <Badge variant={STATUS_COLORS[quickView.status] || 'default'} size="sm">{quickView.status?.replace('_', ' ')}</Badge>
                  </div>
                </div>
                {(quickView.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {quickView.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{tag}</span>
                    ))}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Comments</p>
                  <div className="space-y-2 mb-3 max-h-[150px] overflow-y-auto">
                    {(quickView.comments || []).length === 0 ? (
                      <p className="text-sm text-[var(--text-tertiary)]">No comments yet</p>
                    ) : quickView.comments.map((c: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl bg-[var(--bg-secondary)]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-[var(--text-primary)]">{c.by}</span>
                          <span className="text-[10px] text-[var(--text-tertiary)]">{new Date(c.at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">{c.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={comment} onChange={e => setComment(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm outline-none"
                      placeholder="Add comment..." onKeyDown={e => e.key === 'Enter' && addComment()} />
                    <Button size="sm" onClick={addComment} disabled={!comment}>Add</Button>
                  </div>
                </div>
                {(quickView.activity || []).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Activity</p>
                    <div className="space-y-1">
                      {quickView.activity.slice(-5).reverse().map((a: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                          <FiClock size={11} />
                          <span>{a.by} {a.type === 'created' ? 'created' : a.type === 'status_change' ? `changed status from ${a.from} to ${a.to}` : 'updated'} this task</span>
                          <span>· {new Date(a.at).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete}
        title="Delete Task" message="Are you sure you want to delete this task? This action cannot be undone." />
    </PageTransition>
  )
}
