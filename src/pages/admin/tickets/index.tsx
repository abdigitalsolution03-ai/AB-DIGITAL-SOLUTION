import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiPlus, FiMessageSquare, FiSend, FiChevronDown, FiX } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, SearchInput, EmptyState, Avatar } from '@/components/ui'

const TABS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed']

const PRIORITY_COLORS: Record<string, 'info' | 'warning' | 'danger' | 'default'> = {
  low: 'info',
  medium: 'warning',
  high: 'danger',
  urgent: 'danger',
}

const STATUS_COLORS: Record<string, 'info' | 'warning' | 'success' | 'default'> = {
  open: 'info',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'default',
}

const stagger = {
  initial: { opacity: 0, y: 10 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState(() => store.getCollection<any>('tickets'))
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', description: '', priority: 'medium', category: '' })

  const users = store.getCollection<any>('users')

  const filteredTickets = useMemo(() => {
    let items = [...tickets]
    if (activeTab > 0) {
      const statusMap = ['', 'open', 'in_progress', 'resolved', 'closed']
      items = items.filter(t => t.status === statusMap[activeTab])
    }
    if (search) items = items.filter(t => t.subject?.toLowerCase().includes(search.toLowerCase()) || t.customer?.toLowerCase().includes(search.toLowerCase()))
    if (priorityFilter) items = items.filter(t => t.priority === priorityFilter)
    return items.sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
  }, [tickets, activeTab, search, priorityFilter])

  const stats = useMemo(() => ({
    open: tickets.filter((t: any) => t.status === 'open').length,
    inProgress: tickets.filter((t: any) => t.status === 'in_progress').length,
    resolved: tickets.filter((t: any) => t.status === 'resolved').length,
    closed: tickets.filter((t: any) => t.status === 'closed').length,
  }), [tickets])

  const refreshTickets = () => setTickets([...store.getCollection<any>('tickets')])

  const handleNewTicket = () => {
    if (!newTicketForm.subject) return
    store.create('tickets', {
      subject: newTicketForm.subject,
      description: newTicketForm.description,
      status: 'open',
      priority: newTicketForm.priority,
      customer: newTicketForm.category || 'General',
      customerId: '',
      assignedTo: users[0]?.id || '',
      createdBy: users[0]?.name || 'Unknown',
      messages: [{ from: users[0]?.name || 'Unknown', content: newTicketForm.description, timestamp: new Date().toISOString() }],
    })
    setNewTicketForm({ subject: '', description: '', priority: 'medium', category: '' })
    setShowNewTicket(false)
    refreshTickets()
  }

  const handleAddComment = () => {
    if (!commentText || !selectedTicket) return
    const ticket = tickets.find((t: any) => t.id === selectedTicket)
    if (!ticket) return
    const messages = [...(ticket.messages || []), { from: users[0]?.name || 'Unknown', content: commentText, timestamp: new Date().toISOString() }]
    store.update('tickets', selectedTicket, { messages, updatedAt: new Date().toISOString() })
    setCommentText('')
    refreshTickets()
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    store.update('tickets', ticketId, { status: newStatus, updatedAt: new Date().toISOString() })
    refreshTickets()
  }

  const selectedTicketData = selectedTicket ? tickets.find((t: any) => t.id === selectedTicket) : null

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Support Tickets</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Manage customer support requests</p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setShowNewTicket(true)}>New Ticket</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-2xl font-bold text-blue-500">{stats.open}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Open</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-gold-500">{stats.inProgress}</p>
          <p className="text-xs text-[var(--text-tertiary)]">In Progress</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Resolved</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-[var(--text-tertiary)]">{stats.closed}</p>
          <p className="text-xs text-[var(--text-tertiary)]">Closed</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === i ? 'bg-[var(--royal-blue)] text-white' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm outline-none">
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <SearchInput value={search} onChange={setSearch} placeholder="Search tickets..." className="w-48" />
          </div>
        </div>

        <div className="space-y-2">
          {filteredTickets.length === 0 ? (
            <EmptyState title="No tickets found" description="Create a new ticket to get started" />
          ) : filteredTickets.map((ticket: any, i: number) => (
            <motion.div key={ticket.id} custom={i} variants={stagger} initial="initial" animate="animate">
              <div onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                className="p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[var(--text-tertiary)]">#{ticket.id?.slice(-6)}</span>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{ticket.subject}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                      <span>{ticket.customer}</span>
                      <span>·</span>
                      <span>Assigned to {users.find((u: any) => u.id === ticket.assignedTo)?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                  <Badge variant={PRIORITY_COLORS[ticket.priority] || 'default'} size="sm">{ticket.priority}</Badge>
                  <select value={ticket.status} onChange={e => { e.stopPropagation(); handleStatusChange(ticket.id, e.target.value) }}
                    className="px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs outline-none"
                    onClick={e => e.stopPropagation()}>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-tertiary)]">
                  <span>{store.formatDate(ticket.createdAt)}</span>
                  <span>·</span>
                  <span>Updated {store.formatDate(ticket.updatedAt)}</span>
                  <span>·</span>
                  <span>{ticket.messages?.length || 0} messages</span>
                </div>
              </div>

              <AnimatePresence>
                {selectedTicket === ticket.id && selectedTicketData && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="p-4 ml-8 mt-2 rounded-xl bg-[var(--bg-tertiary)]">
                      <p className="text-sm text-[var(--text-primary)] mb-4">{selectedTicketData.description}</p>
                      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                        {(selectedTicketData.messages || []).map((msg: any, mi: number) => (
                          <div key={mi} className={`flex gap-3 ${mi === 0 ? '' : ''}`}>
                            <Avatar src="" alt={msg.from} size="sm" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-[var(--text-primary)]">{msg.from}</span>
                                <span className="text-[10px] text-[var(--text-tertiary)]">{new Date(msg.timestamp).toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)]">{msg.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input value={commentText} onChange={e => setCommentText(e.target.value)}
                          className="flex-1 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm outline-none"
                          placeholder="Add a comment..." onKeyDown={e => e.key === 'Enter' && handleAddComment()} />
                        <Button size="sm" icon={<FiSend />} onClick={handleAddComment} disabled={!commentText}>Send</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </Card>

      <AnimatePresence>
        {showNewTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
            onClick={() => setShowNewTicket(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg premium-card p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">New Ticket</h2>
                <button onClick={() => setShowNewTicket(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Subject</label>
                  <input value={newTicketForm.subject} onChange={e => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" placeholder="Brief description of the issue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
                  <textarea value={newTicketForm.description} onChange={e => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none min-h-[120px]" placeholder="Detailed description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Priority</label>
                    <select value={newTicketForm.priority} onChange={e => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Category</label>
                    <select value={newTicketForm.category} onChange={e => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="">General</option>
                      <option value="Technical">Technical</option>
                      <option value="Billing">Billing</option>
                      <option value="Feature">Feature Request</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full" onClick={handleNewTicket} disabled={!newTicketForm.subject}>Create Ticket</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
