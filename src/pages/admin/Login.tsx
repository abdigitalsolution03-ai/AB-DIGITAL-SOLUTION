import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { login, getSession, initializeUsers } from '@/services/auth'
import { useTheme } from '@/context/ThemeContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeUsers()
    if (getSession()) navigate('/admin', { replace: true })
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = login(email, password)
      if (!result.success) {
        setError(result.error || 'Login failed')
        setLoading(false)
        return
      }
      navigate('/admin', { replace: true })
    } catch {
      setError('An unexpected error occurred')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-[var(--royal-800)] via-[var(--royal-700)] to-[var(--royal-900)] items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-royal-300 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">AB</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">AB Digital Solution</h1>
          <p className="text-lg text-white/60 max-w-md mx-auto">
            Enterprise CRM & HRMS Platform — Manage your entire business from one powerful dashboard.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-white/40 text-sm">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> CRM</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold-400" /> HRMS</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-royal-400" /> Projects</span>
          </div>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8 lg:hidden">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              AB
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">Sign in to your enterprise account</p>
          </div>

          <div className="hidden lg:block text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-1">Sign in to your enterprise account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@abdigital.com"
              icon={<FiMail size={16} />}
              required
              autoComplete="email"
            />

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                  <FiLock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                    rememberMe
                      ? 'bg-[var(--royal-500)] border-[var(--royal-500)]'
                      : 'border-[var(--border-secondary)] bg-transparent'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors cursor-pointer select-none">
                  Remember me
                </span>
              </label>
              <Link
                to="/admin/forgot-password"
                className="text-xs font-semibold text-[var(--royal-500)] hover:text-[var(--royal-600)] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 font-medium text-center bg-red-50 dark:bg-red-500/10 px-4 py-2.5 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
            <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-[var(--text-secondary)]">
              <p><span className="font-medium">Admin:</span> admin@abdigital.com / Admin@123</p>
              <p><span className="font-medium">HR:</span> hr@abdigital.com / Hr@123</p>
              <p><span className="font-medium">Employee:</span> employee@abdigital.com / Employee@123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
