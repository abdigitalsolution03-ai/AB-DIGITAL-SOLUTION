import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiShield, FiSave, FiCamera } from 'react-icons/fi'
import { Card, Button, Input, Avatar } from '@/components/ui'
import { getCurrentUser, updateProfile, type User } from '@/services/auth'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function AdminProfile() {
  const [user, setUser] = useState<User | undefined>(getCurrentUser())
  const [name, setName] = useState(user?.name ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? '')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setName(user?.name ?? '')
    setAvatar(user?.avatar ?? '')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!user) return null

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image')) return
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const MAX = 512
      let { width, height } = img
      if (width > MAX || height > MAX) {
        const ratio = Math.min(MAX / width, MAX / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      URL.revokeObjectURL(objectUrl)
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        setAvatar(canvas.toDataURL('image/jpeg', 0.85))
      }
    }
    img.onerror = () => URL.revokeObjectURL(objectUrl)
    img.src = objectUrl
    e.target.value = ''
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateProfile({ name: name.trim() || user?.name || '', avatar: avatar || undefined })
      setUser(updated)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Profile</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Your account details and avatar</p>
        </div>
        <Button variant="primary" size="sm" icon={<FiSave />} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 flex flex-col items-center gap-4">
            <div className="relative">
              {user?.avatar ? (
                <Avatar src={user.avatar} name={user.name} size="lg" />
              ) : (
                <Avatar name={user.name} size="lg" />
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                title="Change photo"
              >
                <FiCamera size={15} />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            <div className="text-center">
              <p className="font-semibold text-[var(--text-primary)]">{user?.name}</p>
              <p className="flex items-center justify-center gap-1.5 text-sm text-[var(--text-tertiary)] mt-0.5">
                <FiMail size={13} /> {user?.email}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-5">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" icon={<FiUser size={15} />} />
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Email (read-only)</label>
              <div className="px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] bg-muted/40 text-sm text-[var(--text-tertiary)] flex items-center gap-2">
                <FiMail size={15} /> {user?.email}
              </div>
              <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
                Contact support to change the email. Use the password tab to update your password.
              </p>
            </div>
            <Link to="/admin/security?tab=password" className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              <FiShield size={14} /> Change password & configure 2FA
            </Link>
          </div>
        </div>
        {avatar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 border-t border-[var(--border-primary)] pt-4">
            <p className="text-xs font-medium text-[var(--text-tertiary)] mb-2">Photo preview</p>
            <img src={avatar} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover border-2 border-[var(--border-primary)]" />
          </motion.div>
        )}
      </Card>
    </div>
  )
}