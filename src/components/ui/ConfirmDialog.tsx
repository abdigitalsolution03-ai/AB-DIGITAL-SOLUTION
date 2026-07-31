import Modal from './Modal'
import Button from './Button'
import { FiAlertTriangle } from 'react-icons/fi'

interface ConfirmDialogProps {
  isOpen?: boolean
  onClose?: () => void
  open?: boolean
  onCancel?: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

const variantIcons = {
  danger: { icon: FiAlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  warning: { icon: FiAlertTriangle, color: 'text-gold-500', bg: 'bg-gold-50' },
  info: { icon: FiAlertTriangle, color: 'text-royal-500', bg: 'bg-royal-50' },
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  open,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const config = variantIcons[variant]
  const isVisible = isOpen ?? open ?? false
  const handleClose = onClose ?? onCancel ?? (() => {})

  return (
    <Modal isOpen={isVisible} onClose={handleClose} size="sm" showClose={false}>
      <div className="text-center">
        <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center mx-auto mb-4`}>
          <config.icon className={config.color} size={28} />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
        <p className="text-sm text-[var(--text-tertiary)] mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" size="md" onClick={handleClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'gold' : 'primary'}
            size="md"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
