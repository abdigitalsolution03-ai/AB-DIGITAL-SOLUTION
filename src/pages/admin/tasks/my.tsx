import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiCalendar, FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { getSession } from '@/services/auth'
import { Card, Badge, ProgressBar, EmptyState, Avatar } from '@/components/ui'

const PRIORITY_VARIANTS: Record<string, 'info' | 'warning' | 'danger' | 'default'> = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
  urgent: 'danger',
}

const STATUS_ORDER = ['todo', 'in_progress', 'review', 'completed']

const stagger = {
  initial: { opacity: 0, y: 15 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

export default function MyTasksPage() {
  const session = getSession()
  const [tasks, setTasks] = useState(() => store.getCollection<any>('tasks'))

  const refresh = () => setTasks([...store.getCollection<any>('tasks')])

  const myTasks = useMemo(() => {
    if (!session) return []
    return tasks.filter((t: any) => t.assignedTo === session.userId || t.assignedName === session.name)
  }, [tasks, session])

  const groupedTasks = useMemo(() => {
    const groups: Record<string, any[]> = {}
    STATUS_ORDER.forEach(s => { groups[s] = [] })
    myTasks.forEach(t => {
      const status = t.status || 'todo'
      if (groups[status]) groups[status].push(t)
      else groups.todo.push(t)
    })
    return groups
  }, [myTasks])

  const stats = useMemo(() => ({
    total: myTasks.length,
    todo: myTasks.filter((t: any) => t.status === 'todo').length,
    inProgress: myTasks.filter((t: any) => t.status === 'in_progress').length,
    completed: myTasks.filter((t: any) => t.status === 'completed').length,
    overdue: myTasks.filter((t: any) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()).length,
    totalHours: myTasks.reduce((s: number, t: any) => s + (t.estimatedHours || 0), 0),
    loggedHours: myTasks.reduce((s: number, t: any) => s + (t.actualHours || 0), 0),
  }), [myTasks])

  const handleQuickStatus = (taskId: string, newStatus: string) => {
    store.update('tasks', taskId, { status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined })
    refresh()
  }

  if (!session) {
    return <PageTransition><EmptyState title="Not logged in" description="Please log in to view your tasks" /></PageTransition>
  }

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Tasks</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Your personal task dashboard</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Card padding="sm">
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Total Tasks</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-blue-500">{stats.todo}</p>
          <p className="text-xs text-[var(--text-tertiary)]">To Do</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-gold-500">{stats.inProgress}</p>
          <p className="text-xs text-[var(--text-tertiary)]">In Progress</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Completed</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Overdue</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.loggedHours}/{stats.totalHours}h</p>
          <p className="text-xs text-[var(--text-tertiary)]">Hours</p>
        </Card>
      </div>

      <ProgressBar value={stats.completed} max={stats.total || 1} label="Overall Progress" color="green" size="md" className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUS_ORDER.map(status => {
          const label = status === 'in_progress' ? 'In Progress' : status === 'completed' ? 'Completed' : status.charAt(0).toUpperCase() + status.slice(1)
          const tasksInGroup = groupedTasks[status] || []
          return (
            <div key={status}>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                {label}
                <span className="text-xs text-[var(--text-tertiary)]">({tasksInGroup.length})</span>
              </h3>
              <div className="space-y-3">
                {tasksInGroup.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)]">
                    <p className="text-xs text-[var(--text-tertiary)] text-center">No tasks</p>
                  </div>
                ) : tasksInGroup.map((task: any, i: number) => (
                  <motion.div key={task.id} custom={i} variants={stagger} initial="initial" animate="animate"
                    className="premium-card p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={PRIORITY_VARIANTS[task.priority] || 'default'} size="sm">{task.priority}</Badge>
                      {task.dueDate && new Date(task.dueDate) < new Date() && status !== 'completed' && (
                        <Badge variant="danger" size="sm">Overdue</Badge>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1 line-clamp-2">{task.title}</h4>
                    {task.projectName && (
                      <p className="text-xs text-[var(--text-tertiary)] mb-2">{task.projectName}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-3">
                      {task.dueDate && (
                        <span className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() && status !== 'completed' ? 'text-red-500' : ''}`}>
                          <FiCalendar size={11} /> {store.formatDate(task.dueDate)}
                        </span>
                      )}
                      <span className="flex items-center gap-1"><FiClock size={11} /> {task.actualHours || 0}/{task.estimatedHours || 0}h</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(task.tags || []).slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">{tag}</span>
                      ))}
                    </div>
                    <select value={task.status} onChange={e => handleQuickStatus(task.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs outline-none">
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Done</option>
                    </select>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </PageTransition>
  )
}
