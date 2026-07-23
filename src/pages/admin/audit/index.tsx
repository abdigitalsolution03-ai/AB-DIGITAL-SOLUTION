import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiDownload, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, SearchInput, EmptyState } from '@/components/ui'

const ACTION_TYPES = ['All', 'Create', 'Read', 'Update', 'Delete', 'Login', 'Logout']

const ACTION_COLORS: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'default'> = {
  Create: 'success',
  Read: 'info',
  Update: 'warning',
  Delete: 'danger',
  Login: 'success',
  Logout: 'default',
}

const PER_PAGE = 20

const stagger = {
  initial: { opacity: 0, y: 5 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.02, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(() => store.getCollection<any>('auditLogs'))
  const [actionFilter, setActionFilter] = useState('All')
  const [userFilter, setUserFilter] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const users = useMemo(() => {
    const names = new Set<string>()
    logs.forEach((l: any) => {
      if (l.userName) names.add(l.userName)
      if (l.user) names.add(l.user)
    })
    return Array.from(names)
  }, [logs])

  const filteredLogs = useMemo(() => {
    let items = [...logs]
    if (actionFilter !== 'All') items = items.filter(l => l.action === actionFilter)
    if (userFilter) items = items.filter(l => l.userName === userFilter || l.user === userFilter)
    if (search) {
      const q = search.toLowerCase()
      items = items.filter(l =>
        (l.details || '').toLowerCase().includes(q) ||
        (l.resource || '').toLowerCase().includes(q) ||
        (l.action || '').toLowerCase().includes(q)
      )
    }
    if (dateFrom) items = items.filter(l => new Date(l.timestamp) >= new Date(dateFrom))
    if (dateTo) items = items.filter(l => new Date(l.timestamp) <= new Date(dateTo + 'T23:59:59'))
    return items.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [logs, actionFilter, userFilter, search, dateFrom, dateTo])

  const totalPages = Math.ceil(filteredLogs.length / PER_PAGE)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const handleExport = () => {
    const csv = ['Timestamp,User,Action,Resource,Details,IP Address']
    filteredLogs.forEach((l: any) => {
      csv.push(`"${l.timestamp}","${l.userName || l.user}","${l.action}","${l.resource || ''}","${(l.details || '').replace(/"/g, '""')}","${l.ip || ''}"`)
    })
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Logs</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Track all system activities and changes</p>
        </div>
        <Button variant="outline" size="sm" icon={<FiDownload />} onClick={handleExport}>Export CSV</Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex flex-wrap gap-1">
            {ACTION_TYPES.map(action => (
              <button key={action} onClick={() => { setActionFilter(action); setCurrentPage(1) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  actionFilter === action ? 'bg-[var(--royal-blue)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                }`}>
                {action}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setCurrentPage(1) }}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs outline-none" />
            <span className="text-[var(--text-tertiary)]">-</span>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setCurrentPage(1) }}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs outline-none" />
          </div>
          <select value={userFilter} onChange={e => { setUserFilter(e.target.value); setCurrentPage(1) }}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs outline-none">
            <option value="">All Users</option>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <SearchInput value={search} onChange={v => { setSearch(v); setCurrentPage(1) }} placeholder="Search details..." className="w-40" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left p-3 text-[var(--text-tertiary)] font-semibold text-xs uppercase">Timestamp</th>
                <th className="text-left p-3 text-[var(--text-tertiary)] font-semibold text-xs uppercase">User</th>
                <th className="text-left p-3 text-[var(--text-tertiary)] font-semibold text-xs uppercase">Action</th>
                <th className="text-left p-3 text-[var(--text-tertiary)] font-semibold text-xs uppercase">Resource</th>
                <th className="text-left p-3 text-[var(--text-tertiary)] font-semibold text-xs uppercase">Details</th>
                <th className="text-left p-3 text-[var(--text-tertiary)] font-semibold text-xs uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8"><EmptyState title="No audit logs found" description="Try adjusting your filters" /></td>
                </tr>
              ) : paginatedLogs.map((log: any, i: number) => (
                <motion.tr key={log.id} custom={i} variants={stagger} initial="initial" animate="animate"
                  className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50 transition-colors">
                  <td className="p-3 text-[var(--text-primary)] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className="text-[var(--text-primary)] font-medium">{log.userName || log.user}</span>
                  </td>
                  <td className="p-3">
                    <Badge variant={ACTION_COLORS[log.action] || 'default'} size="sm">{log.action}</Badge>
                  </td>
                  <td className="p-3 text-[var(--text-tertiary)]">{log.resource || '-'}</td>
                  <td className="p-3 text-[var(--text-secondary)] max-w-[300px] truncate">{log.details || '-'}</td>
                  <td className="p-3 text-[var(--text-tertiary)] font-mono text-xs">{log.ip || '-'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-3 border-t border-[var(--border-color)]">
          <p className="text-sm text-[var(--text-tertiary)]">
            Showing {((currentPage - 1) * PER_PAGE) + 1} - {Math.min(currentPage * PER_PAGE, filteredLogs.length)} of {filteredLogs.length}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] disabled:opacity-30">
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, currentPage - 2)
              const page = start + i
              if (page > totalPages) return null
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page ? 'bg-[var(--royal-blue)] text-white' : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]'
                  }`}>
                  {page}
                </button>
              )
            })}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] disabled:opacity-30">
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </Card>
    </PageTransition>
  )
}
