import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiBell, FiCheck, FiCheckCircle, FiInfo, FiAlertTriangle, FiAlertCircle, FiStar, FiMessageSquare, FiCalendar, FiBriefcase, FiDollarSign } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { getSession } from '@/services/auth'
import { Card, Button, Badge, EmptyState } from '@/components/ui'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  lead: <FiStar />,
  task: <FiCheckCircle />,
  hr: <FiBriefcase />,
  finance: <FiDollarSign />,
  success: <FiCheckCircle />,
  project: <FiCalendar />,
  support: <FiMessageSquare />,
  system: <FiInfo />,
}

const TYPE_COLORS: Record<string, string> = {
  lead: 'text-blue-500 bg-blue-500/10',
  task: 'text-green-500 bg-green-500/10',
  hr: 'text-purple-500 bg-purple-500/10',
  finance: 'text-gold-500 bg-gold-500/10',
  success: 'text-green-500 bg-green-500/10',
  project: 'text-indigo-500 bg-indigo-500/10',
  support: 'text-cyan-500 bg-cyan-500/10',
  system: 'text-[var(--text-tertiary)] bg-[var(--bg-tertiary)]',
}

const stagger = {
  initial: { opacity: 0, x: -10 },
  animate: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

export default function NotificationsPage() {
  const session = getSession()
  const [notifications, setNotifications] = useState(() => store.getCollection<any>('notifications'))
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const refresh = () => setNotifications([...store.getCollection<any>('notifications')])

  const userNotifications = useMemo(() => {
    let items = session ? notifications.filter((n: any) => n.userId === session.userId) : notifications
    if (filter === 'unread') items = items.filter((n: any) => !n.read)
    if (filter === 'read') items = items.filter((n: any) => n.read)
    return items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [notifications, session, filter])

  const unreadCount = useMemo(() => notifications.filter((n: any) => !n.read).length, [notifications])

  const markAsRead = (id: string) => {
    store.update('notifications', id, { read: true })
    refresh()
  }

  const markAllAsRead = () => {
    notifications.forEach((n: any) => {
      if (!n.read) store.update('notifications', n.id, { read: true })
    })
    refresh()
  }

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return store.formatDate(dateStr)
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notifications</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'No unread notifications'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={<FiCheck />} onClick={markAllAsRead}>Mark All Read</Button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'unread', 'read'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f ? 'bg-[var(--royal-blue)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <Card padding="none">
        {userNotifications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<FiBell size={40} />}
              title="No notifications"
              description={filter === 'unread' ? 'You have no unread notifications' : 'No notifications to show'}
            />
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {userNotifications.map((notif: any, i: number) => (
              <motion.div key={notif.id} custom={i} variants={stagger} initial="initial" animate="animate"
                className={`flex items-start gap-4 p-4 transition-colors cursor-pointer ${
                  !notif.read ? 'bg-[var(--royal-blue)]/5' : ''
                } hover:bg-[var(--bg-secondary)]`}
                onClick={() => !notif.read && markAsRead(notif.id)}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[notif.type] || TYPE_COLORS.system}`}>
                  {TYPE_ICONS[notif.type] || <FiBell size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{notif.title}</p>
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-[var(--royal-blue)]" />}
                      <span className="text-xs text-[var(--text-tertiary)] whitespace-nowrap">{getTimeAgo(notif.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {!notif.read && (
                  <button onClick={e => { e.stopPropagation(); markAsRead(notif.id) }}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--royal-blue)] transition-colors flex-shrink-0">
                    <FiCheckCircle size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </PageTransition>
  )
}
