import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { forgotPassword, resetPassword } from '@/services/auth'

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showReset, setShowReset] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const resetData = localStorage.getItem('ab_reset_token')
    if (resetData) {
      try {
        const parsed = JSON.parse(resetData)
        if (parsed.token && Date.now() < parsed.expires) {
          setResetToken(parsed.token)
          setShowReset(true)
        }
      } catch {}
    }
  }, [])

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await forgotPassword(email)
      setSuccess(
        'If an account with that email exists, a password reset link has been sent. Check your email.'
      )
      setEmail('')
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const result = await resetPassword(resetToken, newPassword)
      if (!result.success) {
        setError(result.error || 'Reset failed')
        setLoading(false)
        return
      }

      setSuccess('Password has been reset successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/admin/login')
      }, 2000)
    } catch {
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  if (showReset) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          <div className="doodle-card p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center shadow-[3px_3px_0_#111]">
                <svg className="w-7 h-7 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-[#111] tracking-tight">
                Reset Password
              </h1>
              <p className="text-[#111]/40 text-sm mt-1">Enter your new password</p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#111]/60 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111]/60 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none"
                  placeholder="Re-enter new password"
                  required
                  autoComplete="new-password"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[#FF4D4D] text-sm text-center font-bold"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[#10B981] text-sm text-center font-bold"
                  >
                    {success}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="doodle-btn-accent w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#111]"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <Link
                to="/admin/login"
                className="block w-full text-center text-sm text-[#111]/40 hover:text-[#111] font-bold transition-colors"
              >
                ← Back to Login
              </Link>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="doodle-card p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center shadow-[3px_3px_0_#111]">
              <svg className="w-7 h-7 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-[#111] tracking-tight">
              Forgot Password
            </h1>
            <p className="text-[#111]/40 text-sm mt-1">Enter your email to reset</p>
          </div>

          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#111]/60 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none"
                placeholder="admin@abdigitalsolution.com"
                required
                autoComplete="email"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-[#FF4D4D] text-sm text-center font-bold"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-[#10B981] text-sm text-center font-bold"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="doodle-btn-accent w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#111]"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <Link
              to="/admin/login"
              className="block w-full text-center text-sm text-[#111]/40 hover:text-[#111] font-bold transition-colors"
            >
              ← Back to Login
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

