import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'royal' | 'gold' | 'green' | 'red'
  className?: string
}

const colorClasses = {
  royal: 'bg-royal-500',
  gold: 'bg-gold-500',
  green: 'bg-emerald-500',
  red: 'bg-red-500',
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color = 'royal',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>}
          {showPercentage && <span className="text-xs font-semibold text-[var(--text-tertiary)]">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClasses[color]} relative`}
        >
          {size === 'lg' && (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </motion.div>
      </div>
    </div>
  )
}
