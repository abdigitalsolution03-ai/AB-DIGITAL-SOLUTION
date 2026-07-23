import { motion } from 'framer-motion'
import { FiLoader } from 'react-icons/fi'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface LoadingSpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export default function LoadingSpinner({ size = 'md', className = '', label }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} text-[var(--royal-500)]`}
      >
        <FiLoader />
      </motion.div>
      {label && <p className="text-sm text-[var(--text-tertiary)]">{label}</p>}
    </div>
  )
}
