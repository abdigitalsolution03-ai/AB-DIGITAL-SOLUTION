import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShield, FiClock, FiSmartphone, FiMonitor, FiCheck, FiX } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { Card, Button, Badge, Avatar, EmptyState } from '@/components/ui'

const SESSION_TIMEOUTS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 0, label: 'Never' },
]

export default function SecurityPage() {
  const [settings, setSettings] = useState<any>(() => {
    const s = store.getCollection<any>('settings')[0]
    return s?.securitySettings || {
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      twoFactorRequired: false,
      sessionTimeout: 60,
    }
  })
  const [auditLogs, setAuditLogs] = useState(() => store.getCollection<any>('auditLogs'))
  const [activeSessions, setActiveSessions] = useState<any[]>([])
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    const logs = store.getCollection<any>('auditLogs')
    setLoginHistory(logs.filter((l: any) => l.action?.toLowerCase().includes('login') || l.action?.toLowerCase().includes('logout')).slice(0, 20))

    const stored = JSON.parse(localStorage.getItem('ab_active_sessions') || '[]')
    setActiveSessions(stored)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const updateSecuritySettings = (field: string, value: any) => {
    const updated = { ...settings, [field]: value }
    setSettings(updated)
    const existing = store.getCollection<any>('settings')[0]
    if (existing) {
      store.update('settings', existing.id, { securitySettings: updated })
    }
    showToast('Security settings updated')
  }

  const revokeSession = (sessionId: string) => {
    const updated = activeSessions.filter((s: any) => s.id !== sessionId)
    setActiveSessions(updated)
    localStorage.setItem('ab_active_sessions', JSON.stringify(updated))
    showToast('Session revoked')
  }

  const statusBadge = (action: string): 'success' | 'danger' | 'info' => {
    const a = action.toLowerCase()
    if (a.includes('success') || a.includes('login')) return 'success'
    if (a.includes('failed') || a.includes('logout')) return 'danger'
    return 'info'
  }

  const getDeviceIcon = (details: string) => {
    if (!details) return <FiMonitor size={14} />
    const d = details.toLowerCase()
    if (d.includes('mobile') || d.includes('phone') || d.includes('android') || d.includes('ios')) return <FiSmartphone size={14} />
    return <FiMonitor size={14} />
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Security</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Security settings and login activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Password Policy">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Minimum Password Length</label>
              <div className="flex items-center gap-3">
                <input type="range" min={6} max={20} value={settings.passwordMinLength || 8}
                  onChange={e => updateSecuritySettings('passwordMinLength', parseInt(e.target.value))}
                  className="flex-1 accent-[var(--royal-blue)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)] w-8">{settings.passwordMinLength || 8}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Max Login Attempts</label>
              <div className="flex items-center gap-3">
                <input type="range" min={3} max={10} value={settings.maxLoginAttempts || 5}
                  onChange={e => updateSecuritySettings('maxLoginAttempts', parseInt(e.target.value))}
                  className="flex-1 accent-[var(--royal-blue)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)] w-8">{settings.maxLoginAttempts || 5}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Account Lockout Duration (minutes)</label>
              <div className="flex items-center gap-3">
                <input type="range" min={5} max={60} step={5} value={settings.lockoutDuration || 15}
                  onChange={e => updateSecuritySettings('lockoutDuration', parseInt(e.target.value))}
                  className="flex-1 accent-[var(--royal-blue)]" />
                <span className="text-sm font-semibold text-[var(--text-primary)] w-8">{settings.lockoutDuration || 15}m</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Authentication">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
              <div className="flex items-center gap-3">
                <FiShield className="text-[var(--royal-blue)]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">Two-Factor Authentication</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Add an extra layer of security</p>
                </div>
              </div>
              <button onClick={() => updateSecuritySettings('twoFactorRequired', !settings.twoFactorRequired)}
                className={`w-12 h-6 rounded-full transition-colors ${settings.twoFactorRequired ? 'bg-[var(--royal-blue)]' : 'bg-[var(--bg-tertiary)]'} relative`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${settings.twoFactorRequired ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Session Timeout</label>
              <select value={settings.sessionTimeout || 60} onChange={e => updateSecuritySettings('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none">
                {SESSION_TIMEOUTS.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Active Sessions" subtitle={`${activeSessions.length} active session${activeSessions.length !== 1 ? 's' : ''}`}>
          {activeSessions.length === 0 ? (
            <EmptyState title="No active sessions" description="Active sessions will appear here" />
          ) : (
            <div className="space-y-3">
              {activeSessions.map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                      {getDeviceIcon(session.device || '')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{session.device || 'Unknown Device'}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{session.browser || ''} · {session.ip || 'Unknown IP'}</p>
                    </div>
                  </div>
                  <button onClick={() => revokeSession(session.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Recent Login Activity">
          {loginHistory.length === 0 ? (
            <EmptyState title="No login activity" description="Login history will appear here" />
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {loginHistory.map((log: any, i: number) => (
                <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]">
                  <Badge variant={statusBadge(log.action)} size="sm" dot>
                    {log.action?.includes('Login') ? 'Login' : log.action?.includes('Logout') ? 'Logout' : log.action}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{log.userName || log.user}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {log.details || log.action} · {store.formatDate(log.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl bg-[var(--royal-blue)] text-white text-sm font-medium shadow-lg flex items-center gap-2">
          <FiCheck size={16} /> {toast}
        </motion.div>
      )}
    </PageTransition>
  )
}
