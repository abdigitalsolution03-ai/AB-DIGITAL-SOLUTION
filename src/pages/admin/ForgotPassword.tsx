import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            AB
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Forgot Password</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            {sent ? 'Check your email for reset instructions' : 'Enter your email to receive a reset link'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@abdigital.com"
              icon={<FiMail size={16} />}
              required
            />
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Send Reset Link
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <FiMail className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Reset link sent to <strong>{email}</strong>
            </p>
          </motion.div>
        )}

        <Link
          to="/admin/login"
          className="flex items-center justify-center gap-1.5 mt-6 text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <FiArrowLeft size={14} />
          Back to Login
        </Link>
      </motion.div>
    </div>
  )
}
