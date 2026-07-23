import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  action?: ReactNode
  hoverable?: boolean
  variant?: 'default' | 'glass' | 'gold'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  title,
  subtitle,
  children,
  className = '',
  action,
  hoverable = true,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const variantClass = variant === 'glass'
    ? 'glass-card'
    : variant === 'gold'
      ? 'premium-card premium-card-gold'
      : 'premium-card'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${variantClass} ${paddingClasses[padding]} ${hoverable ? 'cursor-default' : ''} ${className}`}
      whileHover={hoverable ? { y: -2 } : {}}
      transition={{ duration: 0.3 }}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>}
            {subtitle && <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}
