import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiShield, FiArrowLeft } from 'react-icons/fi'
import { login, verify2FA, getSession, getBootstrapStatus, bootstrapAdmin, clearSession } from '@/services/auth'
import Button from '@/components/ui/Button'

type Step = 'login' | '2fa' | 'bootstrap'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('login')
  const [needsBootstrap, setNeedsBootstrap] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pendingToken, setPendingToken] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    clearSession()
    getBootstrapStatus()
      .then((status) => {
        if (status.needsBootstrap) setStep('bootstrap')
      })
      .catch(() => {
        // API unreachable — show login; it will surface errors on submit
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(email, password)
      if (result.requires2FA && result.pendingToken) {
        setPendingToken(result.pendingToken)
        setStep('2fa')
        return
      }
      if (!result.success) {
        setError(result.error || 'Login failed')
        return
      }
      navigate('/admin', { replace: true })
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await verify2FA(pendingToken, code)
      if (!result.success) {
        setError(result.error || 'Verification failed')
        return
      }
      navigate('/admin', { replace: true })
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await bootstrapAdmin({ name, email, password })
      setStep('login')
      setPassword('')
      setConfirmPassword('')
      setError('')
    } catch (err: any) {
      setError(err?.message || 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20">
            AB
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {step === 'bootstrap' ? 'Create Admin Account' : step === '2fa' ? 'Two-Factor Authentication' : 'Admin Login'}
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            {step === 'bootstrap'
              ? 'Set up the first administrator for your website'
              : step === '2fa'
                ? 'Enter the 6-digit code from your authenticator app'
                : 'Sign in to manage your website'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                    <FiMail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                    <FiLock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="Enter your password"
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
            </motion.form>
          )}

          {step === '2fa' && (
            <motion.form
              key="2fa"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerify2FA}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Verification Code</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                    <FiShield size={16} />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-blue-500 transition-colors text-sm tracking-widest text-center text-lg"
                    placeholder="••••••"
                    required
                    autoComplete="one-time-code"
                  />
                </div>
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
                Verify & Sign In
              </Button>

              <button
                type="button"
                onClick={() => { setStep('login'); setCode(''); setPendingToken(''); setError('') }}
                className="w-full flex items-center justify-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <FiArrowLeft size={14} /> Back to login
              </button>
            </motion.form>
          )}

          {step === 'bootstrap' && (
            <motion.form
              key="bootstrap"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleBootstrap}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                    <FiUser size={16} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                    <FiMail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                    <FiLock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="Minimum 8 characters"
                    required
                    autoComplete="new-password"
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

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                    <FiLock size={16} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:border-blue-500 transition-colors text-sm"
                    placeholder="Repeat your password"
                    required
                    autoComplete="new-password"
                  />
                </div>
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
                Create Admin Account
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
