import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FiLogOut, FiHome, FiUser } from 'react-icons/fi'
import { getSession, logout } from '@/services/auth'
import ThemeToggle from '@/components/ThemeToggle'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [session, setSession] = useState(getSession())

  useEffect(() => {
    const s = getSession()
    if (!s) { navigate('/admin/login', { replace: true }); return }
    setSession(s)
  }, [navigate])

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <header className="sticky top-0 z-30 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)]">
        <div className="flex items-center justify-between px-4 lg:px-6 h-14">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                AB
              </div>
              <span className="text-sm font-bold text-[var(--text-primary)]">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded hover:bg-[var(--bg-tertiary)]">
              View Site
            </Link>
            <ThemeToggle />
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition-colors">
              <FiLogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1 flex">
        <aside className="w-56 border-r border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 hidden md:block">
          <nav className="space-y-1">
            <NavLink to="/admin" icon={<FiHome size={16} />} label="Dashboard" active={location.pathname === '/admin'} />
          </nav>
        </aside>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NavLink({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        active ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium' : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
