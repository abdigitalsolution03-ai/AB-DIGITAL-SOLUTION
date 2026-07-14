import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

interface Stats {
  totalLeads: number
  activeServices: number
  blogPosts: number
  mediaFiles: number
  subscribers: number
  pages: number
}

interface Activity {
  id: string
  message: string
  time: string
  color: string
}

interface LeadStatus {
  label: string
  count: number
  color: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalLeads: 0, activeServices: 0, blogPosts: 0, mediaFiles: 0, subscribers: 0, pages: 0 })
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([])
  const [publishedCount, setPublishedCount] = useState(0)
  const [draftCount, setDraftCount] = useState(0)

  useEffect(() => {
    const leads = JSON.parse(localStorage.getItem('adminLeads') || '[]')
    const services = JSON.parse(localStorage.getItem('adminServices') || '[]')
    const blog = JSON.parse(localStorage.getItem('adminBlogPosts') || '[]')
    const media = JSON.parse(localStorage.getItem('adminMedia') || '[]')
    const subscribers = JSON.parse(localStorage.getItem('adminSubscribers') || '[]')
    const pages = JSON.parse(localStorage.getItem('adminPages') || '[]')
    const auditLogs = JSON.parse(localStorage.getItem('adminAuditLogs') || '[]')

    setStats({
      totalLeads: leads.length,
      activeServices: services.length,
      blogPosts: blog.length,
      mediaFiles: media.length,
      subscribers: subscribers.length,
      pages: pages.length,
    })

    const statusMap: Record<string, number> = {}
    leads.forEach((l: any) => {
      const s = l.status || 'New'
      statusMap[s] = (statusMap[s] || 0) + 1
    })
    const statusColors: Record<string, string> = { New: '#4D7AFF', Contacted: '#FFD400', Qualified: '#8B5CF6', Converted: '#10B981', Lost: '#FF4D4D' }
    setLeadStatuses(Object.entries(statusMap).map(([label, count]) => ({ label, count, color: statusColors[label] || '#4D7AFF' })))

    const published = pages.filter((p: any) => p.status === 'published').length
    const drafts = pages.filter((p: any) => p.status === 'draft').length
    setPublishedCount(published)
    setDraftCount(drafts)

    const activity: Activity[] = []
    const sortedLogs = [...auditLogs].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)
    sortedLogs.forEach((l: any) => {
      const color = l.action === 'Login' ? '#4D7AFF' : l.action === 'Logout' ? '#6B7280' : l.action === 'Create' ? '#10B981' : l.action === 'Update' ? '#FFD400' : '#FF4D4D'
      activity.push({ id: l.id, message: l.description, time: new Date(l.timestamp).toLocaleString(), color })
    })
    setRecentActivity(activity)
  }, [])

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', link: '/admin/leads', color: '#4D7AFF' },
    { label: 'Active Services', value: stats.activeServices, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', link: '/admin/services', color: '#FFD400' },
    { label: 'Blog Posts', value: stats.blogPosts, icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', link: '/admin/blog', color: '#8B5CF6' },
    { label: 'Media Files', value: stats.mediaFiles, icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', link: '/admin/media', color: '#10B981' },
    { label: 'Subscribers', value: stats.subscribers, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', link: '/admin/subscribers', color: '#FF4D4D' },
    { label: 'Pages', value: stats.pages, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', link: '/admin/pages', color: '#EC4899' },
  ]

  const quickActions = [
    { label: 'New Blog Post', link: '/admin/blog', icon: 'M12 4v16m8-8H4' },
    { label: 'Add Service', link: '/admin/services', icon: 'M12 4v16m8-8H4' },
    { label: 'Upload Media', link: '/admin/media', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'View Leads', link: '/admin/leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ]

  const trafficData = [
    { day: 'Mon', visits: 120 },
    { day: 'Tue', visits: 200 },
    { day: 'Wed', visits: 150 },
    { day: 'Thu', visits: 280 },
    { day: 'Fri', visits: 190 },
    { day: 'Sat', visits: 90 },
    { day: 'Sun', visits: 60 },
  ]

  const maxVisits = Math.max(...trafficData.map((d) => d.visits))

  const systemHealth = [
    { label: 'Uptime', value: '99.9%', status: 'good' },
    { label: 'Response Time', value: '245ms', status: 'good' },
    { label: 'Error Rate', value: '0.02%', status: 'good' },
    { label: 'Server Load', value: '34%', status: 'good' },
    { label: 'Memory Usage', value: '62%', status: 'warning' },
    { label: 'Storage', value: '78%', status: 'warning' },
  ]

  const browserStats = [
    { label: 'Chrome', percentage: 58, color: '#4D7AFF' },
    { label: 'Firefox', percentage: 18, color: '#FF8C00' },
    { label: 'Safari', percentage: 14, color: '#8B5CF6' },
    { label: 'Edge', percentage: 7, color: '#10B981' },
    { label: 'Other', percentage: 3, color: '#6B7280' },
  ]

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#111]">Dashboard</h1>
        <p className="text-[#111]/60 text-sm mt-1">Overview of your digital agency</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Link to={stat.link} key={stat.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="doodle-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 flex items-center justify-center" style={{ backgroundColor: stat.color, border: '3px solid #111', boxShadow: '3px 3px 0 #111' }}>
                  <svg className="w-4 h-4 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-black text-[#111]">{stat.value}</p>
              <p className="text-[#111]/50 text-xs mt-1 font-medium">{stat.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="doodle-card p-6"
        >
          <h2 className="text-lg font-black text-[#111] mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-[#111]/40 text-sm">No recent activity</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 border-2 border-[#111] bg-white">
                  <div className="w-2.5 h-2.5 flex-shrink-0" style={{ backgroundColor: a.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#111] font-medium truncate">{a.message}</p>
                    <p className="text-xs text-[#111]/40">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="doodle-card p-6"
        >
          <h2 className="text-lg font-black text-[#111] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className="flex items-center gap-3 p-4 border-3 border-[#111] bg-white hover:bg-[#FFD400] transition-all duration-300 group"
              >
                <svg className="w-5 h-5 text-[#111] group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                </svg>
                <span className="text-sm text-[#111] font-bold">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="doodle-card p-6"
        >
          <h2 className="text-lg font-black text-[#111] mb-4">Traffic Overview</h2>
          <div className="flex items-end justify-between gap-2 h-[180px] pt-4">
            {trafficData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[#FFD400] border-2 border-[#111] transition-all duration-500 hover:opacity-80"
                  style={{ height: `${(d.visits / maxVisits) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-[10px] font-bold text-[#111]/60">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-[#111]/10">
            <span className="text-xs text-[#111]/40">Weekly traffic</span>
            <span className="text-xs font-bold text-[#111]">{trafficData.reduce((s, d) => s + d.visits, 0)} visits</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="doodle-card p-6"
        >
          <h2 className="text-lg font-black text-[#111] mb-4">Leads by Status</h2>
          {leadStatuses.length === 0 ? (
            <div className="flex items-center justify-center h-[180px] border-3 border-[#111]/20 bg-white">
              <p className="text-[#111]/40 text-sm">No lead data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leadStatuses.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-bold text-[#111]">{s.label}</span>
                    <span className="text-[#111]/60 text-xs">{s.count}</span>
                  </div>
                  <div className="w-full h-3 border-2 border-[#111] bg-white overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${(s.count / Math.max(...leadStatuses.map((x) => x.count))) * 100}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="doodle-card p-6"
        >
          <h2 className="text-lg font-black text-[#111] mb-4">System Health</h2>
          <div className="space-y-3">
            {systemHealth.map((s) => (
              <div key={s.label} className="flex items-center justify-between p-3 border-2 border-[#111] bg-white">
                <span className="text-sm font-bold text-[#111]">{s.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#111]/60">{s.value}</span>
                  <div className={`w-2.5 h-2.5 ${s.status === 'good' ? 'bg-[#10B981]' : 'bg-[#FFD400]'}`} style={{ border: '2px solid #111' }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="doodle-card p-6"
        >
          <h2 className="text-lg font-black text-[#111] mb-4">Content Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-bold text-[#111]">Published</span>
                <span className="text-[#111]/60 text-xs">{publishedCount}</span>
              </div>
              <div className="w-full h-4 border-2 border-[#111] bg-white overflow-hidden">
                <div className="h-full bg-[#10B981] transition-all duration-500" style={{ width: `${(publishedCount / Math.max(publishedCount + draftCount, 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-bold text-[#111]">Drafts</span>
                <span className="text-[#111]/60 text-xs">{draftCount}</span>
              </div>
              <div className="w-full h-4 border-2 border-[#111] bg-white overflow-hidden">
                <div className="h-full bg-[#FFD400] transition-all duration-500" style={{ width: `${(draftCount / Math.max(publishedCount + draftCount, 1)) * 100}%` }} />
              </div>
            </div>
            <div className="pt-2 text-center">
              <span className="text-xs text-[#111]/40">{publishedCount + draftCount} total pages</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="doodle-card p-6"
        >
          <h2 className="text-lg font-black text-[#111] mb-4">Browser / Device Stats</h2>
          <div className="space-y-3">
            {browserStats.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-bold text-[#111]">{b.label}</span>
                  <span className="text-[#111]/60 text-xs">{b.percentage}%</span>
                </div>
                <div className="w-full h-3 border-2 border-[#111] bg-white overflow-hidden">
                  <div className="h-full transition-all duration-500" style={{ width: `${b.percentage}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
