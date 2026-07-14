import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/PageTransition'
import {
  isSuperAdmin, getAdminUrl, setAdminUrl, getAdminSettings, saveAdminSettings,
  getBackups, createBackup, restoreBackup, addAuditLog, getSession
} from '@/services/auth'

export default function AdminSecurity() {
  const [authorized, setAuthorized] = useState(false)
  const [adminUrl, setAdminUrlState] = useState('')
  const [originalUrl, setOriginalUrl] = useState('')
  const [minLength, setMinLength] = useState(8)
  const [requireSpecial, setRequireSpecial] = useState(true)
  const [requireNumbers, setRequireNumbers] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [maxAttempts, setMaxAttempts] = useState(5)
  const [require2FA, setRequire2FA] = useState(false)
  const [backups, setBackups] = useState<any[]>([])
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [urlSaved, setUrlSaved] = useState(false)
  const [policySaved, setPolicySaved] = useState(false)
  const [sessionSaved, setSessionSaved] = useState(false)
  const [twoFASaved, setTwoFASaved] = useState(false)
  const [backupCreated, setBackupCreated] = useState(false)

  useEffect(() => {
    if (!isSuperAdmin()) return
    setAuthorized(true)
    const url = getAdminUrl()
    setAdminUrlState(url)
    setOriginalUrl(url)
    const settings = getAdminSettings()
    if (settings.passwordPolicy) {
      setMinLength(settings.passwordPolicy.minLength ?? 8)
      setRequireSpecial(settings.passwordPolicy.requireSpecial ?? true)
      setRequireNumbers(settings.passwordPolicy.requireNumbers ?? true)
    }
    if (settings.session) {
      setSessionTimeout(settings.session.timeout ?? 30)
      setMaxAttempts(settings.session.maxAttempts ?? 5)
    }
    if (settings.twoFA !== undefined) {
      setRequire2FA(settings.twoFA)
    }
    setBackups(getBackups())
  }, [])

  if (!authorized) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="doodle-card p-8 text-center max-w-md">
            <div className="w-14 h-14 bg-[#FF4D4D] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_#111]">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-[#111] mb-2">Access Denied</h2>
            <p className="text-[#111]/60 text-sm">You need Super Admin privileges to access this page.</p>
          </div>
        </div>
      </PageTransition>
    )
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSaveUrl = () => {
    setAdminUrl(adminUrl)
    setOriginalUrl(adminUrl)
    setUrlSaved(true)
    addAuditLog(getSession()?.email || 'unknown', 'Admin URL changed')
    showToast('Admin URL saved successfully!')
    setTimeout(() => setUrlSaved(false), 2000)
  }

  const handleSavePolicy = () => {
    const settings = getAdminSettings()
    saveAdminSettings({ ...settings, passwordPolicy: { minLength, requireSpecial, requireNumbers } })
    setPolicySaved(true)
    showToast('Password policy saved successfully!')
    setTimeout(() => setPolicySaved(false), 2000)
  }

  const handleSaveSession = () => {
    const settings = getAdminSettings()
    saveAdminSettings({ ...settings, session: { timeout: sessionTimeout, maxAttempts } })
    setSessionSaved(true)
    showToast('Session settings saved successfully!')
    setTimeout(() => setSessionSaved(false), 2000)
  }

  const handleSave2FA = () => {
    const settings = getAdminSettings()
    saveAdminSettings({ ...settings, twoFA: require2FA })
    setTwoFASaved(true)
    showToast('2FA settings saved successfully!')
    setTimeout(() => setTwoFASaved(false), 2000)
  }

  const handleCreateBackup = () => {
    const result = createBackup()
    if (result.success) {
      setBackups(getBackups())
      setBackupCreated(true)
      showToast('Backup created successfully!')
      setTimeout(() => setBackupCreated(false), 2000)
    }
  }

  const handleRestoreBackup = (id: string) => {
    const result = restoreBackup(id)
    if (result.success) {
      setRestoreConfirm(null)
      showToast('Backup restored successfully!')
    }
  }

  const sectionTitleClass = "text-lg font-black text-[#111] mb-1"
  const sectionDescClass = "text-[#111]/60 text-sm mb-6"
  const labelClass = "block text-sm font-bold text-[#111]/60 mb-2"
  const inputClass = "w-full px-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm"
  const toggleBase = "relative w-11 h-6 border-3 border-[#111] cursor-pointer transition-all"
  const toggleActive = "bg-[#FFD400]"
  const toggleInactive = "bg-white"
  const toggleDot = "absolute top-0.5 left-0.5 w-4 h-4 bg-[#111] transition-all"

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#111]">Security Settings</h1>
        <p className="text-[#111]/60 text-sm mt-1">Manage security, authentication, and backup settings</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="doodle-card p-6 md:p-8"
        >
          <h2 className={sectionTitleClass}>Admin URL</h2>
          <p className={sectionDescClass}>Change the path used to access the admin panel.</p>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111]/40 text-sm font-mono">/</span>
              <input
                type="text"
                value={adminUrl.replace(/^\//, '')}
                onChange={(e) => setAdminUrlState('/' + e.target.value.replace(/^\/+/, ''))}
                className="w-full pl-7 pr-4 py-3 bg-white border-3 border-[#111] text-[#111] focus:outline-none text-sm font-mono"
                placeholder="admin"
              />
            </div>
            <button onClick={handleSaveUrl} className={`doodle-btn-accent px-6 py-3 text-sm whitespace-nowrap ${urlSaved ? '!bg-green-400' : ''}`}>
              {urlSaved ? 'Saved!' : 'Save'}
            </button>
          </div>
          <div className="mt-3 flex items-start gap-2 bg-[#FFD400]/20 border-3 border-[#FFD400]/50 p-3">
            <svg className="w-4 h-4 text-[#111] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-[#111]/70 font-medium">Warning: Changing the admin URL will log everyone out. Make sure to remember the new URL.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="doodle-card p-6 md:p-8"
        >
          <h2 className={sectionTitleClass}>Password Policy</h2>
          <p className={sectionDescClass}>Configure password requirements for admin accounts.</p>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Minimum Length: <span className="text-[#FFD400] bg-[#111] px-2 py-0.5 text-xs font-bold">{minLength}</span></label>
              <input
                type="range"
                min={8}
                max={32}
                value={minLength}
                onChange={(e) => setMinLength(parseInt(e.target.value))}
                className="w-full accent-[#FFD400] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#111]/40 font-bold mt-1">
                <span>8</span>
                <span>32</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#111]">Require Special Characters (!@#$%^&*)</span>
              <button
                onClick={() => setRequireSpecial(!requireSpecial)}
                className={`${toggleBase} ${requireSpecial ? toggleActive : toggleInactive}`}
              >
                <span className={`${toggleDot} ${requireSpecial ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#111]">Require Numbers (0-9)</span>
              <button
                onClick={() => setRequireNumbers(!requireNumbers)}
                className={`${toggleBase} ${requireNumbers ? toggleActive : toggleInactive}`}
              >
                <span className={`${toggleDot} ${requireNumbers ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={handleSavePolicy} className={`doodle-btn-accent px-6 py-2.5 text-sm ${policySaved ? '!bg-green-400' : ''}`}>
              {policySaved ? 'Saved!' : 'Save Password Policy'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="doodle-card p-6 md:p-8"
        >
          <h2 className={sectionTitleClass}>Session</h2>
          <p className={sectionDescClass}>Configure session timeout and login attempt limits.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Session Timeout</label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                className={inputClass}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Max Login Attempts: <span className="text-[#FFD400] bg-[#111] px-2 py-0.5 text-xs font-bold">{maxAttempts}</span></label>
              <input
                type="range"
                min={3}
                max={10}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                className="w-full accent-[#FFD400] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#111]/40 font-bold mt-1">
                <span>3</span>
                <span>10</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={handleSaveSession} className={`doodle-btn-accent px-6 py-2.5 text-sm ${sessionSaved ? '!bg-green-400' : ''}`}>
              {sessionSaved ? 'Saved!' : 'Save Session Settings'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="doodle-card p-6 md:p-8"
        >
          <h2 className={sectionTitleClass}>Two-Factor Authentication</h2>
          <p className={sectionDescClass}>Require 2FA for all admin accounts.</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#111]">Require 2FA for All Admins</p>
              <p className="text-xs text-[#111]/50 mt-0.5">Users will be prompted to set up 2FA on next login</p>
            </div>
            <button
              onClick={() => setRequire2FA(!require2FA)}
              className={`${toggleBase} ${require2FA ? toggleActive : toggleInactive}`}
            >
              <span className={`${toggleDot} ${require2FA ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={handleSave2FA} className={`doodle-btn-accent px-6 py-2.5 text-sm ${twoFASaved ? '!bg-green-400' : ''}`}>
              {twoFASaved ? 'Saved!' : 'Save 2FA Settings'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="doodle-card p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={sectionTitleClass}>Backup & Restore</h2>
              <p className={sectionDescClass}>Create and restore system backups.</p>
            </div>
            <button onClick={handleCreateBackup} className={`doodle-btn-accent px-5 py-2.5 text-sm flex items-center gap-2 ${backupCreated ? '!bg-green-400' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {backupCreated ? 'Created!' : 'Create Backup'}
            </button>
          </div>
          {backups.length === 0 ? (
            <div className="bg-white border-3 border-[#111] p-6 text-center">
              <svg className="w-8 h-8 text-[#111]/20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-[#111]/40 text-sm">No backups available. Click "Create Backup" to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {backups.map((backup, i) => (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between bg-white border-3 border-[#111] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFD400] border-2 border-[#111] flex items-center justify-center shadow-[2px_2px_0_#111]">
                      <svg className="w-4 h-4 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111]">Backup #{backups.length - i}</p>
                      <p className="text-xs text-[#111]/50 font-mono">{new Date(backup.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setRestoreConfirm(backup.id)}
                    className="px-4 py-2 border-3 border-[#111] text-sm font-bold text-[#111] hover:bg-[#FFD400] transition-all"
                  >
                    Restore
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

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
        {restoreConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setRestoreConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm doodle-card p-6 md:p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-[#FFD400] border-3 border-[#111] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0_#111]">
                <svg className="w-6 h-6 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[#111] mb-2">Restore Backup</h3>
              <p className="text-[#111]/60 text-sm mb-6">This will overwrite current data with the selected backup. This action cannot be undone.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setRestoreConfirm(null)} className="px-5 py-2.5 border-3 border-[#111] text-[#111]/60 text-sm font-bold hover:bg-[#FFD400] transition-all">Cancel</button>
                <button onClick={() => handleRestoreBackup(restoreConfirm)} className="px-5 py-2.5 bg-[#FFD400] border-3 border-[#111] text-[#111] font-bold text-sm shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] transition-all">Restore</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
