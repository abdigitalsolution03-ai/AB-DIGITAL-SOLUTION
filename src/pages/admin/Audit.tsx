import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface AuditEntry {
  id: string
  timestamp: string
  action: string
  description: string
  user: string
}

const actionTypes = ['Login', 'Logout', 'Create', 'Update', 'Delete']

const sampleActions = [
  { action: 'Login', description: 'Admin logged into the dashboard', user: 'admin@abdigital.com' },
  { action: 'Create', description: 'Created new service: Web Development', user: 'admin@abdigital.com' },
  { action: 'Update', description: 'Updated blog post: Top 10 SEO Tips', user: 'admin@abdigital.com' },
  { action: 'Delete', description: 'Deleted lead: John Doe', user: 'admin@abdigital.com' },
  { action: 'Logout', description: 'Admin logged out', user: 'admin@abdigital.com' },
  { action: 'Login', description: 'Admin logged into the dashboard', user: 'admin@abdigital.com' },
  { action: 'Create', description: 'Created new service: Digital Marketing', user: 'admin@abdigital.com' },
  { action: 'Update', description: 'Updated portfolio item: Brand X', user: 'admin@abdigital.com' },
  { action: 'Create', description: 'Published blog post: 5 SEO Strategies', user: 'admin@abdigital.com' },
  { action: 'Delete', description: 'Removed subscriber: test@example.com', user: 'admin@abdigital.com' },
  { action: 'Update', description: 'Updated service pricing for Social Media', user: 'admin@abdigital.com' },
  { action: 'Create', description: 'Added new media file: banner.jpg', user: 'admin@abdigital.com' },
  { action: 'Login', description: 'Admin logged into the dashboard', user: 'admin@abdigital.com' },
  { action: 'Update', description: 'Updated lead status for Jane Smith', user: 'admin@abdigital.com' },
  { action: 'Delete', description: 'Removed old testimonial entry', user: 'admin@abdigital.com' },
]

export default function AdminAudit() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [filterAction, setFilterAction] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const perPage = 20

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('adminAuditLogs') || '[]')
    if (stored.length === 0) {
      const samples: AuditEntry[] = sampleActions.map((s, i) => ({
        id: (Date.now() + i).toString(),
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        ...s,
      }))
      localStorage.setItem('adminAuditLogs', JSON.stringify(samples))
      setLogs(samples)
    } else {
      setLogs(stored)
    }
  }, [])

  const sorted = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const filtered = sorted.filter((entry) => {
    if (filterAction !== 'All' && entry.action !== filterAction) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        entry.description.toLowerCase().includes(q) ||
        entry.user.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q)
      )
    }
    return true
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const clearLogs = () => {
    localStorage.setItem('adminAuditLogs', '[]')
    setLogs([])
    setShowClearConfirm(false)
  }

  const exportCSV = () => {
    const headers = ['Timestamp', 'Action', 'Description', 'User']
    const rows = sorted.map((e) => [e.timestamp, e.action, `"${e.description.replace(/"/g, '""')}"`, e.user].join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#111]">Audit Logs</h1>
          <p className="text-[#111]/60 text-sm mt-1">{logs.length} total entries</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="px-4 py-2.5 border-3 border-[#111] text-[#111] text-sm font-bold hover:bg-[#60A5FA] transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button onClick={() => setShowClearConfirm(true)} className="px-4 py-2.5 border-3 border-[#111] text-[#111] text-sm font-bold hover:bg-[#FF4D4D] hover:text-white transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Logs
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-3 border-[#111] text-[#111] text-sm focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['All', ...actionTypes].map((a) => (
            <button
              key={a}
              onClick={() => { setFilterAction(a); setCurrentPage(1) }}
              className={`px-3 py-1.5 text-xs font-bold border-3 border-[#111] transition-all ${
                filterAction === a ? 'bg-[#60A5FA] text-[#111]' : 'bg-white text-[#111]/60 hover:bg-[#60A5FA]'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111]">
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Timestamp</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Action</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">Description</th>
                <th className="text-left text-[#111]/40 text-xs font-bold uppercase tracking-wider px-6 py-4">User</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#111]/40 text-sm">No audit logs found.</td>
                </tr>
              ) : (
                paginated.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#111]/10 hover:bg-[#60A5FA]/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60 font-mono text-xs">{new Date(entry.timestamp).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 border-2 border-[#111] text-xs font-bold ${
                        entry.action === 'Login' ? 'bg-green-200 text-green-900' :
                        entry.action === 'Logout' ? 'bg-gray-200 text-gray-900' :
                        entry.action === 'Create' ? 'bg-blue-200 text-blue-900' :
                        entry.action === 'Update' ? 'bg-[#60A5FA] text-[#111]' :
                        'bg-red-200 text-red-900'
                      }`}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111] font-medium">{entry.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#111]/60">{entry.user}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border-3 border-[#111] text-sm font-bold text-[#111]/60 hover:bg-[#60A5FA] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1.5 border-3 border-[#111] text-sm font-bold transition-all ${
                currentPage === p ? 'bg-[#60A5FA] text-[#111]' : 'bg-white text-[#111]/60 hover:bg-[#60A5FA]'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border-3 border-[#111] text-sm font-bold text-[#111]/60 hover:bg-[#60A5FA] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <AnimatePresence>
        {showClearConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowClearConfirm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-sm doodle-card p-6 md:p-8 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-[#FF4D4D] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_#111]">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#111] mb-2">Clear All Logs</h3>
              <p className="text-[#111]/60 text-sm mb-6">This will permanently remove all audit log entries.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setShowClearConfirm(false)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#60A5FA] transition-all">Cancel</button>
                <button onClick={clearLogs} className="px-5 py-2.5 bg-[#FF4D4D] border-3 border-[#111] text-white font-bold text-sm shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] transition-all">Clear All</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

