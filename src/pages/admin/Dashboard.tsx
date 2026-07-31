import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiFileText, FiMessageSquare, FiMail, FiEye, FiTrendingUp, FiStar, FiBriefcase } from 'react-icons/fi'
import { getAll } from '@/services/cms'
import { getSession as getAuthSession } from '@/services/auth'
import type { BlogPost, Testimonial, FAQ, Page } from '@/services/cms'

export default function AdminDashboard() {
  const session = getAuthSession()
  const [stats, setStats] = useState({
    pages: 0, posts: 0, testimonials: 0, faqs: 0,
    enquiries: 0, subscribers: 0, media: 0, leads: 0,
  })

  useEffect(() => {
    setStats({
      pages: getAll('pages').length,
      posts: getAll('blog').length,
      testimonials: getAll('testimonials').length,
      faqs: getAll('faqs').length,
      enquiries: getAll('enquiries').length,
      subscribers: getAll('subscribers').length,
      media: getAll('media').length,
      leads: getAll('leads').length,
    })
  }, [])

  const cards = [
    { label: 'Pages', value: stats.pages, icon: FiFileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Blog Posts', value: stats.posts, icon: FiEye, color: 'from-purple-500 to-purple-600' },
    { label: 'Testimonials', value: stats.testimonials, icon: FiStar, color: 'from-yellow-500 to-yellow-600' },
    { label: 'FAQs', value: stats.faqs, icon: FiMessageSquare, color: 'from-green-500 to-green-600' },
    { label: 'Enquiries', value: stats.enquiries, icon: FiMessageSquare, color: 'from-pink-500 to-pink-600' },
    { label: 'Subscribers', value: stats.subscribers, icon: FiMail, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Media Files', value: stats.media, icon: FiBriefcase, color: 'from-teal-500 to-teal-600' },
    { label: 'Leads', value: stats.leads, icon: FiTrendingUp, color: 'from-red-500 to-red-600' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Welcome back, {session?.name || 'Admin'}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-gradient-to-br ${card.color} p-4 text-white shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <card.icon size={20} className="opacity-80" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs opacity-80 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Recent Activity</h3>
          <p className="text-sm text-[var(--text-tertiary)]">Your CMS is running. Manage your content from the sidebar.</p>
        </div>
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/pages" className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">New Page</a>
            <a href="/admin/blog" className="text-xs px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">New Blog Post</a>
            <a href="/admin/media" className="text-xs px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">Upload Media</a>
            <a href="/admin/theme" className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">Theme Settings</a>
          </div>
        </div>
      </div>
    </div>
  )
}
