import { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  default: 'badge-default',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
}

export default function Badge({ children, variant = 'default', size = 'md', className = '', dot = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'success' ? 'bg-[#059669]' :
          variant === 'warning' ? 'bg-[#D97706]' :
          variant === 'danger' ? 'bg-[#DC2626]' :
          variant === 'info' ? 'bg-[#2563EB]' :
          'bg-[var(--text-tertiary)]'
        }`} />
      )}
      {children}
    </span>
  )
}
