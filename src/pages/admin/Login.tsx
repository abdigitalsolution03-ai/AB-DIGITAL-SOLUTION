import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getSession,
  login,
  verify2FA,
  checkFirstLogin,
  needsCaptcha,
  generateCaptcha,
  getLoginAttempts,
  initializeSystem,
} from '@/services/auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 })
  const [captchaInput, setCaptchaInput] = useState('')

  const [show2FA, setShow2FA] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const emailRef = useRef<HTMLInputElement>(null)
  const codeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    initializeSystem()

    const session = getSession()
    if (session) {
      navigate('/admin', { replace: true })
      return
    }

    const pending2FA = localStorage.getItem('ab_2fa_pending')
    if (pending2FA) {
      setShow2FA(true)
      setTimeout(() => codeInputRef.current?.focus(), 200)
    }
  }, [navigate])

  const refreshCaptcha = () => {
    const c = generateCaptcha()
    setCaptcha(c)
    setCaptchaInput('')
  }

  const handleEmailBlur = () => {
    if (email) {
      const count = getLoginAttempts(email)
      setAttempts(count)
      if (needsCaptcha(email)) {
        setShowCaptcha(true)
        refreshCaptcha()
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (showCaptcha && parseInt(captchaInput) !== captcha.answer) {
      setError('Incorrect CAPTCHA answer')
      refreshCaptcha()
      return
    }

    setLoading(true)

    try {
      const result = await login(email, password, rememberMe)

      if (!result.success) {
        setError(result.error || 'Login failed')

        if (email && needsCaptcha(email)) {
          setShowCaptcha(true)
          refreshCaptcha()
        } else if (email && getLoginAttempts(email) >= 2) {
          setShowCaptcha(true)
          refreshCaptcha()
        }

        setLoading(false)
        return
      }

      if (result.requires2FA) {
        setShow2FA(true)
        setLoading(false)
        setTimeout(() => codeInputRef.current?.focus(), 200)
        return
      }

      if (checkFirstLogin()) {
        navigate('/admin/change-password', { replace: true })
        return
      }

      navigate(returnUrl, { replace: true })
    } catch {
      setError('An unexpected error occurred')
    }

    setLoading(false)
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const valid = await verify2FA(twoFactorCode)
      if (!valid) {
        setError('Invalid verification code')
        setLoading(false)
        return
      }

      if (checkFirstLogin()) {
        navigate('/admin/change-password', { replace: true })
        return
      }

      navigate(returnUrl, { replace: true })
    } catch {
      setError('Verification failed')
    }

    setLoading(false)
  }

  const handleBackToLogin = () => {
    setShow2FA(false)
    setTwoFactorCode('')
    setError('')
  }

  if (show2FA) {
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-[#111] tracking-tight">
                Two-Factor Auth
              </h1>
              <p className="text-[#111]/40 text-sm mt-1">Enter the verification code</p>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#111]/60 mb-2">Verification Code</label>
                <input
                  ref={codeInputRef}
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-center text-2xl font-black tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoComplete="one-time-code"
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

              <button
                type="submit"
                disabled={loading || twoFactorCode.length < 6}
                className="doodle-btn-accent w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#111]"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-center text-sm text-[#111]/40 hover:text-[#111] font-bold transition-colors"
              >
                ← Back to Login
              </button>
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
            <h1 className="text-2xl font-black text-[#111] tracking-tight">
              AB <span className="text-[#60A5FA]">DIGITAL</span>
            </h1>
            <p className="text-[#111]/40 text-sm mt-1">Admin Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#111]/60 mb-2">Email</label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none"
                placeholder="admin@abdigitalsolution.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111]/60 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 border-3 border-[#111] flex items-center justify-center transition-all cursor-pointer ${
                    rememberMe ? 'bg-[#60A5FA]' : 'bg-white'
                  }`}
                >
                  {rememberMe && (
                    <svg className="w-3 h-3 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-bold text-[#111]/60 group-hover:text-[#111] transition-colors cursor-pointer">
                  Remember Me
                </span>
              </label>

              <Link
                to="/admin/forgot-password"
                className="text-sm font-bold text-[#111]/40 hover:text-[#111] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <AnimatePresence>
              {showCaptcha && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white border-3 border-[#111] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-[#111]">
                        What is <span className="text-[#60A5FA] text-lg">{captcha.question}</span>?
                      </p>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="p-1.5 border-2 border-[#111] hover:bg-[#60A5FA] transition-colors"
                        title="New question"
                      >
                        <svg className="w-4 h-4 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="number"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-center text-lg font-bold"
                      placeholder="Answer"
                      required
                      autoComplete="off"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

            <button
              type="submit"
              disabled={loading}
              className="doodle-btn-accent w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#111]"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[#111]/30 text-xs mt-6">
            Demo: admin@abdigitalsolution.com / Admin@123456
          </p>
        </div>
      </motion.div>
    </div>
  )
}

