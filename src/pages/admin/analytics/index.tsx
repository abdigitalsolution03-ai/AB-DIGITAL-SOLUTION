import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiCalendar, FiTrendingUp, FiBarChart2 } from 'react-icons/fi'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, StatsCard } from '@/components/ui'

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6']

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('6months')

  const payments = store.getCollection<any>('payments')
  const invoices = store.getCollection<any>('invoices')
  const leads = store.getCollection<any>('leads')
  const deals = store.getCollection<any>('deals')
  const tasks = store.getCollection<any>('tasks')
  const attendance = store.getCollection<any>('attendance')
  const employees = store.getCollection<any>('employees')
  const projects = store.getCollection<any>('projects')

  const salesData = useMemo(() => {
    const byMonth: Record<string, number> = {}
    payments.forEach((p: any) => {
      const m = (p.date || p.createdAt)?.slice(0, 7)
      if (m) byMonth[m] = (byMonth[m] || 0) + (p.amount || 0)
    })
    return Object.entries(byMonth).sort().map(([month, sales]) => ({ month, sales }))
  }, [payments])

  const leadFunnel = useMemo(() => {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won']
    return stages.map(stage => ({
      name: stage.charAt(0).toUpperCase() + stage.slice(1),
      value: leads.filter((l: any) => l.stage === stage).length,
    }))
  }, [leads])

  const revenueData = useMemo(() => {
    const byMonth: Record<string, number> = {}
    payments.forEach((p: any) => {
      const m = (p.date || p.createdAt)?.slice(0, 7)
      if (m) byMonth[m] = (byMonth[m] || 0) + (p.amount || 0)
    })
    return Object.entries(byMonth).sort().map(([month, revenue]) => ({ month, revenue }))
  }, [payments])

  const attendanceTrend = useMemo(() => {
    const byMonth: Record<string, { present: number; total: number }> = {}
    attendance.forEach((a: any) => {
      const m = a.date?.slice(0, 7)
      if (!m) return
      if (!byMonth[m]) byMonth[m] = { present: 0, total: 0 }
      byMonth[m].total++
      if (a.status === 'present') byMonth[m].present++
    })
    return Object.entries(byMonth).sort().map(([month, d]) => ({
      month,
      rate: d.total ? Math.round((d.present / d.total) * 100) : 0,
    }))
  }, [attendance])

  const productivityByDept = useMemo(() => {
    const byDept: Record<string, number> = {}
    employees.forEach((e: any) => {
      const dept = e.department || 'Other'
      byDept[dept] = (byDept[dept] || 0) + 1
    })
    return Object.entries(byDept).map(([department, count]) => ({ department, count }))
  }, [employees])

  const taskCompletion = useMemo(() => {
    const byStatus: Record<string, number> = {}
    tasks.forEach((t: any) => {
      byStatus[t.status || 'todo'] = (byStatus[t.status || 'todo'] || 0) + 1
    })
    return Object.entries(byStatus).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
  }, [tasks])

  const monthlyGrowth = useMemo(() => {
    const byMonth: Record<string, number> = {}
    payments.forEach((p: any) => {
      const m = (p.date || p.createdAt)?.slice(0, 7)
      if (m) byMonth[m] = (byMonth[m] || 0) + (p.amount || 0)
    })
    const sorted = Object.entries(byMonth).sort()
    return sorted.map(([month, value], i) => ({
      month,
      growth: i > 0 && sorted[i - 1][1] ? Math.round(((value - sorted[i - 1][1]) / sorted[i - 1][1]) * 100) : 0,
    }))
  }, [payments])

  const totalRevenue = payments.reduce((s: number, p: any) => s + (p.amount || 0), 0)
  const totalLeads = leads.length
  const wonDeals = deals.filter((d: any) => d.stage === 'closed_won').length
  const activeProjects = projects.filter((p: any) => p.status !== 'completed' && p.status !== 'cancelled').length

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Data-driven insights and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <FiCalendar className="text-[var(--text-tertiary)]" size={16} />
            <select value={dateRange} onChange={e => setDateRange(e.target.value)}
              className="bg-transparent text-[var(--text-primary)] text-sm outline-none">
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>
          <Button variant="outline" size="sm" icon={<FiDownload />}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={<FiTrendingUp />} value={store.formatCurrency(totalRevenue)} label="Total Revenue" color="green" />
        <StatsCard icon={<FiBarChart2 />} value={totalLeads} label="Total Leads" color="royal" />
        <StatsCard icon={<FiTrendingUp />} value={wonDeals} label="Won Deals" color="gold" />
        <StatsCard icon={<FiBarChart2 />} value={activeProjects} label="Active Projects" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Sales Overview" subtitle="Monthly sales data" action={<Button size="sm" variant="ghost">View All</Button>}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--royal-blue)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--royal-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                  formatter={(value: number) => [store.formatCurrency(value), 'Sales']} />
                <Area type="monotone" dataKey="sales" stroke="var(--royal-blue)" fill="url(#salesGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Lead Funnel" subtitle="Lead stages distribution">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} width={100} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {leadFunnel.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Revenue Growth" subtitle="Monthly revenue trend">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="revLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--green-500)" />
                    <stop offset="100%" stopColor="var(--royal-blue)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                  formatter={(value: number) => [store.formatCurrency(value), 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="url(#revLine)" strokeWidth={3} dot={{ fill: 'var(--royal-blue)', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Attendance Trends" subtitle="Monthly attendance percentage">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                  formatter={(value: number) => [`${value}%`, 'Attendance']} />
                <Line type="monotone" dataKey="rate" stroke="var(--gold)" strokeWidth={2} dot={{ fill: 'var(--gold)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Employee Productivity" subtitle="By department">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityByDept} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis type="category" dataKey="department" tick={{ fill: 'var(--text-primary)', fontSize: 10 }} width={120} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }} />
                <Bar dataKey="count" fill="var(--purple-500)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Task Completion" subtitle="Task status distribution">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taskCompletion} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {taskCompletion.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly Growth %" subtitle="Month over month">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-primary)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                  formatter={(value: number) => [`${value}%`, 'Growth']} />
                <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
                  {monthlyGrowth.map((entry, i) => (
                    <Cell key={i} fill={entry.growth >= 0 ? 'var(--green-500)' : 'var(--red-500)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageTransition>
  )
}
