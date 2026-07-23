import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'
import {
  isSuperAdmin,
  getUsersList as getUsers,
  createUser,
  updateUser,
  deleteUser,
  getSession,
} from '@/services/auth'
import type { AdminUser, Role } from '@/services/auth'

type ModalMode = 'add' | 'edit' | null

interface FormData {
  email: string
  name: string
  role: Role
  password: string
  isActive: boolean
}

const emptyForm: FormData = {
  email: '',
  name: '',
  role: 'editor',
  password: '',
  isActive: true,
}

const roles: { value: Role; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'marketing', label: 'Marketing' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [authorized, setAuthorized] = useState(true)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [toastError, setToastError] = useState('')

  const session = getSession()

  const loadUsers = () => {
    if (!isSuperAdmin()) {
      setAuthorized(false)
      return
    }
    setAuthorized(true)
    setUsers(getUsers())
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const showError = (msg: string) => {
    setToastError(msg)
    setTimeout(() => setToastError(''), 3000)
  }

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setModalMode('add')
  }

  const openEdit = (user: AdminUser) => {
    setForm({
      email: user.email,
      name: user.name,
      role: user.role,
      password: '',
      isActive: user.isActive,
    })
    setEditingId(user.id)
    setModalMode('edit')
  }

  const closeModal = () => {
    setModalMode(null)
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (modalMode === 'add') {
        if (!form.password || form.password.length < 8) {
          showError('Password must be at least 8 characters')
          setLoading(false)
          return
        }
        const result = await createUser(form.email, form.name, form.role, form.password)
        if (!result.success) {
          showError(result.error || 'Failed to create user')
          setLoading(false)
          return
        }
        showToast('User created successfully')
      } else if (modalMode === 'edit' && editingId) {
        const updates: Partial<AdminUser> = {
          name: form.name,
          role: form.role,
          isActive: form.isActive,
        }
        const ok = updateUser(editingId, updates)
        if (!ok) {
          showError('Failed to update user')
          setLoading(false)
          return
        }
        showToast('User updated successfully')
      }

      loadUsers()
      closeModal()
    } catch {
      showError('An unexpected error occurred')
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const user = users.find((u) => u.id === id)
    if (!user) return

    if (session && user.id === session.userId) {
      showError('You cannot delete yourself')
      return
    }

    const superAdmins = users.filter((u) => u.role === 'super_admin')
    if (user.role === 'super_admin' && superAdmins.length <= 1) {
      showError('Cannot delete the last Super Admin')
      return
    }

    const ok = deleteUser(id)
    if (!ok) {
      showError('Failed to delete user')
      return
    }

    showToast('User deleted successfully')
    loadUsers()
  }

  const handleToggleActive = (user: AdminUser) => {
    if (session && user.id === session.userId) {
      showError('You cannot deactivate yourself')
      return
    }

    const ok = updateUser(user.id, { isActive: !user.isActive })
    if (!ok) {
      showError('Failed to update user status')
      return
    }

    showToast(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`)
    loadUsers()
  }

  const formatDate = (date: string | null) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!authorized) {
    return (
      <PageTransition>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-[#FF4D4D] border-3 border-[#111] flex items-center justify-center mb-6 shadow-[4px_4px_0_#111]">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#111] mb-2">Access Denied</h1>
          <p className="text-[#111]/60 text-sm text-center max-w-md">
            You do not have permission to access this page. Only Super Administrators can manage users.
          </p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#111]">User Management</h1>
          <p className="text-[#111]/60 text-sm mt-1">Manage admin users and roles</p>
        </div>
        <button onClick={openAdd} className="doodle-btn-accent px-5 py-2.5 text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      <div className="doodle-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-3 border-[#111] bg-[#60A5FA]/10">
                <th className="text-left text-xs font-black text-[#111] uppercase tracking-wider px-5 py-4">Name</th>
                <th className="text-left text-xs font-black text-[#111] uppercase tracking-wider px-5 py-4">Email</th>
                <th className="text-left text-xs font-black text-[#111] uppercase tracking-wider px-5 py-4">Role</th>
                <th className="text-left text-xs font-black text-[#111] uppercase tracking-wider px-5 py-4">Status</th>
                <th className="text-left text-xs font-black text-[#111] uppercase tracking-wider px-5 py-4">Last Login</th>
                <th className="text-right text-xs font-black text-[#111] uppercase tracking-wider px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-[#111]/40 text-sm">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className={`border-b-2 border-[#111]/10 last:border-b-0 ${
                      !user.isActive ? 'bg-[#FF4D4D]/5' : 'hover:bg-[#60A5FA]/5'
                    } transition-colors`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#60A5FA] border-2 border-[#111] flex items-center justify-center font-black text-sm text-[#111] flex-shrink-0 shadow-[2px_2px_0_#111]">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111]">{user.name}</p>
                          <p className="text-xs text-[#111]/40">{user.role === 'super_admin' ? 'Super Admin' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#111]/70">{user.email}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 border-2 border-[#111] inline-block ${
                          user.role === 'super_admin'
                            ? 'bg-[#60A5FA] text-[#111]'
                            : user.role === 'admin'
                            ? 'bg-[#4D7AFF] text-white'
                            : user.role === 'editor'
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-[#10B981] text-white'
                        }`}
                      >
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 border-2 border-[#111] ${
                            user.isActive ? 'bg-[#10B981]' : 'bg-[#FF4D4D]'
                          }`}
                        />
                        <span className={`text-xs font-bold ${user.isActive ? 'text-[#10B981]' : 'text-[#FF4D4D]'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-[#111]/50">{formatDate(user.lastLogin)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(user)}
                          disabled={session?.userId === user.id}
                          className={`p-2 border-2 border-[#111] transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                            user.isActive
                              ? 'bg-white hover:bg-[#FF4D4D] hover:text-white'
                              : 'bg-white hover:bg-[#10B981] hover:text-white'
                          }`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => openEdit(user)}
                          className="p-2 border-2 border-[#111] bg-white hover:bg-[#4D7AFF] hover:text-white transition-all"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={session?.userId === user.id}
                          className="p-2 border-2 border-[#111] bg-white hover:bg-[#FF4D4D] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/30"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-lg doodle-card p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-[#111]">
                  {modalMode === 'add' ? 'Add User' : 'Edit User'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 border-2 border-[#111] bg-white hover:bg-[#FF4D4D] hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {modalMode === 'add' && (
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                )}

                {modalMode === 'edit' && (
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      className="w-full px-4 py-3 bg-[#F5F5F5] border-3 border-[#111] text-[#111]/50 text-sm cursor-not-allowed"
                      disabled
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#111]/60 mb-2">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                    className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm"
                  >
                    {roles.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {modalMode === 'add' && (
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm"
                      placeholder="Min. 8 characters"
                      required={modalMode === 'add'}
                      minLength={8}
                    />
                  </div>
                )}

                {modalMode === 'edit' && (
                  <div>
                    <label className="block text-sm font-bold text-[#111]/60 mb-2">Active Status</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, isActive: !form.isActive })}
                        className={`px-4 py-2.5 border-3 border-[#111] text-sm font-bold transition-all ${
                          form.isActive
                            ? 'bg-[#10B981] text-white'
                            : 'bg-[#FF4D4D] text-white'
                        }`}
                      >
                        {form.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <span className="text-xs text-[#111]/40">
                        {form.isActive
                          ? 'User can log in to the admin panel'
                          : 'User is blocked from logging in'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="doodle-btn-accent flex-1 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#111]"
                  >
                    {loading
                      ? 'Saving...'
                      : modalMode === 'add'
                      ? 'Create User'
                      : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="doodle-btn-outline flex-1 py-3 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 doodle-btn-accent px-6 py-3 text-sm font-bold shadow-[4px_4px_0_#111] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastError && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 bg-[#FF4D4D] text-white px-6 py-3 text-sm font-bold border-3 border-[#111] shadow-[4px_4px_0_#111] flex items-center gap-2"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {toastError}
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

