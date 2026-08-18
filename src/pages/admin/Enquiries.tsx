import { useState, useEffect, useCallback, useMemo } from 'react'
import { FiTrash2, FiDownload, FiMail, FiRefreshCw, FiCheck, FiSearch, FiSend, FiPhone, FiClock } from 'react-icons/fi'
import { Card, Button, EmptyState, ConfirmDialog, Badge } from '@/components/ui'
import { getEnquiries, removeEnquiry, updateEnquiry } from '@/services/auth'

const STATUSES: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400' },
  won: { label: 'Won', color: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400' },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400' },
}

export default function AdminEnquiries() {
  const [items, setItems] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selected, setSelected] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'new' | 'contacted' | 'won' | 'lost'>('all')
  const [query, setQuery] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await getEnquiries())
    } catch (err: any) {
      setError(err?.message || 'Could not load enquiries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const unreadCount = useMemo(() => items.filter(i => !i.read).length, [items])

  const filtered = useMemo(() => {
    let list = items
    if (filter === 'unread') list = list.filter(i => !i.read)
    if (filter !== 'all' && filter !== 'unread') list = list.filter(i => (i.status || 'new') === filter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(i => (i.name || '').toLowerCase().includes(q) || (i.email || '').toLowerCase().includes(q) || (i.service || '').toLowerCase().includes(q) || (i.message || '').toLowerCase().includes(q))
    }
    return list
  }, [items, filter, query])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await removeEnquiry(deleteId)
      setItems(prev => prev.filter(i => i.id !== deleteId))
    } catch (err: any) {
      setError(err?.message || 'Could not delete enquiry')
    }
    setDeleteId(null)
  }

  const handleToggleRead = async (item: any) => {
    try {
      await updateEnquiry(item.id, { read: !item.read })
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, read: !item.read } : i))
      if (selected?.id === item.id) setSelected({ ...selected, read: !item.read })
    } catch { /* ignore */ }
  }

  const handleStatus = async (item: any, status: string) => {
    try {
      await updateEnquiry(item.id, { status })
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status } : i))
      if (selected?.id === item.id) setSelected({ ...selected, status })
    } catch { /* ignore */ }
  }

  const exportCSV = () => {
    const csv = 'Name,Email,Phone,Business,Service,Message,Status,Date\n' + filtered.map(s =>
      `${s.name},${s.email},${s.phone||''},${s.business||''},${s.service||''},"${(s.message||'').replace(/"/g,'""')}",${s.status||'new'},${new Date(s.createdAt).toLocaleString()}`
    ).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'enquiries.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const filters = [
    { key: 'all', label: 'All', count: items.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'new', label: 'New', count: items.filter(i => (i.status || 'new') === 'new').length },
    { key: 'contacted', label: 'Contacted', count: items.filter(i => i.status === 'contacted').length },
    { key: 'won', label: 'Won', count: items.filter(i => i.status === 'won').length },
    { key: 'lost', label: 'Lost', count: items.filter(i => i.status === 'lost').length },
  ]

  const fmt = (iso: string) => {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch { return iso }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Leads Inbox</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Contact form submissions from the website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon={<FiRefreshCw />} onClick={refresh}>Refresh</Button>
          <Button variant="outline" size="sm" icon={<FiDownload />} onClick={exportCSV}>Export CSV</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filter === f.key
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-[var(--border-primary)] text-[var(--text-tertiary)] hover:border-blue-300'
            }`}
          >
            {f.label}
            <span className={`px-1.5 rounded-full text-[10px] font-bold ${filter === f.key ? 'bg-blue-500 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>{f.count}</span>
          </button>
        ))}
        <div className="relative flex-1 min-w-[180px] ml-auto">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name, email, service…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none focus:border-blue-500 placeholder:text-[var(--text-tertiary)]"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-2.5 rounded-xl mb-4">{error}</p>
      )}

      <Card>
        {loading ? (
          <p className="text-sm text-[var(--text-tertiary)] py-8 text-center">Loading leads…</p>
        ) : filtered.length === 0 ? (
          <EmptyState title="No leads" description="Contact form submissions will appear here" action={<Button variant="primary" size="sm" onClick={refresh}>Refresh</Button>} />
        ) : (
          <div className="divide-y divide-[var(--border-primary)]">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors ${!item.read ? 'bg-blue-50/40 dark:bg-blue-500/5' : ''}`}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleRead(item) }}
                  className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    item.read ? 'border-[var(--border-primary)] text-transparent' : 'border-blue-500 text-blue-500'
                  }`}
                  aria-label={item.read ? 'Mark as unread' : 'Mark as read'}
                >
                  <FiCheck size={14} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-sm ${item.read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)] font-semibold'}`}>{item.name || 'Anonymous'}</p>
                    {item.business && <span className="text-xs text-[var(--text-tertiary)]">· {item.business}</span>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUSES[item.status || 'new']?.color || STATUSES.new.color}`}>
                      {STATUSES[item.status || 'new']?.label || 'New'}
                    </span>
                    {!item.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">{item.service ? `${item.service} — ` : ''}{item.email}{item.phone ? ` · ${item.phone}` : ''}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{item.message}</p>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-1 flex items-center gap-1"><FiClock size={10} /> {fmt(item.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <a
                    href={`mailto:${item.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-blue-500 hover:bg-[var(--bg-tertiary)] transition-colors"
                    aria-label="Reply by email"
                  >
                    <FiMail size={15} />
                  </a>
                  {item.phone && (
                    <a
                      href={`https://wa.me/${String(item.phone).replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-green-500 hover:bg-[var(--bg-tertiary)] transition-colors"
                      aria-label="Reply on WhatsApp"
                    >
                      <FiSend size={15} />
                    </a>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:text-red-500 hover:bg-[var(--bg-tertiary)] transition-colors"
                    aria-label="Delete"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-primary)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">{selected.name || 'Anonymous'}</h2>
                <p className="text-sm text-[var(--text-tertiary)]">{selected.email} {selected.phone && `· ${selected.phone}`}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-xl leading-none">×</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="rounded-xl bg-[var(--bg-secondary)] p-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold">Business</p>
                <p className="text-[var(--text-primary)] font-medium mt-0.5">{selected.business || '—'}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-secondary)] p-3">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold">Service</p>
                <p className="text-[var(--text-primary)] font-medium mt-0.5">{selected.service || '—'}</p>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--bg-secondary)] p-3 mb-4">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold mb-1.5">Message</p>
              <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">{selected.message}</p>
            </div>

            <p className="text-xs text-[var(--text-tertiary)] mb-4 flex items-center gap-1.5"><FiClock size={12} /> {fmt(selected.createdAt)}</p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-[var(--text-tertiary)]">Status:</span>
              {Object.entries(STATUSES).map(([key, s]) => (
                <button
                  key={key}
                  onClick={() => handleStatus(selected, key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    (selected.status || 'new') === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'border-[var(--border-primary)] text-[var(--text-tertiary)] hover:border-blue-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${selected.email}`} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                <FiMail size={15} /> Reply Email
              </a>
              {selected.phone && (
                <a
                  href={`https://wa.me/${String(selected.phone).replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <FiSend size={15} /> WhatsApp
                </a>
              )}
              <a href={`tel:${selected.phone}`} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-primary)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-secondary)] transition-colors">
                <FiPhone size={15} /> Call
              </a>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete lead?"
        message="This will permanently remove the lead from your inbox."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}