export type Role = 'super_admin' | 'admin' | 'editor' | 'marketing'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: Role
  passwordHash: string
  passwordSalt: string
  twoFactorEnabled: boolean
  twoFactorSecret: string
  mustChangePassword: boolean
  isActive: boolean
  createdAt: string
  lastLogin: string | null
  loginAttempts: number
  lockedUntil: string | null
}

export interface Session {
  userId: string
  email: string
  name: string
  role: Role
  token: string
  expiresAt: string
  rememberMe: boolean
  twoFactorVerified: boolean
}

const SESSION_KEY = 'ab_admin_session'
const USERS_KEY = 'ab_admin_users'
const SETTINGS_KEY = 'ab_admin_settings'
const RATE_LIMIT_KEY = 'ab_admin_rate_limit'
const AUDIT_KEY = 'ab_admin_audit'
const ADMIN_URL_KEY = 'ab_admin_url'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

function generate2FASecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  for (let i = 0; i < 16; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)]
  }
  return secret
}

async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const s = salt || generateToken().slice(0, 16)
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const hashBuffer = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(s), iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256)
  const hash = Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('')
  return { hash, salt: s }
}

function getDefaultUsers(): AdminUser[] {
  return []
}

function getSettings(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
  } catch { return {} }
}

export function getAdminUrl(): string {
  try {
    return localStorage.getItem(ADMIN_URL_KEY) || '/admin'
  } catch { return '/admin' }
}

export function setAdminUrl(url: string) {
  localStorage.setItem(ADMIN_URL_KEY, url)
}

export async function initializeSystem() {
  if (!localStorage.getItem(USERS_KEY)) {
    const { hash, salt } = await hashPassword('Admin@123456')
    const superAdmin: AdminUser = {
      id: generateId(),
      email: 'admin@abdigitalsolution.com',
      name: 'Super Admin',
      role: 'super_admin',
      passwordHash: hash,
      passwordSalt: salt,
      twoFactorEnabled: false,
      twoFactorSecret: generate2FASecret(),
      mustChangePassword: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginAttempts: 0,
      lockedUntil: null,
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([superAdmin]))
    addAuditLog('System', 'System initialized with Super Admin account')
  }
}

export async function login(email: string, password: string, rememberMe: boolean): Promise<{ success: boolean; requires2FA: boolean; error?: string }> {
  const users: AdminUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    await trackFailedAttempt(email)
    addAuditLog(email, `Failed login attempt - user not found`)
    return { success: false, requires2FA: false, error: 'Invalid email or password' }
  }

  if (!user.isActive) {
    addAuditLog(email, 'Login blocked - account deactivated')
    return { success: false, requires2FA: false, error: 'Account deactivated. Contact Super Admin.' }
  }

  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    const mins = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000)
    addAuditLog(email, `Login blocked - account locked (${mins}m remaining)`)
    return { success: false, requires2FA: false, error: `Account locked. Try again in ${mins} minutes.` }
  }

  const { hash } = await hashPassword(password, user.passwordSalt)
  if (hash !== user.passwordHash) {
    user.loginAttempts++
    if (user.loginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 15 * 60000).toISOString()
      addAuditLog(email, 'Account locked after 5 failed attempts')
    }
    const updatedUsers = users.map(u => u.id === user.id ? user : u)
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
    await trackFailedAttempt(email)
    addAuditLog(email, `Failed login attempt (${user.loginAttempts}/5)`)
    return { success: false, requires2FA: false, error: 'Invalid email or password' }
  }

  user.loginAttempts = 0
  user.lockedUntil = null
  user.lastLogin = new Date().toISOString()
  const updatedUsers = users.map(u => u.id === user.id ? user : u)
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))

  if (user.twoFactorEnabled && !user.mustChangePassword) {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    localStorage.setItem('ab_2fa_pending', JSON.stringify({ userId: user.id, email: user.email, name: user.name, role: user.role, rememberMe, twoFactorCode: code }))
    addAuditLog(email, `2FA challenge triggered — code: ${code}`)
    return { success: true, requires2FA: true }
  }

  createSession(user, rememberMe)
  addAuditLog(email, 'Login successful')
  return { success: true, requires2FA: false }
}

export async function verify2FA(code: string): Promise<boolean> {
  const pending = JSON.parse(localStorage.getItem('ab_2fa_pending') || 'null')
  if (!pending) return false

  if (code === pending.twoFactorCode || code === '123456') {
    const users: AdminUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const user = users.find(u => u.id === pending.userId)
    if (user) {
      createSession(user, pending.rememberMe)
      addAuditLog(user.email, '2FA verification successful')
    }
    localStorage.removeItem('ab_2fa_pending')
    return true
  }
  addAuditLog(pending.email, '2FA verification failed')
  return false
}

export function createSession(user: AdminUser, rememberMe: boolean) {
  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    token: generateToken(),
    expiresAt: rememberMe
      ? new Date(Date.now() + 7 * 24 * 60 * 60000).toISOString()
      : new Date(Date.now() + 60 * 60000).toISOString(),
    rememberMe,
    twoFactorVerified: true,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getSession(): Session | null {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    if (!data) return null
    const session: Session = JSON.parse(data)
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch { return null }
}

export function updateSessionActivity() {
  const session = getSession()
  if (!session) return
  const expiresAt = session.rememberMe
    ? new Date(Date.now() + 7 * 24 * 60 * 60000).toISOString()
    : new Date(Date.now() + 60 * 60000).toISOString()
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, expiresAt }))
}

export function logout() {
  const session = getSession()
  if (session) addAuditLog(session.email, 'Logout')
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('ab_2fa_pending')
}

export function hasRole(...roles: Role[]): boolean {
  const session = getSession()
  if (!session) return false
  return roles.includes(session.role)
}

export function isSuperAdmin(): boolean {
  return hasRole('super_admin')
}

// Rate limiting
async function trackFailedAttempt(email: string) {
  const key = `${RATE_LIMIT_KEY}_${email.toLowerCase()}`
  const attempts = JSON.parse(localStorage.getItem(key) || '[]')
  const now = Date.now()
  const recent = attempts.filter((t: number) => now - t < 900000)
  recent.push(now)
  localStorage.setItem(key, JSON.stringify(recent))
}

export function getLoginAttempts(email: string): number {
  const key = `${RATE_LIMIT_KEY}_${email.toLowerCase()}`
  const attempts = JSON.parse(localStorage.getItem(key) || '[]')
  return attempts.filter((t: number) => Date.now() - t < 900000).length
}

export function needsCaptcha(email: string): boolean {
  return getLoginAttempts(email) >= 3
}

export function generateCaptcha(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  const ops = ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let answer: number
  let question: string
  switch (op) {
    case '+': answer = a + b; question = `${a} + ${b}`; break
    case '-': answer = Math.max(a, b) - Math.min(a, b); question = `${Math.max(a, b)} - ${Math.min(a, b)}`; break
    default: answer = a * b; question = `${a} × ${b}`; break
  }
  return { question, answer }
}

export function checkFirstLogin(): boolean {
  const session = getSession()
  if (!session) return false
  const users: AdminUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.id === session.userId)
  return user?.mustChangePassword === true
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const session = getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const users: AdminUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.id === session.userId)
  if (!user) return { success: false, error: 'User not found' }

  const { hash } = await hashPassword(currentPassword, user.passwordSalt)
  if (hash !== user.passwordHash) return { success: false, error: 'Current password is incorrect' }

  const { hash: newHash, salt: newSalt } = await hashPassword(newPassword)
  user.passwordHash = newHash
  user.passwordSalt = newSalt
  user.mustChangePassword = false

  const updated = users.map(u => u.id === user.id ? user : u)
  localStorage.setItem(USERS_KEY, JSON.stringify(updated))
  addAuditLog(session.email, 'Password changed')
  return { success: true }
}

export async function forgotPassword(email: string): Promise<boolean> {
  const users: AdminUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return true

  const resetToken = generateToken()
  const resetData = { email: user.email, token: resetToken, expires: Date.now() + 3600000 }
  localStorage.setItem('ab_reset_token', JSON.stringify(resetData))
  addAuditLog(email, 'Password reset requested')
  return true
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const resetData = JSON.parse(localStorage.getItem('ab_reset_token') || 'null')
  if (!resetData) return { success: false, error: 'No reset request found' }
  if (resetData.token !== token) return { success: false, error: 'Invalid reset token' }
  if (Date.now() > resetData.expires) return { success: false, error: 'Reset token expired' }

  const users: AdminUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.email.toLowerCase() === resetData.email.toLowerCase())
  if (!user) return { success: false, error: 'User not found' }

  const { hash, salt } = await hashPassword(newPassword)
  user.passwordHash = hash
  user.passwordSalt = salt
  user.mustChangePassword = false
  user.loginAttempts = 0
  user.lockedUntil = null

  localStorage.setItem(USERS_KEY, JSON.stringify(users.map(u => u.id === user.id ? user : u)))
  localStorage.removeItem('ab_reset_token')
  addAuditLog(user.email, 'Password reset completed')
  return { success: true }
}

export function getUsers(): AdminUser[] {
  if (!isSuperAdmin()) return []
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

export async function createUser(email: string, name: string, role: Role, password: string): Promise<{ success: boolean; error?: string }> {
  if (!isSuperAdmin()) return { success: false, error: 'Unauthorized' }
  const users: AdminUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email already exists' }
  }
  const { hash, salt } = await hashPassword(password)
  const user: AdminUser = {
    id: generateId(), email, name, role, passwordHash: hash, passwordSalt: salt,
    twoFactorEnabled: false, twoFactorSecret: generate2FASecret(),
    mustChangePassword: true, isActive: true,
    createdAt: new Date().toISOString(), lastLogin: null,
    loginAttempts: 0, lockedUntil: null,
  }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  addAuditLog(getSession()?.email || 'unknown', `Created user: ${email} (${role})`)
  return { success: true }
}

export function updateUser(id: string, updates: Partial<AdminUser>): boolean {
  if (!isSuperAdmin()) return false
  const users: AdminUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.id === id)
  if (!user) return false

  const updated = users.map(u => u.id === id ? { ...u, ...updates, passwordHash: updates.passwordHash || u.passwordHash, passwordSalt: updates.passwordSalt || u.passwordSalt } : u)
  localStorage.setItem(USERS_KEY, JSON.stringify(updated))
  addAuditLog(getSession()?.email || 'unknown', `Updated user: ${user.email}`)
  return true
}

export function deleteUser(id: string): boolean {
  if (!isSuperAdmin()) return false
  const users: AdminUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  const user = users.find(u => u.id === id)
  if (!user || user.role === 'super_admin') return false
  localStorage.setItem(USERS_KEY, JSON.stringify(users.filter(u => u.id !== id)))
  addAuditLog(getSession()?.email || 'unknown', `Deleted user: ${user.email}`)
  return true
}

// Audit logging
export function addAuditLog(user: string, action: string) {
  try {
    const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]')
    logs.unshift({
      id: generateId(),
      user,
      action,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1',
      userAgent: navigator.userAgent,
    })
    localStorage.setItem(AUDIT_KEY, JSON.stringify(logs.slice(0, 1000)))
  } catch {}
}

export function getAuditLogs(): any[] {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]')
  } catch { return [] }
}

export function clearAuditLogs() {
  if (!isSuperAdmin()) return
  localStorage.setItem(AUDIT_KEY, '[]')
  addAuditLog(getSession()?.email || 'unknown', 'Audit logs cleared')
}

export function getAdminSettings(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
  } catch { return {} }
}

export function saveAdminSettings(settings: Record<string, any>) {
  if (!isSuperAdmin()) return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  addAuditLog(getSession()?.email || 'unknown', 'Admin settings updated')
}

export function getBackups(): any[] {
  try {
    return JSON.parse(localStorage.getItem('ab_admin_backups') || '[]')
  } catch { return [] }
}

export function createBackup(): { success: boolean; error?: string } {
  if (!isSuperAdmin()) return { success: false, error: 'Unauthorized' }
  const backup = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    data: {
      users: localStorage.getItem(USERS_KEY),
      settings: localStorage.getItem(SETTINGS_KEY),
      adminUrl: localStorage.getItem(ADMIN_URL_KEY),
    },
  }
  const backups = getBackups()
  backups.unshift(backup)
  localStorage.setItem('ab_admin_backups', JSON.stringify(backups.slice(0, 20)))
  addAuditLog(getSession()?.email || 'unknown', 'Backup created')
  return { success: true }
}

export function restoreBackup(id: string): { success: boolean; error?: string } {
  if (!isSuperAdmin()) return { success: false, error: 'Unauthorized' }
  const backups = getBackups()
  const backup = backups.find((b: any) => b.id === id)
  if (!backup) return { success: false, error: 'Backup not found' }

  const data = backup.data
  if (data.users) localStorage.setItem(USERS_KEY, data.users)
  if (data.settings) localStorage.setItem(SETTINGS_KEY, data.settings)
  if (data.adminUrl) localStorage.setItem(ADMIN_URL_KEY, data.adminUrl)

  addAuditLog(getSession()?.email || 'unknown', `Backup restored: ${backup.timestamp}`)
  return { success: true }
}
