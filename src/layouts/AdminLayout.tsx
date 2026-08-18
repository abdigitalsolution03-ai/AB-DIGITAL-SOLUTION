import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiFileText, FiLayout, FiMenu, FiX, FiChevronDown,
  FiLogOut, FiGlobe, FiShield, FiUser, FiImage, FiPenTool, FiMail,
  FiUsers, FiStar, FiHelpCircle, FiSettings, FiSearch, FiInbox, FiSend,
  FiMonitor, FiTool, FiMegaphone, FiList, FiTrendingUp,
} from 'react-icons/fi'
import { getSession, logout, setupIdleLogout } from '@/services/auth'
import { getAll } from '@/services/cms'
import ThemeToggle from '@/components/ThemeToggle'

const navSections = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/admin', icon: <FiHome size={15} /> },
      { label: 'Analytics', path: '/admin/analytics', icon: <FiTrendingUp size={15} /> },
    ],
  },
  {
    label: 'Design',
    items: [
      { label: 'Pages & Builder', path: '/admin/pages', icon: <FiLayout size={15} /> },
      { label: 'Theme Editor', path: '/admin/theme', icon: <FiPenTool size={15} /> },
      { label: 'Header', path: '/admin/header', icon: <FiTool size={15} /> },
      { label: 'Hero Section', path: '/admin/hero', icon: <FiMonitor size={15} /> },
      { label: 'Footer', path: '/admin/footer', icon: <FiTool size={15} /> },
      { label: 'Branding', path: '/admin/branding', icon: <FiPenTool size={15} /> },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Content Manager', path: '/admin/content', icon: <FiFileText size={15} /> },
      { label: 'Blog Posts', path: '/admin/blog', icon: <FiPenTool size={15} /> },
      { label: 'Services', path: '/admin/services', icon: <FiList size={15} /> },
      { label: 'Team', path: '/admin/team', icon: <FiUsers size={15} /> },
      { label: 'Testimonials', path: '/admin/testimonials', icon: <FiStar size={15} /> },
      { label: 'FAQ', path: '/admin/faq', icon: <FiHelpCircle size={15} /> },
    ],
  },
  {
    label: 'Audience',
    items: [
      { label: 'Leads Inbox', path: '/admin/enquiries', icon: <FiInbox size={15} /> },
      { label: 'Subscribers', path: '/admin/subscribers', icon: <FiSend size={15} /> },
    ],
  },
  {
    label: 'Media & Settings',
    items: [
      { label: 'Media Library', path: '/admin/media', icon: <FiImage size={15} /> },
      { label: 'SEO', path: '/admin/seo', icon: <FiSearch size={15} /> },
      { label: 'Settings', path: '/admin/settings', icon: <FiSettings size={15} /> },
      { label: 'Profile', path: '/admin/profile', icon: <FiUser size={15} /> },
      { label: 'Security', path: '/admin/security', icon: <FiShield size={15} /> },
    ],
  },
]

function getUnreadCount(): number {
  try {
    const items = getAll('enquiries')
    return items.filter((i: any) => !i.read).length
  } catch { return 0 }
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [session, setSession] = useState(getSession())
  const [unread, setUnread] = useState(getUnreadCount())
  const [search, setSearch] = useState('')

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

  useEffect(() => {
    const refresh = () => setUnread(getUnreadCount())
    refresh()
    window.addEventListener('cms:updated', refresh)
    return () => window.removeEventListener('cms:updated', refresh)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const filteredSections = search.trim()
    ? navSections.map(section => ({
        ...section,
        items: section.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
      })).filter(s => s.items.length > 0)
    : navSections

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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[270px] bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 border-b border-[var(--border-primary)]">
          <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              AB
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--text-primary)]">AB Digital CMS</h1>
              <p className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider">Admin Panel</p>
            </div>
          </Link>
          <div className="mt-3 relative">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search admin…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none focus:border-blue-500 placeholder:text-[var(--text-tertiary)]"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {filteredSections.map(section => {
            const sectionCollapsed = collapsed[section.label]
            return (
              <div key={section.label}>
                <button
                  onClick={() => setCollapsed(prev => ({ ...prev, [section.label]: !prev[section.label] }))}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {section.label}
                  <FiChevronDown size={12} className={`transition-transform duration-200 ${sectionCollapsed ? '-rotate-90' : ''}`} />
                </button>
                {!sectionCollapsed && (
                  <div className="mt-0.5 space-y-0.5">
                    {section.items.map(item => {
                      const active = isActive(item.path)
                      const showBadge = item.path === '/admin/enquiries' && unread > 0
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                            active
                              ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                          }`}
                        >
                          <span className={active ? 'text-blue-500' : ''}>{item.icon}</span>
                          <span className="flex-1">{item.label}</span>
                          {showBadge && (
                            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                              {unread}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
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
                {navSections.flatMap(s => s.items).find(i => isActive(i.path))?.label || 'Dashboard'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/enquiries"
                className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
                aria-label="Leads"
              >
                <FiMail size={17} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </Link>
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