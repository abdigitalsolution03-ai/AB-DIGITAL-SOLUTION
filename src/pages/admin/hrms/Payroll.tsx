import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiDollarSign, FiTrendingUp, FiAward, FiBook, FiDownload, FiPlus, FiClock } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Modal, Input, Select, Table, StatsCard, EmptyState, ConfirmDialog } from '@/components/ui'
import type { Column } from '@/components/ui'

interface Payroll {
  id: string
  employeeId: string
  month: string
  year: string
  basicSalary: number
  allowances: number
  deductions: number
  grossPay: number
  netPay: number
  tax: number
  paymentStatus: 'paid' | 'pending'
  paymentDate: string
}

interface Employee {
  id: string
  firstName: string
  lastName: string
  salary: number
}

function mapPayroll(raw: any): Payroll {
  const basic = raw.basicSalary || raw.basic || 0
  const allowances = raw.allowances || raw.hra || raw.bonus || 0
  const deductions = raw.deductions?.pf || raw.deductions?.tax || raw.deductions?.insurance
    ? (raw.deductions.pf || 0) + (raw.deductions.tax || 0) + (raw.deductions.insurance || 0)
    : raw.deductions || 0
  const gross = raw.grossPay || raw.netSalary ? raw.netSalary + deductions + (raw.tax || 0) : basic + allowances
  return {
    id: raw.id,
    employeeId: raw.employeeId,
    month: raw.month?.split('-')[1] || raw.month || '',
    year: raw.month?.split('-')[0] || raw.year || '',
    basicSalary: basic,
    allowances,
    deductions,
    grossPay: raw.grossPay || gross,
    netPay: raw.netPay || raw.netSalary || (gross - deductions - (raw.tax || 0)),
    tax: raw.tax || 0,
    paymentStatus: raw.paymentStatus || raw.status || 'pending',
    paymentDate: raw.paymentDate || raw.paidOn || '',
  }
}

export default function Payroll() {
  const [payrollData, setPayrollData] = useState<Payroll[]>(() => store.getCollection<any>('payroll').map(mapPayroll))
  const [employees] = useState<Employee[]>(() => store.getCollection<any>('employees').map(mapEmp))

  const now = new Date()
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
  const currentYear = String(now.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [showGenerate, setShowGenerate] = useState(false)
  const [generating, setGenerating] = useState(false)

  const filtered = useMemo(() => {
    return payrollData.filter(p => p.month === selectedMonth && p.year === selectedYear)
  }, [payrollData, selectedMonth, selectedYear])

  const stats = useMemo(() => {
    const totalPayroll = filtered.reduce((s, p) => s + p.netPay, 0)
    const totalAllowances = filtered.reduce((s, p) => s + p.allowances, 0)
    const totalDeductions = filtered.reduce((s, p) => s + p.deductions, 0)
    const avgSalary = filtered.length > 0 ? totalPayroll / filtered.length : 0
    return { totalPayroll, totalAllowances, totalDeductions, avgSalary, count: filtered.length }
  }, [filtered])

  function fullName(e: Employee): string {
    return `${e.firstName} ${e.lastName}`
  }

  function getEmployeeName(id: string): string {
    const emp = employees.find(e => e.id === id)
    return emp ? fullName(emp) : id
  }

  function handleGeneratePayroll() {
    setGenerating(true)
    const existingEmpIds = new Set(filtered.map(p => p.employeeId))
    const pending = employees.filter(e => !existingEmpIds.has(e.id))
    pending.forEach(emp => {
      const basic = Math.round(emp.salary * 0.5)
      const allowances = Math.round(emp.salary * 0.3)
      const gross = basic + allowances
      const tax = Math.round(gross * 0.1)
      const deductions = Math.round(gross * 0.12) + tax
      const netPay = gross - deductions
      const created = store.create<any>('payroll', {
        employeeId: emp.id,
        month: `${selectedYear}-${selectedMonth}`,
        basicSalary: basic,
        allowances,
        deductions,
        grossPay: gross,
        netPay,
        tax,
        paymentStatus: 'pending',
        paymentDate: '',
      })
      setPayrollData(prev => [...prev, {
        id: created.id,
        employeeId: emp.id,
        month: selectedMonth,
        year: selectedYear,
        basicSalary: basic,
        allowances,
        deductions,
        grossPay: gross,
        netPay,
        tax,
        paymentStatus: 'pending',
        paymentDate: '',
      }])
    })
    setGenerating(false)
    setShowGenerate(false)
  }

  function handleMarkPaid(payroll: Payroll) {
    const date = new Date().toISOString()
    store.update('payroll', payroll.id, { paymentStatus: 'paid', paymentDate: date })
    setPayrollData(prev => prev.map(p => p.id === payroll.id ? { ...p, paymentStatus: 'paid', paymentDate: date } : p))
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: new Date(2024, i).toLocaleDateString('en-US', { month: 'long' }),
  }))

  const yearOptions = Array.from({ length: 4 }, (_, i) => {
    const y = now.getFullYear() - 1 + i
    return { value: String(y), label: String(y) }
  })

  const columns: Column<Payroll>[] = [
    {
      key: 'employeeId',
      header: 'Employee',
      sortable: true,
      render: (p) => (
        <span className="font-medium text-[var(--text-primary)]">{getEmployeeName(p.employeeId)}</span>
      ),
    },
    {
      key: 'basicSalary',
      header: 'Basic',
      render: (p) => <span>₹{p.basicSalary.toLocaleString()}</span>,
    },
    {
      key: 'allowances',
      header: 'Allowances',
      render: (p) => <span>₹{p.allowances.toLocaleString()}</span>,
    },
    {
      key: 'deductions',
      header: 'Deductions',
      render: (p) => <span className="text-red-500">₹{p.deductions.toLocaleString()}</span>,
    },
    {
      key: 'grossPay',
      header: 'Gross Pay',
      render: (p) => <span className="font-semibold">₹{p.grossPay.toLocaleString()}</span>,
    },
    {
      key: 'tax',
      header: 'Tax',
      render: (p) => <span>₹{p.tax.toLocaleString()}</span>,
    },
    {
      key: 'netPay',
      header: 'Net Pay',
      render: (p) => <span className="font-bold text-[var(--royal-blue)]">₹{p.netPay.toLocaleString()}</span>,
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      sortable: true,
      render: (p) => (
        <Badge variant={p.paymentStatus === 'paid' ? 'success' : 'warning'} size="sm" dot>
          {p.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      render: (p) => (
        <span className="text-sm text-[var(--text-secondary)]">
          {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="flex gap-1">
          {p.paymentStatus === 'pending' && (
            <Button size="sm" variant="ghost" onClick={() => handleMarkPaid(p)} className="text-emerald-500">Mark Paid</Button>
          )}
          <Button size="sm" variant="ghost" icon={<FiDownload />} onClick={() => alert('Payslip download coming soon')} />
        </div>
      ),
    },
  ]

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Payroll</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage employee salaries and payments</p>
        </div>
        <Button
          icon={<FiPlus />}
          onClick={() => setShowGenerate(true)}
          loading={generating}
        >
          Generate Payroll
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-48">
          <Select
            options={monthOptions}
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-36">
          <Select
            options={yearOptions}
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<FiDollarSign />} value={`₹${(stats.totalPayroll / 100000).toFixed(1)}L`} label="Total Payroll" color="royal" />
        <StatsCard icon={<FiTrendingUp />} value={`₹${Math.round(stats.avgSalary).toLocaleString()}`} label="Avg Salary" color="gold" />
        <StatsCard icon={<FiAward />} value={`₹${(stats.totalAllowances / 100000).toFixed(1)}L`} label="Total Allowances" color="green" />
        <StatsCard icon={<FiBook />} value={`₹${(stats.totalDeductions / 100000).toFixed(1)}L`} label="Total Deductions" color="red" />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FiDollarSign size={36} />}
            title="No payroll records"
            description="Generate payroll for this month to get started"
            action={{ label: 'Generate Payroll', onClick: () => setShowGenerate(true) }}
          />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            keyExtractor={p => p.id}
            pageSize={10}
          />
        )}
      </Card>

      <Modal isOpen={showGenerate} onClose={() => setShowGenerate(false)} title="Generate Payroll" size="sm">
        <p className="text-sm text-[var(--text-tertiary)] mb-4">
          Generate payroll records for all employees for{' '}
          {monthOptions.find(m => m.value === selectedMonth)?.label} {selectedYear}.
          {filtered.length > 0 && (
            <span className="block mt-2 text-amber-500">
              {filtered.length} record(s) already exist for this period. Missing employees will be added.
            </span>
          )}
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowGenerate(false)}>Cancel</Button>
          <Button onClick={handleGeneratePayroll} loading={generating}>Generate</Button>
        </div>
      </Modal>
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
    salary: raw.salary || 0,
  }
}
