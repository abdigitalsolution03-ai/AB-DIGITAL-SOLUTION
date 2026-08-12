import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiFileText, FiLayout, FiMenu, FiX, FiChevronDown, FiChevronRight,
  FiLogOut, FiGlobe, FiShield, FiUser, FiImage,
} from 'react-icons/fi'
import { getSession, logout, setupIdleLogout } from '@/services/auth'
import ThemeToggle from '@/components/ThemeToggle'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: <FiHome size={16} /> },
  { label: 'Pages', path: '/admin/pages', icon: <FiFileText size={16} /> },
  { label: 'Content Manager', path: '/admin/content', icon: <FiLayout size={16} /> },
  { label: 'Media Library', path: '/admin/media', icon: <FiImage size={16} /> },
  { label: 'Profile', path: '/admin/profile', icon: <FiUser size={16} /> },
  { label: 'Security', path: '/admin/security', icon: <FiShield size={16} /> },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState(getSession())

  useEffect(() => {
    const s = getSession()
    if (!s) { navigate('/admin/login', { replace: true }); return }
    setSession(s)
  }, [navigate])

  useEffect(() => {
    const cleanup = setupIdleLogout(() => {
      navigate('/admin/login', { replace: true })
    })
    return cleanup
  }, [navigate])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 border-b border-[var(--border-primary)]">
          <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              AB
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--text-primary)]">CMS Admin</h1>
              <p className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider">Content Management</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                isActive(item.path)
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <span className={isActive(item.path) ? 'text-blue-500' : ''}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--border-primary)] space-y-1">
          <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">
            <FiGlobe size={16} /> View Site
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)]">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]">
                {isSidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
              <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">
                {navItems.find(i => isActive(i.path))?.label || 'Dashboard'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="flex items-center gap-2 pl-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-[10px]">
                  {session?.name?.charAt(0) || 'A'}
                </div>
                <span className="text-sm text-[var(--text-primary)] hidden md:block">{session?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
