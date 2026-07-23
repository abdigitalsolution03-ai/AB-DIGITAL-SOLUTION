import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiX, FiSend, FiBell, FiCalendar, FiUser } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { getSession } from '@/services/auth'
import { Card, Button, Badge, EmptyState, Avatar } from '@/components/ui'

const PRIORITY_VARIANTS: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  low: 'info',
  medium: 'success',
  high: 'warning',
  urgent: 'danger',
}

const stagger = {
  initial: { opacity: 0, y: 15 },
  animate: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const roles = ['super_admin', 'hr_manager', 'team_leader', 'sales_executive', 'employee', 'client']

export default function AnnouncementsPage() {
  const session = getSession()
  const [announcements, setAnnouncements] = useState(() => store.getCollection<any>('announcements'))
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', priority: 'medium', targetRoles: [] as string[], status: 'draft' })

  const users = store.getCollection<any>('users')

  const refresh = () => setAnnouncements([...store.getCollection<any>('announcements')])

  const sorted = useMemo(() => {
    return [...announcements].sort((a: any, b: any) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [announcements])

  const handleSubmit = () => {
    if (!form.title) return
    store.create('announcements', {
      title: form.title,
      content: form.content,
      priority: form.priority,
      postedBy: session?.userId || '',
      postedByName: session?.name || 'Unknown',
      targetRoles: form.targetRoles,
      status: form.status,
      pinned: false,
    })
    setForm({ title: '', content: '', priority: 'medium', targetRoles: [], status: 'draft' })
    setShowNew(false)
    refresh()
  }

  const toggleRole = (role: string) => {
    setForm(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role],
    }))
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Announcements</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Company-wide announcements and updates</p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setShowNew(true)}>New Announcement</Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={<FiBell size={40} />} title="No announcements yet" description="Create the first announcement" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((ann: any, i: number) => (
            <motion.div key={ann.id} custom={i} variants={stagger} initial="initial" animate="animate"
              className={`premium-card p-5 ${ann.pinned ? 'border-[var(--gold)]/50' : ''} ${ann.status === 'draft' ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <Badge variant={PRIORITY_VARIANTS[ann.priority] || 'default'} size="sm">{ann.priority}</Badge>
                <div className="flex items-center gap-2">
                  {ann.pinned && <Badge variant="warning" size="sm">Pinned</Badge>}
                  {ann.status === 'draft' && <Badge variant="default" size="sm">Draft</Badge>}
                </div>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{ann.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3">{ann.content}</p>
              <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                <div className="flex items-center gap-2">
                  <Avatar src="" alt={ann.postedByName || 'User'} size="sm" />
                  <span>{ann.postedByName || 'Unknown'}</span>
                </div>
                <span className="flex items-center gap-1">
                  <FiCalendar size={12} /> {store.formatDate(ann.createdAt)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
            onClick={() => setShowNew(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl premium-card" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">New Announcement</h2>
                <button onClick={() => setShowNew(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"><FiX size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none" placeholder="Announcement title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Content</label>
                  <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none min-h-[120px]" placeholder="Write announcement content..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Priority</label>
                    <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Target Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                      <button key={role} onClick={() => toggleRole(role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          form.targetRoles.includes(role)
                            ? 'bg-[var(--royal-blue)] text-white'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]'
                        }`}>
                        {role.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <Button className="w-full" icon={<FiSend />} onClick={handleSubmit} disabled={!form.title}>
                  {form.status === 'published' ? 'Publish Announcement' : 'Save as Draft'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
