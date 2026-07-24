import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser } from 'react-icons/fi'
import { getSession } from '@/services/auth'

export default function AdminDashboard() {
  const [session, setSession] = useState(getSession())

  useEffect(() => {
    setSession(getSession())
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Welcome back, {session?.name || 'User'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Welcome', value: 'Admin Panel', desc: 'Your site management dashboard', color: 'from-blue-500 to-blue-600' },
          { label: 'Status', value: 'Active', desc: 'System is running normally', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Account', value: session?.role?.replace('_', ' ') || 'Admin', desc: session?.email || '', color: 'from-purple-500 to-purple-600' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl bg-gradient-to-br ${card.color} p-5 text-white shadow-lg`}
          >
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
            <p className="text-xs opacity-70 mt-1">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <FiUser size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{session?.name || 'User'}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{session?.email || ''}</p>
          </div>
        </div>
        <p className="text-sm text-[var(--text-tertiary)]">
          You are logged in as <strong className="text-[var(--text-primary)]">{session?.role?.replace('_', ' ') || 'Admin'}</strong>.
          Use the sidebar to navigate through the admin panel.
        </p>
      </div>
    </div>
  )
}
