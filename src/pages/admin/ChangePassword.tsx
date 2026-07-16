import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { checkFirstLogin, changePassword, getSession } from '@/services/auth'

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
  if (password.length >= 16) score++

  if (score <= 1) return { score: 0, label: 'Weak', color: '#FF4D4D' }
  if (score <= 3) return { score: 1, label: 'Medium', color: '#60A5FA' }
  return { score: 2, label: 'Strong', color: '#22C55E' }
}

export default function AdminChangePassword() {
  const navigate = useNavigate()
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      navigate('/admin/login')
      return
    }
    setIsFirstLogin(checkFirstLogin())
  }, [navigate])

  const passwordStrength = getPasswordStrength(newPassword)
  const passwordsMatch = newPassword === confirmPassword
  const canSubmit = currentPassword && newPassword && confirmPassword && passwordsMatch && newPassword.length >= 8 && !loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    setLoading(true)
    const result = await changePassword(currentPassword, newPassword)
    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => navigate('/admin'), 1500)
    } else {
      setError(result.error || 'Failed to change password.')
    }
  }

  const inputClass = "w-full pl-10 pr-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm"

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="doodle-card p-10 text-center">
              <div className="w-16 h-16 bg-green-400 border-3 border-[#111] flex items-center justify-center mx-auto mb-5 shadow-[4px_4px_0_#111]">
                <svg className="w-8 h-8 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-[#111] mb-2">Password Changed</h2>
              <p className="text-[#111]/60 text-sm">Redirecting to dashboard...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md"
          >
            <div className="doodle-card p-8 md:p-10">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-14 h-14 bg-[#60A5FA] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_#111]"
                >
                  <svg className="w-7 h-7 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                <h1 className="text-2xl font-black text-[#111] tracking-tight">
                  {isFirstLogin ? 'Set Your Password' : 'Change Password'}
                </h1>
                <p className="text-[#111]/40 text-sm mt-1">
                  {isFirstLogin
                    ? 'This is your first login. Please set a new password to continue.'
                    : 'Update your account password.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Current Password</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={inputClass}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">New Password</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClass}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  {newPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <div className="flex gap-1 mb-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="h-2 flex-1 border-2 border-[#111] transition-all duration-300"
                            style={{
                              backgroundColor: i <= passwordStrength.score ? passwordStrength.color : 'transparent',
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                        <span className="text-[10px] text-[#111]/40">
                          {newPassword.length} / {newPassword.length >= 8 ? '8+' : '8 min'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  {confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs font-bold mt-1 ${passwordsMatch ? 'text-green-600' : 'text-[#FF4D4D]'}`}
                    >
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </motion.p>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#FF4D4D]/10 border-3 border-[#FF4D4D]/50 p-3"
                  >
                    <p className="text-[#FF4D4D] text-sm font-bold text-center">{error}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`doodle-btn-accent w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#111]`}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Changing...
                    </>
                  ) : (
                    isFirstLogin ? 'Set Password & Continue' : 'Change Password'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

