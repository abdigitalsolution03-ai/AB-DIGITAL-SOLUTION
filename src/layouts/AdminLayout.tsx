import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiUsers, FiCalendar, FiCheckSquare, FiFolder, FiBriefcase,
  FiDollarSign, FiBarChart2, FiFileText, FiMessageSquare, FiSettings,
  FiLogOut, FiBell, FiSearch, FiMenu, FiX, FiChevronDown, FiChevronRight,
  FiUserCheck, FiClock, FiHeart, FiTrendingUp, FiCreditCard, FiGrid,
  FiBookOpen, FiActivity, FiShield, FiMonitor, FiLayers, FiMapPin,
  FiPieChart, FiSend, FiMail, FiStar, FiPaperclip, FiAward, FiGlobe,
  FiCpu, FiDatabase, FiRefreshCw, FiUser,
} from 'react-icons/fi'
import { getSession, logout, getCurrentUser } from '@/services/auth'
import { seedAllData } from '@/services/seedData'
import { useTheme } from '@/context/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import GlobalSearch from '@/components/GlobalSearch'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Dropdown from '@/components/ui/Dropdown'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  roles?: string[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'DASHBOARD',
    items: [
      { label: 'Dashboard', path: '/admin', icon: <FiHome size={18} /> },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Leads', path: '/admin/crm/leads', icon: <FiStar size={18} /> },
      { label: 'Contacts', path: '/admin/crm/contacts', icon: <FiUsers size={18} /> },
      { label: 'Companies', path: '/admin/crm/companies', icon: <FiBriefcase size={18} /> },
      { label: 'Deals', path: '/admin/crm/deals', icon: <FiTrendingUp size={18} /> },
      { label: 'Pipeline', path: '/admin/crm/pipeline', icon: <FiMapPin size={18} /> },
    ],
  },
  {
    label: 'EMPLOYEES',
    items: [
      { label: 'Directory', path: '/admin/employees', icon: <FiUsers size={18} /> },
      { label: 'Departments', path: '/admin/employees/departments', icon: <FiGrid size={18} /> },
      { label: 'Designations', path: '/admin/employees/designations', icon: <FiAward size={18} /> },
    ],
  },
  {
    label: 'ATTENDANCE',
    items: [
      { label: 'Dashboard', path: '/admin/attendance', icon: <FiClock size={18} /> },
      { label: 'Calendar', path: '/admin/attendance/calendar', icon: <FiCalendar size={18} /> },
      { label: 'Reports', path: '/admin/attendance/reports', icon: <FiBarChart2 size={18} /> },
    ],
  },
  {
    label: 'HRMS',
    items: [
      { label: 'Leave', path: '/admin/hrms/leave', icon: <FiSend size={18} /> },
      { label: 'Holidays', path: '/admin/hrms/holidays', icon: <FiHeart size={18} /> },
      { label: 'Policies', path: '/admin/hrms/policies', icon: <FiFileText size={18} /> },
      { label: 'Performance', path: '/admin/hrms/performance', icon: <FiActivity size={18} /> },
      { label: 'Payroll', path: '/admin/hrms/payroll', icon: <FiDollarSign size={18} /> },
    ],
  },
  {
    label: 'PROJECTS',
    items: [
      { label: 'All Projects', path: '/admin/projects', icon: <FiFolder size={18} /> },
      { label: 'Kanban Board', path: '/admin/projects/kanban', icon: <FiLayers size={18} /> },
    ],
  },
  {
    label: 'TASKS',
    items: [
      { label: 'All Tasks', path: '/admin/tasks', icon: <FiCheckSquare size={18} /> },
      { label: 'My Tasks', path: '/admin/tasks/my', icon: <FiUserCheck size={18} /> },
    ],
  },
  {
    label: 'CLIENTS',
    items: [
      { label: 'Client Portal', path: '/admin/clients', icon: <FiGlobe size={18} /> },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { label: 'Invoices', path: '/admin/invoices', icon: <FiFileText size={18} /> },
      { label: 'Payments', path: '/admin/payments', icon: <FiCreditCard size={18} /> },
    ],
  },
  {
    label: 'REPORTS',
    items: [
      { label: 'Reports', path: '/admin/reports', icon: <FiPieChart size={18} /> },
      { label: 'Analytics', path: '/admin/analytics', icon: <FiTrendingUp size={18} /> },
    ],
  },
  {
    label: 'DOCUMENTS',
    items: [
      { label: 'Documents', path: '/admin/documents', icon: <FiPaperclip size={18} /> },
    ],
  },
  {
    label: 'SUPPORT',
    items: [
      { label: 'Tickets', path: '/admin/tickets', icon: <FiMessageSquare size={18} /> },
      { label: 'Knowledge Base', path: '/admin/knowledge', icon: <FiBookOpen size={18} /> },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { label: 'Chat', path: '/admin/chat', icon: <FiMessageSquare size={18} /> },
      { label: 'Announcements', path: '/admin/announcements', icon: <FiMail size={18} /> },
      { label: 'Notifications', path: '/admin/notifications', icon: <FiBell size={18} /> },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { label: 'Settings', path: '/admin/settings', icon: <FiSettings size={18} /> },
      { label: 'Security', path: '/admin/security', icon: <FiShield size={18} /> },
      { label: 'Audit Logs', path: '/admin/audit', icon: <FiMonitor size={18} /> },
    ],
  },
]

function getBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const parts = pathname.split('/').filter(Boolean)
  const crumbs: { label: string; path: string }[] = []
  let current = ''
  for (const part of parts) {
    current += `/${part}`
    const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
    crumbs.push({ label, path: current })
  }
  return crumbs
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})
  const [session, setSession] = useState(getSession())
  const [unreadCount, setUnreadCount] = useState(0)
  const [showGlobalSearch, setShowGlobalSearch] = useState(false)
  const user = getCurrentUser()

  useEffect(() => {
    seedAllData()
    const s = getSession()
    if (!s) { navigate('/admin/login', { replace: true }); return }
    setSession(s)
  }, [navigate])

  useEffect(() => {
    try {
      const notifs = JSON.parse(localStorage.getItem('ab_notifications') || '[]')
      setUnreadCount(notifs.filter((n: any) => !n.read).length)
    } catch {}
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowGlobalSearch(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/admin/login', { replace: true })
  }, [navigate])

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const breadcrumbs = getBreadcrumbs(location.pathname)
  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <GlobalSearch />
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
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-5 border-b border-[var(--border-primary)]">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--royal-500)] to-[var(--royal-700)] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-royal-500/20">
              AB
            </div>
            <div>
              <h1 className="text-base font-bold text-[var(--text-primary)] tracking-tight">
                AB <span className="text-[var(--royal-500)]">DIGITAL</span>
              </h1>
              <p className="text-[10px] font-medium text-[var(--text-tertiary)] tracking-wider uppercase">Enterprise CRM & HRMS</p>
            </div>
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-[var(--border-primary)]">
          <Link to="/admin/settings" className="flex items-center gap-3 group">
            <Avatar name={user?.name || 'User'} size="sm" status="online" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--royal-500)] transition-colors">
                {user?.name || 'User'}
              </p>
              <Badge variant="info" size="sm">
                {user?.role?.replace('_', ' ') || 'N/A'}
              </Badge>
            </div>
          </Link>
        </div>

        <div className="px-4 py-3 border-b border-[var(--border-primary)]">
          <button
            onClick={() => setShowGlobalSearch(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <FiSearch size={16} />
            <span>Search...</span>
            <span className="ml-auto text-[10px] font-medium bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--border-primary)]">
              Ctrl+K
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-3">
          {navGroups.map(group => {
            const isCollapsed = collapsedGroups[group.label]
            return (
              <div key={group.label} className="mb-1">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.15em] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {group.label}
                  {isCollapsed ? <FiChevronRight size={12} /> : <FiChevronDown size={12} />}
                </button>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {group.items.map(item => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`sidebar-link text-sm ${
                            isActive(item.path)
                              ? 'active'
                              : ''
                          }`}
                        >
                          <span className={`${isActive(item.path) ? 'text-[var(--royal-500)]' : 'text-[var(--text-tertiary)]'}`}>
                            {item.icon}
                          </span>
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
          <Link
            to="/"
            className="sidebar-link text-sm text-[var(--text-tertiary)]"
          >
            <FiGlobe size={18} />
            Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)]">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
              >
                {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <nav className="hidden md:flex items-center gap-1.5 text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <span key={crumb.path} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-[var(--text-tertiary)]">/</span>}
                    <Link
                      to={crumb.path}
                      className={`font-medium transition-colors ${
                        i === breadcrumbs.length - 1
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                      }`}
                    >
                      {crumb.label}
                    </Link>
                  </span>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowGlobalSearch(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <FiSearch size={15} />
                <span className="hidden lg:inline">Search...</span>
                <span className="text-[10px] font-medium bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--border-primary)]">Ctrl+K</span>
              </button>

              <ThemeToggle />

              <Dropdown
                trigger={
                  <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]">
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[var(--bg-secondary)]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                }
                items={[
                  { label: 'View All Notifications', icon: <FiBell size={16} />, onClick: () => navigate('/admin/notifications') },
                ]}
              />

              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors">
                    <Avatar name={user?.name || 'User'} size="xs" />
                    <span className="hidden md:inline text-sm font-medium text-[var(--text-primary)] max-w-[100px] truncate">
                      {user?.name || 'User'}
                    </span>
                  </button>
                }
                items={[
                  { label: 'My Profile', icon: <FiUser size={16} />, onClick: () => navigate('/admin/settings') },
                  { label: 'Settings', icon: <FiSettings size={16} />, onClick: () => navigate('/admin/settings') },
                  { label: 'Security', icon: <FiShield size={16} />, onClick: () => navigate('/admin/security') },
                  { divider: true, label: '', onClick: () => {} },
                  { label: 'Logout', icon: <FiLogOut size={16} />, onClick: handleLogout, danger: true },
                ]}
              />
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
