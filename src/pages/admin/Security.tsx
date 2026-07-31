import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiUsers, FiKey, FiRefreshCw, FiTrash2, FiPlus, FiCheck, FiCopy, FiDownload } from 'react-icons/fi'
import { Card, Button, Input, Badge, EmptyState, LoadingSpinner } from '@/components/ui'
import {
  getAuditLog, getUsers, createAdminUser, updateAdminUser, deleteAdminUser,
  getTOTPStatus, setupTOTP, confirmTOTP, disableTOTP, changePassword,
  isSuperAdmin, type User, type AuditEntry, type Role,
} from '@/services/auth'

type Tab = 'audit' | 'users' | '2fa' | 'password'

export default function AdminSecurity() {
  const superAdmin = isSuperAdmin()
  const [tab, setTab] = useState<Tab>('audit')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Security</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Audit logs, admin accounts and account security</p>
        </div>
      </div>

      <div className="flex gap-1 border-b border-[var(--border-primary)]">
        {([
          ['audit', 'Audit Log', FiShield],
          ...(superAdmin ? [['users', 'Admin Users', FiUsers] as const] : []),
          ['2fa', 'Two-Factor Auth', FiKey],
          ['password', 'Change Password', FiKey],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {message && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-4 py-2.5 rounded-xl">
          {message}
        </motion.p>
      )}
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-2.5 rounded-xl">
          {error}
        </motion.p>
      )}

      {tab === 'audit' && <AuditTab setError={setError} setMessage={setMessage} />}
      {tab === 'users' && superAdmin && <UsersTab setError={setError} setMessage={setMessage} />}
      {tab === '2fa' && <TwoFactorTab setError={setError} setMessage={setMessage} />}
      {tab === 'password' && <PasswordTab setError={setError} setMessage={setMessage} />}
    </div>
  )
}

function setErrorText(setError: (s: string) => void, err: unknown) {
  setError(err instanceof Error ? err.message : 'Operation failed')
}

function AuditTab({ setError, setMessage }: { setError: (s: string) => void; setMessage: (s: string) => void }) {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setEntries(await getAuditLog(200))
    } catch (err) {
      setErrorText(setError, err)
    } finally {
      setLoading(false)
    }
  }, [setError])

  useEffect(() => { load() }, [load])

  const exportCsv = () => {
    const rows = [['timestamp', 'actor', 'action', 'detail', 'ip']]
    for (const e of entries) rows.push([e.ts, e.actor, e.action, e.detail ?? '', e.ip ?? ''])
    const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Security Audit Log</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { load(); setMessage('') }}>
            <FiRefreshCw size={14} className="mr-1.5" /> Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={exportCsv} disabled={entries.length === 0}>
            <FiDownload size={14} className="mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : entries.length === 0 ? (
        <EmptyState icon={<FiShield size={32} />} title="No audit events yet" description="Security events will appear here as they happen." />
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--text-tertiary)] border-b border-[var(--border-primary)]">
                <th className="py-2.5 pr-4 font-medium">Timestamp</th>
                <th className="py-2.5 pr-4 font-medium">Actor</th>
                <th className="py-2.5 pr-4 font-medium">Action</th>
                <th className="py-2.5 pr-4 font-medium">Detail</th>
                <th className="py-2.5 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i} className="border-b border-[var(--border-primary)]/50">
                  <td className="py-2.5 pr-4 text-[var(--text-tertiary)] whitespace-nowrap">
                    {new Date(e.ts).toLocaleString()}
                  </td>
                  <td className="py-2.5 pr-4 font-medium text-[var(--text-primary)]">{e.actor}</td>
                  <td className="py-2.5 pr-4">
                    <Badge variant={e.action.includes('failed') || e.action.includes('blocked') ? 'danger' : 'success'}>
                      {e.action}
                    </Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-[var(--text-secondary)] max-w-[300px] truncate">{e.detail ?? '—'}</td>
                  <td className="py-2.5 text-[var(--text-tertiary)]">{e.ip ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

function UsersTab({ setError, setMessage }: { setError: (s: string) => void; setMessage: (s: string) => void }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('admin')
  const [creating, setCreating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setUsers(await getUsers())
    } catch (err) {
      setErrorText(setError, err)
    } finally {
      setLoading(false)
    }
  }, [setError])

  useEffect(() => { load() }, [load])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      await createAdminUser({ name, email, password, role })
      setShowCreate(false)
      setName(''); setEmail(''); setPassword(''); setRole('admin')
      setMessage(`Admin ${email} created`)
      await load()
    } catch (err) {
      setErrorText(setError, err)
    } finally {
      setCreating(false)
    }
  }

  const toggleActive = async (user: User) => {
    try {
      await updateAdminUser(user.id, { isActive: !user.isActive })
      setMessage(`${user.email} ${user.isActive ? 'deactivated' : 'activated'}`)
      await load()
    } catch (err) {
      setErrorText(setError, err)
    }
  }

  const changeRole = async (user: User, nextRole: Role) => {
    try {
      await updateAdminUser(user.id, { role: nextRole })
      setMessage(`${user.email} role updated to ${nextRole}`)
      await load()
    } catch (err) {
      setErrorText(setError, err)
    }
  }

  const removeUser = async (user: User) => {
    if (!window.confirm(`Delete admin ${user.email}? This cannot be undone.`)) return
    try {
      await deleteAdminUser(user.id)
      setMessage(`${user.email} deleted`)
      await load()
    } catch (err) {
      setErrorText(setError, err)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Admin Accounts</h2>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(!showCreate)}>
          <FiPlus size={14} className="mr-1.5" /> New Admin
        </Button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-6 p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] space-y-3">
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="Password (min 8 chars)" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)] text-sm text-[var(--text-primary)] outline-none"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          <Button type="submit" variant="primary" size="sm" loading={creating}>Create Admin</Button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : users.length === 0 ? (
        <EmptyState icon={<FiUsers size={32} />} title="No admins" description="Create your first admin account." />
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--text-tertiary)] border-b border-[var(--border-primary)]">
                <th className="py-2.5 pr-4 font-medium">Name</th>
                <th className="py-2.5 pr-4 font-medium">Email</th>
                <th className="py-2.5 pr-4 font-medium">Role</th>
                <th className="py-2.5 pr-4 font-medium">Status</th>
                <th className="py-2.5 pr-4 font-medium">2FA</th>
                <th className="py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-[var(--border-primary)]/50">
                  <td className="py-2.5 pr-4 font-medium text-[var(--text-primary)]">{user.name}</td>
                  <td className="py-2.5 pr-4 text-[var(--text-secondary)]">{user.email}</td>
                  <td className="py-2.5 pr-4">
                    <select
                      value={user.role}
                      onChange={e => changeRole(user, e.target.value as Role)}
                      className="px-2 py-1 rounded-md bg-[var(--bg-primary)] border border-[var(--border-primary)] text-xs text-[var(--text-primary)] outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge variant={user.isActive ? 'success' : 'danger'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge variant={user.totpEnabled ? 'success' : 'default'}>{user.totpEnabled ? 'On' : 'Off'}</Badge>
                  </td>
                  <td className="py-2.5 flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(user)}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeUser(user)}>
                      <FiTrash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

function TwoFactorTab({ setError, setMessage }: { setError: (s: string) => void; setMessage: (s: string) => void }) {
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [secret, setSecret] = useState('')
  const [setupUrl, setSetupUrl] = useState('')
  const [otpauthUri, setOtpauthUri] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)

  const load = useCallback(async () => {
    try {
      const status = await getTOTPStatus()
      setEnabled(status.enabled)
    } catch (err) {
      setErrorText(setError, err)
    } finally {
      setLoading(false)
    }
  }, [setError])

  useEffect(() => { load() }, [load])

  const beginSetup = async () => {
    setWorking(true)
    setError('')
    try {
      const setup = await setupTOTP()
      setSecret(setup.secret)
      setSetupUrl(setup.setupUrl)
      setOtpauthUri(setup.otpauthUri)
      setEnabled(false)
      setMessage('')
    } catch (err) {
      setErrorText(setError, err)
    } finally {
      setWorking(false)
    }
  }

  const confirm = async () => {
    setWorking(true)
    setError('')
    try {
      const result = await confirmTOTP(code)
      setEnabled(result.enabled)
      setSecret('')
      setSetupUrl('')
      setCode('')
      setMessage('Two-factor authentication enabled')
    } catch (err) {
      setErrorText(setError, err)
    } finally {
      setWorking(false)
    }
  }

  const disable = async () => {
    setWorking(true)
    setError('')
    try {
      const result = await disableTOTP(password)
      setEnabled(result.enabled)
      setPassword('')
      setMessage('Two-factor authentication disabled')
    } catch (err) {
      setErrorText(setError, err)
    } finally {
      setWorking(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner /></div>

  return (
    <Card className="p-6 max-w-xl">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Two-Factor Authentication</h2>
      <p className="text-sm text-[var(--text-tertiary)] mb-6">
        Protect your admin account with a time-based one-time password from an authenticator app
        (Google Authenticator, Authy, 1Password, etc.).
      </p>

      {enabled ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FiCheck className="text-green-500" size={18} />
            <span className="text-sm font-medium text-[var(--text-primary)]">2FA is enabled on your account</span>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] space-y-3">
            <Input label="Enter your password to disable 2FA" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <Button variant="danger" size="sm" loading={working} onClick={disable}>Disable 2FA</Button>
          </div>
        </div>
      ) : secret ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Scan the QR code with your authenticator app, or enter the secret manually:
          </p>
          <div className="flex justify-center">
            <img src={setupUrl} alt="2FA setup QR code" className="rounded-xl border border-[var(--border-primary)] bg-white p-2" width={200} height={200} />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <code className="text-xs bg-[var(--bg-secondary)] px-3 py-2 rounded-lg border border-[var(--border-primary)] tracking-wider select-all">
              {secret}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(otpauthUri)}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              title="Copy otpauth:// URI"
            >
              <FiCopy size={16} />
            </button>
          </div>
          <div className="p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] space-y-3">
            <Input label="Enter the 6-digit code" inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" loading={working} onClick={confirm}>Verify & Enable</Button>
              <Button variant="ghost" size="sm" onClick={() => { setSecret(''); setSetupUrl(''); setCode('') }}>Cancel</Button>
            </div>
          </div>
        </div>
      ) : (
        <Button variant="primary" size="sm" loading={working} onClick={beginSetup}>
          <FiKey size={14} className="mr-1.5" /> Enable Two-Factor Auth
        </Button>
      )}
    </Card>
  )
}

function PasswordTab({ setError, setMessage }: { setError: (s: string) => void; setMessage: (s: string) => void }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [working, setWorking] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    setWorking(true)
    try {
      await changePassword(currentPassword, newPassword)
      setMessage('Password changed. Please log in again with your new password.')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (err) {
      setErrorText(setError, err)
    } finally {
      setWorking(false)
    }
  }

  return (
    <Card className="p-6 max-w-xl">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Change Password</h2>
      <p className="text-sm text-[var(--text-tertiary)] mb-6">Use at least 8 characters. All active sessions will be revoked.</p>
      <form onSubmit={submit} className="space-y-4">
        <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
        <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <Button type="submit" variant="primary" size="sm" loading={working}>Update Password</Button>
      </form>
    </Card>
  )
}
