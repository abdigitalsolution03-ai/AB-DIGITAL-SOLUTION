import { useState } from 'react'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  status?: 'online' | 'offline' | 'away' | 'busy'
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

const statusSizes: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5 right-0 bottom-0',
  sm: 'w-2 h-2 right-0 bottom-0',
  md: 'w-2.5 h-2.5 right-0 bottom-0',
  lg: 'w-3 h-3 right-0.5 bottom-0.5',
  xl: 'w-4 h-4 right-0.5 bottom-0.5',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function stringToColor(name: string): string {
  const colors = [
    'bg-royal-500', 'bg-gold-500', 'bg-emerald-500', 'bg-purple-500',
    'bg-pink-500', 'bg-cyan-500', 'bg-orange-500', 'bg-teal-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function Avatar({ src, name, size = 'md', status, className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full ${stringToColor(name)} flex items-center justify-center text-white font-semibold`}>
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span className={`absolute ${statusSizes[size]} rounded-full border-2 border-[var(--bg-secondary)] status-dot ${status}`} />
      )}
    </div>
  )
}
