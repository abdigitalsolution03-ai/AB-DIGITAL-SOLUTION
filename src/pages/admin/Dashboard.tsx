import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiTarget, FiFolder, FiCheckSquare, FiAlertCircle, FiArrowRight, FiCalendar, FiClock, FiBarChart2, FiFileText, FiDollarSign, FiMessageSquare, FiUserPlus, FiMail } from 'react-icons/fi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageTransition from '@/components/PageTransition'
import { getCollection } from '@/services/store'
import { getSession } from '@/services/auth'
import { Card, StatsCard, Badge, Avatar, ProgressBar, Button, EmptyState } from '@/components/ui'

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const statusColors: Record<string, string> = {
  new: 'info', contacted: 'info', qualified: 'warning',
  proposal: 'warning', negotiation: 'warning', won: 'success',
  lost: 'danger', closed: 'success', cancelled: 'danger',
  completed: 'success', in_progress: 'warning', todo: 'default',
  open: 'info', pending: 'warning', resolved: 'success',
}

const stageBadge = (status: string) => {
  const v = statusColors[status.toLowerCase()] || 'default'
  return <Badge variant={v as any}>{status}</Badge>
}

export default function AdminDashboard() {
  const session = getSession()
  const [employees] = useState(() => getCollection('employees'))
  const [leads] = useState(() => getCollection('leads'))
  const [projects] = useState(() => getCollection('projects'))
  const [tasks] = useState(() => getCollection('tasks'))
  const [tickets] = useState(() => getCollection('tickets'))
  const [payments] = useState(() => getCollection('payments'))
  const [auditLogs] = useState(() => getCollection('auditLogs'))
  const [attendance] = useState(() => getCollection('attendance'))

  const activeLeads = leads.filter((l: any) => l.status !== 'won' && l.status !== 'lost')
  const activeProjects = projects.filter((p: any) => p.status !== 'completed' && p.status !== 'cancelled')
  const pendingTasks = tasks.filter((t: any) => t.status !== 'completed')
  const openTickets = tickets.filter((t: any) => t.status === 'open' || t.status === 'pending')

  const today = new Date().toDateString()
  const todayAttendance = attendance.filter((a: any) => new Date(a.date).toDateString() === today)

  const revenueData = [
    { month: 'Jan', revenue: 0 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 0 },
  ]

  payments.forEach((p: any) => {
    const d = new Date(p.date || p.createdAt)
    const monthIdx = d.getMonth()
    if (monthIdx >= 0 && monthIdx < 6) revenueData[monthIdx].revenue += (p.amount || 0)
  })

  const recentLogs = [...auditLogs].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8)

  const upcomingTasks = [...tasks]
    .filter((t: any) => t.status !== 'completed' && t.dueDate)
    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 6)

  const projectCards = [...projects].filter((p: any) => p.status !== 'cancelled').slice(0, 4)

  const presentCount = todayAttendance.filter((a: any) => a.status === 'present').length
  const absentCount = todayAttendance.filter((a: any) => a.status === 'absent').length
  const leaveCount = todayAttendance.filter((a: any) => a.status === 'leave').length

  const quickActions = [
    { label: 'Add Lead', icon: FiUserPlus, link: '/admin/crm/leads', color: 'royal' },
    { label: 'New Project', icon: FiFolder, link: '/admin/projects', color: 'gold' },
    { label: 'Send Invoice', icon: FiFileText, link: '/admin/invoices', color: 'green' },
    { label: 'View Reports', icon: FiBarChart2, link: '/admin/reports', color: 'purple' },
    { label: 'New Ticket', icon: FiMessageSquare, link: '/admin/tickets', color: 'red' },
    { label: 'Send Email', icon: FiMail, link: '/admin/marketing', color: 'royal' },
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back, {session?.name || 'User'}
          </h1>
          <p className="text-[var(--text-tertiary)] text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Badge variant="success" size="lg" dot>System Online</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <StatsCard icon={<FiUsers />} value={employees.length} label="Total Employees" color="royal" />
        <StatsCard icon={<FiTarget />} value={activeLeads.length} label="Active Leads" color="gold" />
        <StatsCard icon={<FiFolder />} value={activeProjects.length} label="Active Projects" color="green" />
        <StatsCard icon={<FiCheckSquare />} value={pendingTasks.length} label="Pending Tasks" color="purple" />
        <StatsCard icon={<FiAlertCircle />} value={openTickets.length} label="Open Tickets" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Revenue Overview" subtitle="Last 6 months" className="lg:col-span-2" action={<Button size="sm" variant="ghost" icon={<FiBarChart2 />}>Report</Button>}>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--royal-blue)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--royal-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--royal-blue)" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Activity" subtitle="Latest actions">
          {recentLogs.length === 0 ? (
            <EmptyState title="No activity yet" description="Activities will appear here" />
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {recentLogs.map((log: any, i: number) => (
                <motion.div key={log.id} custom={i} variants={stagger} initial="initial" animate="animate" className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--royal-blue)] flex-shrink-0">
                    <FiClock size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{log.action}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{log.userName || log.user}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Quick Actions" className="lg:col-span-1">
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action, i) => (
              <motion.div key={action.label} custom={i} variants={stagger} initial="initial" animate="animate">
                <Link to={action.link} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors group">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg text-white bg-${action.color}-500`}>
                    <action.icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)] flex-1">{action.label}</span>
                  <FiArrowRight className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card title="Upcoming Tasks" subtitle={`${pendingTasks.length} pending`} className="lg:col-span-2">
          {upcomingTasks.length === 0 ? (
            <EmptyState title="No upcoming tasks" description="All tasks completed" />
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task: any, i: number) => (
                <motion.div key={task.id} custom={i} variants={stagger} initial="initial" animate="animate" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-gold-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{task.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {task.project ? `${task.project} · ` : ''}Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  {stageBadge(task.status || 'todo')}
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Attendance Today" subtitle={`${presentCount} present of ${employees.length}`} className="lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{presentCount}</p>
                <p className="text-xs text-[var(--text-tertiary)]">Present</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">{absentCount}</p>
                <p className="text-xs text-[var(--text-tertiary)]">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-500">{leaveCount}</p>
                <p className="text-xs text-[var(--text-tertiary)]">Leave</p>
              </div>
            </div>
            <ProgressBar value={presentCount} max={employees.length || 1} label="Attendance Rate" size="sm" color="green" />
          </div>
        </Card>
      </div>

      <Card title="Active Projects" subtitle="Project progress overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectCards.length === 0 ? (
            <div className="md:col-span-2">
              <EmptyState title="No projects found" description="Create your first project to get started" />
            </div>
          ) : projectCards.map((project: any, i: number) => (
            <motion.div key={project.id} custom={i} variants={stagger} initial="initial" animate="animate" className="p-4 rounded-xl bg-[var(--bg-secondary)]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">{project.name}</h4>
                  <p className="text-xs text-[var(--text-tertiary)]">{project.client || project.lead || 'Internal'}</p>
                </div>
                {stageBadge(project.status || 'in_progress')}
              </div>
              <ProgressBar value={project.progress || 0} size="sm" color={project.progress >= 70 ? 'green' : 'royal'} />
              <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1"><FiCalendar size={12} /> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
                {project.team && <span className="flex items-center gap-1"><FiUsers size={12} /> {project.team.length} members</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </PageTransition>
  )
}
