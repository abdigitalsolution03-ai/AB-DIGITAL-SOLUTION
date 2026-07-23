import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { login } from '@/services/auth'

export default function PortalLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = login(email, password)
      if (!result.success) {
        setError(result.error || 'Invalid credentials')
        setLoading(false)
        return
      }
      navigate('/portal/dashboard', { replace: true })
    } catch {
      setError('An unexpected error occurred')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--royal-900)] to-[var(--royal-800)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="glass p-8 rounded-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white font-bold">
              AB
            </div>
            <h1 className="text-xl font-bold text-white">Client Portal</h1>
            <p className="text-sm text-white/60">Access your projects and invoices</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              icon={<FiMail size={16} />}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                <FiLock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 text-sm"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 font-medium text-center">{error}</p>
            )}

            <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
              Access Portal
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
