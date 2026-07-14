import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSession, logout, hasRole, updateSessionActivity, addAuditLog } from '@/services/auth'
import { seedAdminData } from '@/services/seedData'

const sidebarItems = [
  { label: 'Dashboard', path: '', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', group: 'main', roles: ['super_admin','admin','editor','marketing'] },
  { label: 'SEO', path: '/seo', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', group: 'main', roles: ['super_admin','admin','marketing'] },
  { label: 'Services', path: '/services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', group: 'content', roles: ['super_admin','admin','editor'] },
  { label: 'Blog', path: '/blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', group: 'content', roles: ['super_admin','admin','editor','marketing'] },
  { label: 'Portfolio', path: '/portfolio', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', group: 'content', roles: ['super_admin','admin','editor'] },
  { label: 'Testimonials', path: '/testimonials', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', group: 'content', roles: ['super_admin','admin','editor'] },
  { label: 'FAQs', path: '/faqs', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', group: 'content', roles: ['super_admin','admin','editor'] },
  { label: 'Pages', path: '/pages', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', group: 'content', roles: ['super_admin','admin'] },
  { label: 'Leads', path: '/leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', group: 'leads', roles: ['super_admin','admin','marketing'] },
  { label: 'Lead Discovery', path: '/lead-discovery', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', group: 'leads', roles: ['super_admin','admin','marketing'] },
  { label: 'Subscribers', path: '/subscribers', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', group: 'leads', roles: ['super_admin','admin','marketing'] },
  { label: 'Media', path: '/media', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', group: 'media', roles: ['super_admin','admin','editor'] },
  { label: 'Navigation', path: '/navigation', icon: 'M4 6h16M4 12h16M4 18h16', group: 'settings', roles: ['super_admin','admin'] },
  { label: 'Settings', path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', group: 'settings', roles: ['super_admin'] },
  { label: 'Security', path: '/security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', group: 'settings', roles: ['super_admin'] },
  { label: 'Users', path: '/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', group: 'settings', roles: ['super_admin'] },
  { label: 'Audit Logs', path: '/audit', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', group: 'settings', roles: ['super_admin','admin'] },
]

const groups = [
  { key: 'main', label: 'Main' },
  { key: 'content', label: 'Content' },
  { key: 'leads', label: 'Leads & CRM' },
  { key: 'media', label: 'Media' },
  { key: 'settings', label: 'Administration' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState(getSession())

  useEffect(() => {
    seedAdminData()

    const s = getSession()
    if (!s) {
      navigate('/admin/login', { replace: true })
      return
    }
    setSession(s)
  }, [navigate])

  useEffect(() => {
    const interval = setInterval(() => {
      const s = getSession()
      if (!s) {
        navigate('/admin/login', { replace: true })
        return
      }
      updateSessionActivity()
      setSession(s)
    }, 30000)
    return () => clearInterval(interval)
  }, [navigate])

  useEffect(() => {
    const handleActivity = () => updateSessionActivity()
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)
    return () => {
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const basePath = '/admin'
  const role = session?.role || ''

  return (
    <div className="min-h-screen bg-white flex">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-white border-r-3 border-[#111] overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="p-6 border-b-3 border-[#111]">
          <Link to="/admin" className="text-xl font-black text-[#111] tracking-tight">
            AB <span className="text-[#FFD400]">DIGITAL</span>
          </Link>
          <p className="text-[#111]/40 text-xs mt-1 font-medium">Admin Panel</p>
          {session && (
            <div className="flex items-center gap-2 mt-3">
              <div className="w-6 h-6 bg-[#FFD400] border-2 border-[#111] flex items-center justify-center text-[10px] font-black text-[#111] rounded-full">
                {session.name.charAt(0)}
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#111]">{session.name}</p>
                <p className="text-[#111]/40 text-[10px] capitalize">{session.role.replace('_', ' ')}</p>
              </div>
            </div>
          )}
        </div>
        <nav className="p-3 space-y-4">
          {groups.map(group => {
            const items = sidebarItems.filter(i => i.group === group.key && i.roles.includes(role as any))
            if (items.length === 0) return null
            return (
              <div key={group.key}>
                <p className="px-3 text-[10px] font-bold text-[#111]/30 uppercase tracking-[0.2em] mb-1">{group.label}</p>
                {items.map(item => (
                  <Link
                    key={item.path}
                    to={`${basePath}${item.path}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                      location.pathname === `${basePath}${item.path}`
                        ? 'bg-[#FFD400] text-[#111] border-l-4 border-[#111] -ml-px'
                        : 'text-[#111]/50 hover:text-[#111] hover:bg-[#FFD400]/10'
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                ))}
              </div>
            )
          })}
        </nav>
        <div className="sticky bottom-0 p-3 border-t-3 border-[#111] bg-white space-y-1">
          <Link to="/admin/change-password" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[#111]/50 hover:text-[#111] hover:bg-[#FFD400]/10 w-full transition-all duration-200">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Change Password
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[#FF4D4D] hover:bg-[#FF4D4D]/10 w-full transition-all duration-200">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[#111]/30 hover:text-[#FFD400] transition-all duration-200">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </Link>
        </div>
      </motion.aside>

      <div className="flex-1 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b-3 border-[#111]">
          <div className="flex items-center justify-between px-6 h-14">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1">
              <span className="w-5 h-[3px] bg-[#111] block" />
              <span className="w-5 h-[3px] bg-[#111] block" />
              <span className="w-5 h-[3px] bg-[#111] block" />
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <div className="w-8 h-8 bg-[#FFD400] border-2 border-[#111] flex items-center justify-center text-[#111] text-xs font-black rounded-full">
                {session?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
