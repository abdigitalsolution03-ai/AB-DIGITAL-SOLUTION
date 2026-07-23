import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiFileText, FiBarChart2, FiUsers, FiDollarSign, FiTarget, FiFolder, FiCheckSquare, FiCalendar } from 'react-icons/fi'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, ProgressBar, StatsCard } from '@/components/ui'

const tabs = ['Attendance', 'Sales', 'Leads', 'Revenue', 'Projects', 'Performance', 'Payroll', 'Employees']

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6']

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

export default function ReportsHub() {
  const [activeTab, setActiveTab] = useState(0)
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))

  const employees = store.getCollection<any>('employees')
  const attendance = store.getCollection<any>('attendance')
  const leads = store.getCollection<any>('leads')
  const deals = store.getCollection<any>('deals')
  const payments = store.getCollection<any>('payments')
  const invoices = store.getCollection<any>('invoices')
  const projects = store.getCollection<any>('projects')
  const payroll = store.getCollection<any>('payroll')
  const performanceReviews = store.getCollection<any>('performanceReviews')
  const users = store.getCollection<any>('users')

  const exportPDF = () => { alert('PDF export triggered') }
  const exportExcel = () => { alert('Excel export triggered') }
  const exportCSV = () => { alert('CSV export triggered') }

  const renderAttendance = () => {
    const monthAttendance = attendance.filter((a: any) => a.date?.startsWith(month))
    const summary = employees.map((emp: any) => {
      const records = monthAttendance.filter((a: any) => a.employeeId === emp.id)
      const present = records.filter((r: any) => r.status === 'present').length
      const absent = records.filter((r: any) => r.status === 'absent').length
      const late = records.filter((r: any) => r.status === 'late').length
      const halfDay = records.filter((r: any) => r.status === 'half_day').length
      const totalHours = records.reduce((s: number, r: any) => s + (r.hoursWorked || 0), 0)
      return { ...emp, present, absent, late, halfDay, totalDays: records.length, totalHours }
    })

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiCalendar className="text-[var(--text-tertiary)]" size={20} />
            <input type="month" value={month} onChange={e => setMonth(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" icon={<FiFileText />} onClick={exportPDF}>PDF</Button>
            <Button size="sm" variant="outline" icon={<FiDownload />} onClick={exportExcel}>Excel</Button>
            <Button size="sm" variant="outline" onClick={exportCSV}>CSV</Button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="text-left p-3 text-[var(--text-primary)] font-semibold">Employee</th>
                <th className="text-center p-3 text-[var(--text-primary)] font-semibold">Present</th>
                <th className="text-center p-3 text-[var(--text-primary)] font-semibold">Absent</th>
                <th className="text-center p-3 text-[var(--text-primary)] font-semibold">Late</th>
                <th className="text-center p-3 text-[var(--text-primary)] font-semibold">Half Day</th>
                <th className="text-center p-3 text-[var(--text-primary)] font-semibold">Total Days</th>
                <th className="text-center p-3 text-[var(--text-primary)] font-semibold">Hours</th>
                <th className="text-center p-3 text-[var(--text-primary)] font-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((emp: any, i: number) => {
                const pct = emp.totalDays ? Math.round((emp.present / emp.totalDays) * 100) : 0
                return (
                  <motion.tr key={emp.id} custom={i} variants={stagger} initial="initial" animate="animate"
                    className="border-t border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--royal-blue)] flex items-center justify-center text-white text-xs font-bold">
                          {emp.name?.charAt(0)}
                        </div>
                        <span className="text-[var(--text-primary)] font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="text-center p-3 text-green-500 font-semibold">{emp.present}</td>
                    <td className="text-center p-3 text-red-500 font-semibold">{emp.absent}</td>
                    <td className="text-center p-3 text-gold-500 font-semibold">{emp.late}</td>
                    <td className="text-center p-3 text-[var(--text-primary)]">{emp.halfDay}</td>
                    <td className="text-center p-3 text-[var(--text-primary)]">{emp.totalDays}</td>
                    <td className="text-center p-3 text-[var(--text-primary)]">{emp.totalHours.toFixed(1)}</td>
                    <td className="text-center p-3">
                      <span className={`font-semibold ${pct >= 80 ? 'text-green-500' : pct >= 60 ? 'text-gold-500' : 'text-red-500'}`}>
                        {pct}%
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderSales = () => {
    const totalSales = payments.reduce((s: number, p: any) => s + (p.amount || 0), 0)
    const wonDeals = deals.filter((d: any) => d.stage === 'closed_won')
    const wonValue = wonDeals.reduce((s: number, d: any) => s + (d.value || 0), 0)
    const pipelineValue = deals.filter((d: any) => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
      .reduce((s: number, d: any) => s + (d.value || 0), 0)
    const paidInvoices = invoices.filter((i: any) => i.status === 'paid')
    const pendingInvoices = invoices.filter((i: any) => i.status === 'sent' || i.status === 'overdue')

    const salesByMonth: Record<string, number> = {}
    payments.forEach((p: any) => {
      const m = (p.date || p.createdAt)?.slice(0, 7)
      if (m) salesByMonth[m] = (salesByMonth[m] || 0) + (p.amount || 0)
    })

    const monthlyData = Object.entries(salesByMonth).sort().map(([month, amount]) => ({ month, amount }))

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard icon={<FiDollarSign />} value={store.formatCurrency(totalSales)} label="Total Sales" color="green" />
          <StatsCard icon={<FiTarget />} value={store.formatCurrency(wonValue)} label="Deals Won" color="royal" />
          <StatsCard icon={<FiBarChart2 />} value={store.formatCurrency(pipelineValue)} label="Pipeline Value" color="gold" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card title="Sales by Month">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                    formatter={(value: number) => [store.formatCurrency(value), 'Sales']} />
                  <Bar dataKey="amount" fill="var(--royal-blue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Invoice Summary">
            <div className="space-y-4">
              <div className="flex justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
                <span className="text-[var(--text-primary)]">Paid Invoices</span>
                <span className="font-semibold text-green-500">{paidInvoices.length} ({store.formatCurrency(paidInvoices.reduce((s: number, i: any) => s + i.total, 0))})</span>
              </div>
              <div className="flex justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
                <span className="text-[var(--text-primary)]">Pending Invoices</span>
                <span className="font-semibold text-gold-500">{pendingInvoices.length} ({store.formatCurrency(pendingInvoices.reduce((s: number, i: any) => s + i.total, 0))})</span>
              </div>
              <div className="flex justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
                <span className="text-[var(--text-primary)]">Total Deals</span>
                <span className="font-semibold text-[var(--text-primary)]">{deals.length}</span>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={<FiFileText />} onClick={exportPDF}>PDF</Button>
          <Button size="sm" variant="outline" icon={<FiDownload />} onClick={exportExcel}>Excel</Button>
        </div>
      </div>
    )
  }

  const renderLeads = () => {
    const bySource: Record<string, number> = {}
    const byStatus: Record<string, number> = {}
    leads.forEach((l: any) => {
      bySource[l.source || 'Other'] = (bySource[l.source || 'Other'] || 0) + 1
      byStatus[l.stage || 'new'] = (byStatus[l.stage || 'new'] || 0) + 1
    })
    const sourceData = Object.entries(bySource).map(([name, value]) => ({ name, value }))
    const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }))

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card title="Leads by Source">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Leads by Stage">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" icon={<FiFileText />} onClick={exportPDF}>PDF</Button>
          <Button size="sm" variant="outline" icon={<FiDownload />} onClick={exportExcel}>Excel</Button>
        </div>
      </div>
    )
  }

  const renderRevenue = () => {
    const monthlyRevenue: Record<string, number> = {}
    payments.forEach((p: any) => {
      const m = (p.date || p.createdAt)?.slice(0, 7)
      if (m) monthlyRevenue[m] = (monthlyRevenue[m] || 0) + (p.amount || 0)
    })
    const revenueData = Object.entries(monthlyRevenue).sort().map(([month, revenue]) => ({ month, revenue }))

    return (
      <div>
        <Card title="Monthly Revenue">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <defs>
                  <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--royal-blue)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--royal-blue)" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                  formatter={(value: number) => [store.formatCurrency(value), 'Revenue']} />
                <Bar dataKey="revenue" fill="url(#revBar)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" icon={<FiFileText />} onClick={exportPDF}>PDF</Button>
          <Button size="sm" variant="outline" icon={<FiDownload />} onClick={exportExcel}>Excel</Button>
        </div>
      </div>
    )
  }

  const renderProjects = () => {
    const byStatus: Record<string, number> = {}
    projects.forEach((p: any) => {
      byStatus[p.status || 'planning'] = (byStatus[p.status || 'planning'] || 0) + 1
    })
    const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }))
    const avgProgress = projects.length ? Math.round(projects.reduce((s: number, p: any) => s + (p.progress || 0), 0) / projects.length) : 0
    const completed = projects.filter((p: any) => p.status === 'completed').length

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard icon={<FiFolder />} value={projects.length} label="Total Projects" color="royal" />
          <StatsCard icon={<FiCheckSquare />} value={completed} label="Completed" color="green" />
          <StatsCard icon={<FiBarChart2 />} value={`${avgProgress}%`} label="Avg Progress" color="gold" />
        </div>
        <Card title="Project Status Breakdown">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    )
  }

  const renderPerformance = () => {
    return (
      <div>
        <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="text-left p-3 text-[var(--text-primary)] font-semibold">Employee</th>
                <th className="text-left p-3 text-[var(--text-primary)] font-semibold">Period</th>
                <th className="text-center p-3 text-[var(--text-primary)] font-semibold">Rating</th>
                <th className="text-left p-3 text-[var(--text-primary)] font-semibold">Status</th>
                <th className="text-left p-3 text-[var(--text-primary)] font-semibold">Strengths</th>
              </tr>
            </thead>
            <tbody>
              {performanceReviews.map((rev: any, i: number) => (
                <motion.tr key={rev.id} custom={i} variants={stagger} initial="initial" animate="animate"
                  className="border-t border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center text-white text-xs font-bold">
                        {rev.employeeName?.charAt(0)}
                      </div>
                      <span className="text-[var(--text-primary)] font-medium">{rev.employeeName}</span>
                    </div>
                  </td>
                  <td className="p-3 text-[var(--text-tertiary)]">{rev.period}</td>
                  <td className="text-center p-3">
                    <span className={`font-bold text-lg ${rev.overallRating >= 4 ? 'text-green-500' : rev.overallRating >= 3 ? 'text-gold-500' : 'text-red-500'}`}>
                      {rev.overallRating}
                    </span>
                  </td>
                  <td className="p-3">
                    <Badge variant={rev.status === 'completed' ? 'success' : 'warning'}>{rev.status}</Badge>
                  </td>
                  <td className="p-3 text-[var(--text-tertiary)] max-w-[200px] truncate">{rev.strengths}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" icon={<FiFileText />} onClick={exportPDF}>PDF</Button>
          <Button size="sm" variant="outline" icon={<FiDownload />} onClick={exportExcel}>Excel</Button>
        </div>
      </div>
    )
  }

  const renderPayroll = () => {
    const totalPayroll = payroll.reduce((s: number, p: any) => s + (p.netSalary || 0), 0)
    const paidCount = payroll.filter((p: any) => p.status === 'paid').length
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard icon={<FiDollarSign />} value={store.formatCurrency(totalPayroll)} label="Total Payroll" color="green" />
          <StatsCard icon={<FiUsers />} value={payroll.length} label="Employees" color="royal" />
          <StatsCard icon={<FiCheckSquare />} value={paidCount} label="Paid" color="gold" />
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="text-left p-3 text-[var(--text-primary)] font-semibold">Employee</th>
                <th className="text-left p-3 text-[var(--text-primary)] font-semibold">Month</th>
                <th className="text-right p-3 text-[var(--text-primary)] font-semibold">Basic</th>
                <th className="text-right p-3 text-[var(--text-primary)] font-semibold">HRA</th>
                <th className="text-right p-3 text-[var(--text-primary)] font-semibold">Allowances</th>
                <th className="text-right p-3 text-[var(--text-primary)] font-semibold">Deductions</th>
                <th className="text-right p-3 text-[var(--text-primary)] font-semibold">Net Salary</th>
                <th className="text-center p-3 text-[var(--text-primary)] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((p: any, i: number) => (
                <motion.tr key={p.id} custom={i} variants={stagger} initial="initial" animate="animate"
                  className="border-t border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50">
                  <td className="p-3 text-[var(--text-primary)] font-medium">{p.employeeName}</td>
                  <td className="p-3 text-[var(--text-tertiary)]">{p.month}</td>
                  <td className="text-right p-3 text-[var(--text-primary)]">{store.formatCurrency(p.basicSalary)}</td>
                  <td className="text-right p-3 text-[var(--text-primary)]">{store.formatCurrency(p.hra)}</td>
                  <td className="text-right p-3 text-[var(--text-primary)]">{store.formatCurrency(p.allowances)}</td>
                  <td className="text-right p-3 text-red-500">{store.formatCurrency((p.deductions?.pf || 0) + (p.deductions?.tax || 0) + (p.deductions?.insurance || 0))}</td>
                  <td className="text-right p-3 font-semibold text-[var(--text-primary)]">{store.formatCurrency(p.netSalary)}</td>
                  <td className="text-center p-3">
                    <Badge variant={p.status === 'paid' ? 'success' : 'warning'}>{p.status}</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderEmployees = () => {
    const byDept: Record<string, number> = {}
    employees.forEach((e: any) => {
      byDept[e.department || 'Other'] = (byDept[e.department || 'Other'] || 0) + 1
    })
    const deptData = Object.entries(byDept).map(([name, count]) => ({ name, count }))

    return (
      <div>
        <Card title="Department-wise Employee Count">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-primary)', fontSize: 12 }} width={150} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" icon={<FiFileText />} onClick={exportPDF}>PDF</Button>
          <Button size="sm" variant="outline" icon={<FiDownload />} onClick={exportExcel}>Excel</Button>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return renderAttendance()
      case 1: return renderSales()
      case 2: return renderLeads()
      case 3: return renderRevenue()
      case 4: return renderProjects()
      case 5: return renderPerformance()
      case 6: return renderPayroll()
      case 7: return renderEmployees()
      default: return null
    }
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reports</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Comprehensive business reports and analytics</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === i
                ? 'bg-[var(--royal-blue)] text-white shadow-lg shadow-[var(--royal-blue)]/20'
                : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {renderTabContent()}
      </motion.div>
    </PageTransition>
  )
}
