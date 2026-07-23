import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiTarget, FiAlertCircle, FiArrowRight, FiBarChart2, FiMail, FiUserPlus, FiStar } from 'react-icons/fi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PageTransition from '@/components/PageTransition'
import { getCollection } from '@/services/store'
import { getSession } from '@/services/auth'
import { Card, StatsCard, Badge, Button, EmptyState } from '@/components/ui'

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const stageBadge = (status: string) => {
  const colors: Record<string, string> = {
    new: 'info', contacted: 'info', qualified: 'warning',
    proposal: 'warning', negotiation: 'warning', won: 'success', lost: 'danger'
  }
  return <Badge variant={(colors[status.toLowerCase()] || 'default') as any}>{status}</Badge>
}

export default function AdminDashboard() {
  const session = getSession()
  const [leads] = useState(() => getCollection('leads'))
  const [auditLogs] = useState(() => getCollection('auditLogs'))

  const activeLeads = leads.filter((l: any) => l.status !== 'won' && l.status !== 'lost')
  const wonLeads = leads.filter((l: any) => l.status === 'won')
  const newLeads = leads.filter((l: any) => l.status === 'new')

  const revenueData = [
    { month: 'Jan', revenue: 0 }, { month: 'Feb', revenue: 0 }, { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 }, { month: 'May', revenue: 0 }, { month: 'Jun', revenue: 0 },
  ]

  const recentLogs = [...auditLogs]
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  const quickActions = [
    { label: 'Add Lead', icon: FiUserPlus, link: '/admin/crm/leads', color: 'royal' },
    { label: 'View Pipeline', icon: FiTarget, link: '/admin/crm/pipeline', color: 'gold' },
    { label: 'Subscribers', icon: FiMail, link: '/admin/subscribers', color: 'green' },
    { label: 'Analytics', icon: FiBarChart2, link: '/admin/analytics', color: 'purple' },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<FiTarget />} value={leads.length} label="Total Leads" color="royal" />
        <StatsCard icon={<FiUsers />} value={activeLeads.length} label="Active Leads" color="gold" />
        <StatsCard icon={<FiStar />} value={wonLeads.length} label="Won Deals" color="green" />
        <StatsCard icon={<FiAlertCircle />} value={newLeads.length} label="New This Week" color="purple" />
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
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
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
                    <FiBarChart2 size={14} />
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
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg text-white bg-royal-500">
                    <action.icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)] flex-1">{action.label}</span>
                  <FiArrowRight className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card title="Recent Leads" subtitle={`${newLeads.length} new`} className="lg:col-span-3">
          {newLeads.length === 0 ? (
            <EmptyState title="No leads yet" description="Leads will appear here" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {newLeads.slice(0, 6).map((lead: any, i: number) => (
                <motion.div key={lead.id} custom={i} variants={stagger} initial="initial" animate="animate" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]">
                  <div className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--royal-blue)] font-bold text-sm">
                    {(lead.firstName?.[0] || '?')}{lead.lastName?.[0] || ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{lead.firstName} {lead.lastName}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{lead.company || lead.email || ''}</p>
                  </div>
                  {stageBadge(lead.status || 'new')}
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageTransition>
  )
}
