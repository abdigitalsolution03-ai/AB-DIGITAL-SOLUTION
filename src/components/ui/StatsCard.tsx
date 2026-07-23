import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

interface StatsCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  trend?: number
  color?: 'royal' | 'gold' | 'green' | 'red' | 'purple'
  className?: string
}

const colorVariants = {
  royal: 'from-royal-500 to-royal-700',
  gold: 'from-gold-500 to-gold-600',
  green: 'from-emerald-500 to-emerald-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
}

const iconBgVariants = {
  royal: 'bg-royal-50 text-royal-600',
  gold: 'bg-gold-50 text-gold-600',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
}

export default function StatsCard({ icon, value, label, trend, color = 'royal', className = '' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`premium-card p-5 ${className}`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${iconBgVariants[color]}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${
            trend >= 0 ? 'text-emerald-600' : 'text-red-500'
          }`}>
            {trend >= 0 ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
