import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiBarChart2, FiClock, FiCalendar } from 'react-icons/fi'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Select, StatsCard, EmptyState, LoadingSpinner } from '@/components/ui'

interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  status: string
  workingHours: number
}

interface Employee {
  id: string
  firstName: string
  lastName: string
}

const COLORS = {
  present: '#10B981',
  late: '#F59E0B',
  absent: '#EF4444',
  half_day: '#3B82F6',
}

export default function AttendanceReports() {
  const [attendance] = useState<AttendanceRecord[]>(() => store.getCollection<any>('attendance').map(mapAtt))
  const [employees] = useState<Employee[]>(() => store.getCollection<any>('employees').map(mapEmp))
  const [selectedEmp, setSelectedEmp] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const monthData = useMemo(() => {
    return attendance.filter(a => a.date.startsWith(selectedMonth))
  }, [attendance, selectedMonth])

  const empMonthData = useMemo(() => {
    if (!selectedEmp) return monthData
    return monthData.filter(a => a.employeeId === selectedEmp)
  }, [monthData, selectedEmp])

  const summary = useMemo(() => {
    const total = empMonthData.length
    const present = empMonthData.filter(a => a.status === 'present').length
    const late = empMonthData.filter(a => a.status === 'late').length
    const absent = empMonthData.filter(a => a.status === 'absent').length
    const halfDay = empMonthData.filter(a => a.status === 'half_day').length
    const totalHours = empMonthData.reduce((sum, a) => sum + (a.workingHours || 0), 0)
    const avgHours = total > 0 ? totalHours / total : 0

    const statusData = [
      { name: 'Present', value: present, color: COLORS.present },
      { name: 'Late', value: late, color: COLORS.late },
      { name: 'Absent', value: absent, color: COLORS.absent },
      { name: 'Half Day', value: halfDay, color: COLORS.half_day },
    ].filter(d => d.value > 0)

    const dailyHours = empMonthData
      .filter(a => a.workingHours > 0)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(a => ({
        date: a.date.slice(8, 10),
        hours: a.workingHours,
        status: a.status,
      }))

    return { total, present, late, absent, halfDay, totalHours, avgHours, statusData, dailyHours }
  }, [empMonthData])

  function fullName(e: Employee): string {
    return `${e.firstName} ${e.lastName}`
  }

  const monthOptions = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthOptions.push({
      value: val,
      label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    })
  }

  const employeeOptions = [
    { value: '', label: 'All Employees' },
    ...employees.map(e => ({ value: e.id, label: fullName(e) })),
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Attendance Reports</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Analyze attendance patterns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={<FiDownload />} onClick={() => alert('Export feature coming soon')}>Export</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-56">
          <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            options={employeeOptions}
            value={selectedEmp}
            onChange={e => setSelectedEmp(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard icon={<FiCalendar />} value={summary.total} label="Total Days" color="royal" />
        <StatsCard icon={<FiBarChart2 />} value={summary.present} label="Present" color="green" />
        <StatsCard icon={<FiClock />} value={summary.late} label="Late" color="gold" />
        <StatsCard icon={<FiClock />} value={summary.absent} label="Absent" color="red" />
        <StatsCard icon={<FiClock />} value={`${summary.avgHours.toFixed(1)}h`} label="Avg Hours/Day" color="purple" />
      </div>

      {empMonthData.length === 0 ? (
        <Card>
          <EmptyState title="No data" description="No attendance records for the selected period" icon={<FiCalendar />} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Attendance Distribution" subtitle="Status breakdown">
            <div className="h-[300px] flex items-center justify-center">
              {summary.statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {summary.statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-[var(--text-tertiary)]">No data to display</p>
              )}
            </div>
          </Card>

          <Card title="Daily Working Hours" subtitle="Hours worked per day">
            <div className="h-[300px]">
              {summary.dailyHours.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.dailyHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="date" tick={{ fill: 'var(--text-primary)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'var(--text-primary)', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, color: 'var(--text-primary)' }}
                    />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                      {summary.dailyHours.map((entry, i) => (
                        <Cell key={i} fill={COLORS[entry.status as keyof typeof COLORS] || COLORS.present} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-[var(--text-tertiary)]">No working hours recorded</p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Monthly Summary" subtitle="Detailed breakdown" className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="premium-table w-full">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Count</th>
                    <th>Percentage</th>
                    <th>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Present', value: summary.present, color: 'bg-emerald-500' },
                    { label: 'Late', value: summary.late, color: 'bg-amber-400' },
                    { label: 'Absent', value: summary.absent, color: 'bg-red-500' },
                    { label: 'Half Day', value: summary.halfDay, color: 'bg-blue-400' },
                  ].map(row => (
                    <tr key={row.label}>
                      <td className="font-medium text-[var(--text-primary)]">{row.label}</td>
                      <td>{row.value}</td>
                      <td>{summary.total > 0 ? `${((row.value / summary.total) * 100).toFixed(1)}%` : '0%'}</td>
                      <td className="w-48">
                        <div className="w-full h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${row.color} transition-all`}
                            style={{ width: `${summary.total > 0 ? (row.value / summary.total) * 100 : 0}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="text-[var(--text-primary)]">Total Working Hours</td>
                    <td colSpan={3}>{summary.totalHours.toFixed(1)}h</td>
                  </tr>
                  <tr className="font-semibold">
                    <td className="text-[var(--text-primary)]">Average Daily Hours</td>
                    <td colSpan={3}>{summary.avgHours.toFixed(1)}h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
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
  }
}

function mapAtt(raw: any): AttendanceRecord {
  return {
    id: raw.id,
    employeeId: raw.employeeId,
    date: raw.date,
    status: raw.status || 'absent',
    workingHours: raw.workingHours || raw.hoursWorked || 0,
  }
}
