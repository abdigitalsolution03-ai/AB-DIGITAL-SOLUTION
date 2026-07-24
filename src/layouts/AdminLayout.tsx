import { Outlet, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiFileText, FiMenu, FiX, FiChevronDown, FiChevronRight,
  FiLogOut, FiImage, FiEdit3, FiSearch, FiSliders, FiSettings,
  FiStar, FiHelpCircle, FiLayout, FiMail, FiUsers, FiShield,
  FiGlobe, FiTrendingUp, FiBriefcase, FiMessageSquare, FiPenTool,
} from 'react-icons/fi'
import { getSession, logout, isAuthenticated } from '@/services/auth'
import { initCMS } from '@/services/cms'
import { useTheme } from '@/context/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/admin', icon: <FiHome size={16} /> },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Pages', path: '/admin/pages', icon: <FiFileText size={16} /> },
      { label: 'Blog', path: '/admin/blog', icon: <FiEdit3 size={16} /> },
      { label: 'Services', path: '/admin/services', icon: <FiBriefcase size={16} /> },
      { label: 'Media', path: '/admin/media', icon: <FiImage size={16} /> },
      { label: 'Testimonials', path: '/admin/testimonials', icon: <FiStar size={16} /> },
      { label: 'FAQ', path: '/admin/faq', icon: <FiHelpCircle size={16} /> },
    ],
  },
  {
    label: 'Design',
    items: [
      { label: 'Hero', path: '/admin/hero', icon: <FiLayout size={16} /> },
      { label: 'Header', path: '/admin/header', icon: <FiMenu size={16} /> },
      { label: 'Footer', path: '/admin/footer', icon: <FiLayout size={16} /> },
      { label: 'Theme', path: '/admin/theme', icon: <FiSliders size={16} /> },
      { label: 'Branding', path: '/admin/branding', icon: <FiPenTool size={16} /> },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'SEO', path: '/admin/seo', icon: <FiTrendingUp size={16} /> },
      { label: 'Subscribers', path: '/admin/subscribers', icon: <FiMail size={16} /> },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Team', path: '/admin/team', icon: <FiUsers size={16} /> },
      { label: 'Enquiries', path: '/admin/enquiries', icon: <FiMessageSquare size={16} /> },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', path: '/admin/settings', icon: <FiSettings size={16} /> },
    ],
  },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [session, setSession] = useState(getSession())
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    initCMS()
    if (!getSession()) { navigate('/admin/login', { replace: true }); return }
    setSession(getSession())
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }))
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

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
          {navGroups.map(group => {
            const isCollapsed = collapsedGroups[group.label]
            return (
              <div key={group.label} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest hover:text-[var(--text-secondary)] transition-colors"
                >
                  {group.label}
                  {isCollapsed ? <FiChevronRight size={10} /> : <FiChevronDown size={10} />}
                </button>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      {group.items.map(item => (
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
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
                {navGroups.flatMap(g => g.items).find(i => isActive(i.path))?.label || 'Dashboard'}
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
